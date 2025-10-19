import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, DatePicker, SearchTransactions } from "@/utils/icons";
import highlight from "@/assets/balance/highlight.svg";

const TransactionsFilter = ({ onDateFilter, onFiltering }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("جميع الأشهر");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const dropdownRef = useRef(null);

  const monthOptions = [
    "جميع الأشهر",
    "الشهر الحالي",
    "الشهر الماضي",
    "آخر 3 شهور",
  ];

  // Always show all options in the dropdown
  const filteredMonthOptions = monthOptions;

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

  const handleSelectMonth = async (month) => {
    setSelectedMonth(month);
    setIsDropdownOpen(false);
    setIsFiltering(true);
    
    // تطبيق التصفية حسب الشهر المحدد
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
      await onDateFilter(startDate, endDate);
    }
    
    // Notify parent component about filtering state
    if (onFiltering) {
      onFiltering(true);
    }
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setIsFiltering(false);
      if (onFiltering) {
        onFiltering(false);
      }
    }, 500);
  };

  const handleDateChange = (type, value) => {
    if (type === "from") {
      setFromDate(value);
    } else {
      setToDate(value);
    }

    // إعادة تعيين الشهر المحدد إذا تم تغيير التاريخ يدوياً
    if (selectedMonth !== "جميع الأشهر") {
      setSelectedMonth("جميع الأشهر");
    }
  };

  const handleSearch = async () => {
    // Validate date range
    if (fromDate && toDate && fromDate > toDate) {
      alert("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");
      return;
    }

    setIsFiltering(true);
    
    // Notify parent component about filtering state
    if (onFiltering) {
      onFiltering(true);
    }

    // If no dates are selected, show all transactions
    if (!fromDate && !toDate) {
      if (onDateFilter) {
        await onDateFilter("", "");
      }
    } else {
      if (onDateFilter) {
        await onDateFilter(fromDate, toDate);
      }
    }
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setIsFiltering(false);
      if (onFiltering) {
        onFiltering(false);
      }
    }, 500);
  };


  return (
    <div className="w-[90%] mx-auto mt-10 relative">
      <div className="relative">
        <h2 className="text-base md:text-[32px] font-bold text-navyteal">
          سجل المعاملات
        </h2>
        <img
          src={highlight}
          alt="highlight"
          className="absolute top-0 right-10 md:right-18 -z-1 w-24 md:w-auto"
        />
      </div>


      {/* Main filter box */}
      <div className="flex items-stretch flex-col md:flex-row gap-6 my-12">
        <div className="flex flex-col md:flex-row items-center justify-between w-full rounded-2xl md:rounded-4xl border-[0.5px] border-[#8C8C8C66] overflow-hidden bg-white relative">
          <div className="flex flex-col md:flex-row items-center justify-between w-full">
            {/* From Date */}
            <div className="flex items-center gap-2 px-4 py-4 lg:py-0 flex-1 lg:border-l-3 md:border-[#165072] w-full border-b md:border-b-0 border-[#D9D9D9]">
              <div className="flex flex-row md:flex-col items-center gap-8 md:gap-2 ms-0 lg:ms-14 w-full">
                <span className="text-black font-bold text-[12px] md:text-lg text-nowrap">
                  من تاريخ:
                </span>
                <div className="flex items-center relative">
                  <DatePicker 
                    className="w-4 md:w-5 cursor-pointer z-10" 
                    onClick={() => document.getElementById('fromDateInput').showPicker()}
                  />
                  <input
                    id="fromDateInput"
                    type="date"
                    value={fromDate}
                    onChange={(e) => handleDateChange("from", e.target.value)}
                    className="w-full h-10 md:h-12 bg-transparent text-sm md:text-base font-bold text-[#8C8C8C] focus:outline-none cursor-pointer"
                    placeholder="اختر التاريخ"
                    title="اختر تاريخ البداية"
                  />
                </div>
              </div>
            </div>

            {/* To Date */}
            <div className="flex items-center gap-2 px-4 flex-1 w-full py-4 md:py-0 lg:mt-0 border-b md:border-b-0 border-[#D9D9D9]">
              <div className="flex flex-row md:flex-col items-center gap-8 md:gap-2 ms-0 lg:ms-14 w-full">
                <span className="text-black font-bold text-[12px] md:text-lg text-nowrap">
                  إلى تاريخ:
                </span>
                <div className="flex items-center relative">
                  <DatePicker 
                    className="w-4 md:w-5 cursor-pointer z-10" 
                    onClick={() => document.getElementById('toDateInput').showPicker()}
                  />
                  <input
                    id="toDateInput"
                    type="date"
                    value={toDate}
                    onChange={(e) => handleDateChange("to", e.target.value)}
                    className="w-full h-10 md:h-12 bg-transparent text-sm md:text-base font-bold text-[#8C8C8C] focus:outline-none cursor-pointer"
                    placeholder="اختر التاريخ"
                    title="اختر تاريخ النهاية"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={isFiltering}
              className={`flex rounded-tr rounded-tl md:rounded-4xl 
                        w-full md:w-[140px] h-[50px] md:h-[90px] 
                        items-center justify-center 
                        transition-colors duration-300 ${
                          isFiltering 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-orangedeep hover:bg-btnClicked cursor-pointer'
                        }`}
            >
              {isFiltering ? (
                <div className="w-5 md:w-6 h-5 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <SearchTransactions className="w-5 md:w-6" />
              )}
            </button>
          </div>
        </div>

         {/* Dropdown */}
        <div ref={dropdownRef} className="relative h-[50px] md:h-[90px]">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center gap-4 px-4 min-h-16 md:min-h-23 cursor-pointer min-w-[200px] rounded-2xl md:rounded-4xl border-[0.5px] border-[#8C8C8C66] overflow-hidden bg-white hover:bg-gray-50 transition-colors duration-300"
          >
            <span className="text-black font-bold text-base md:text-lg">{selectedMonth}</span>
            <ChevronDown className={`w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full mt-4 lg:mt-2 w-full py-4 px-10 bg-white border-[0.5px] border-[#8C8C8C66] rounded-2xl text-center z-10">
              {filteredMonthOptions.map((month) => (
                <div
                  key={month}
                  onClick={() => handleSelectMonth(month)}
                  className="px-4 cursor-pointer font-bold text-nowrap text-base md:text-lg text-black border-b border-[#D9D9D9] last:border-b-0 py-4"
                >
                  {month}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsFilter;