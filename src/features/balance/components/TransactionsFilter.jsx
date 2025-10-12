import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, SearchTransactions, Cross } from "@/utils/icons";

/**
 * Enhanced Transactions Filter Component
 * Supports date filtering, month selection, and clear filters functionality
 */
const TransactionsFilter = ({ 
  onDateFilter, 
  onClearFilters, 
  hasActiveFilters = false,
  className = '' 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("جميع الأشهر");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const dropdownRef = useRef(null);

  const monthOptions = [
    "جميع الأشهر",
    "الشهر الحالي",
    "الشهر الماضي",
    "آخر 3 شهور",
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
    setIsDropdownOpen(false);
    
    // Apply filtering based on selected month
    const today = new Date();
    let startDate = "";
    let endDate = "";

    switch (month) {
      case "الشهر الحالي":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      case "الشهر الماضي":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
        endDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
        break;
      case "آخر 3 شهور":
        startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1).toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      default:
        startDate = "";
        endDate = "";
    }

    setFromDate(startDate);
    setToDate(endDate);
    
    if (onDateFilter) {
      onDateFilter(startDate, endDate);
    }
  };

  const handleDateChange = (type, value) => {
    if (type === "from") {
      setFromDate(value);
    } else {
      setToDate(value);
    }

    // Reset selected month if date is changed manually
    if (selectedMonth !== "جميع الأشهر") {
      setSelectedMonth("جميع الأشهر");
    }
  };

  const handleSearch = () => {
    // Validate date range
    if (fromDate && toDate && fromDate > toDate) {
      alert("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");
      return;
    }

    // If no dates are selected, show all transactions
    if (!fromDate && !toDate) {
      if (onDateFilter) {
        onDateFilter("", "");
      }
      return;
    }

    if (onDateFilter) {
      onDateFilter(fromDate, toDate);
    }
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedMonth("جميع الأشهر");
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className={`w-[90%] mx-auto mt-10 relative ${className}`}>
      <div className="relative">
        <h2 className="text-base md:text-[32px] font-bold text-navyteal">
          سجل المعاملات
        </h2>
        
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {/* Month Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full md:w-48 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-sm font-medium text-gray-700">{selectedMonth}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {monthOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectMonth(option)}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      selectedMonth === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Inputs */}
          <div className="flex flex-col md:flex-row gap-2 flex-1">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                من تاريخ
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => handleDateChange("from", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                إلى تاريخ
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => handleDateChange("to", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 items-end">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <SearchTransactions className="w-4 h-4" />
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                title="مسح الفلاتر"
              >
                <Cross className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsFilter;