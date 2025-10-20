import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, DatePicker, SearchTransactions } from "@/utils/icons";
import highlight from "@/assets/balance/highlight.svg";
import { Search } from "lucide-react";
import { SearchFilter } from "../../../utils/icons";

const TransactionsFilter = ({ onDateFilter, onFiltering, onSearch, onStatusFilter }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("جميع الأشهر");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("الكل");
  const dropdownRefDesktop = useRef(null);
  const dropdownRefMobile = useRef(null);

  const monthOptions = [
    "جميع الأشهر",
    "الشهر الحالي",
    "الشهر الماضي",
    "آخر 3 شهور",
  ];

  const statusOptions = [
    { value: "الكل", label: "الكل" },
    { value: "completed", label: "مكتمل" },
    { value: "canceled", label: "مرفوض" },
    { value: "pending", label: "معلق" },
  ];

  // Always show all options in the dropdown
  const filteredMonthOptions = monthOptions;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isDesktopDropdownOpen = dropdownRefDesktop.current && dropdownRefDesktop.current.contains(event.target);
      const isMobileDropdownOpen = dropdownRefMobile.current && dropdownRefMobile.current.contains(event.target);
      
      if (isDropdownOpen && !isDesktopDropdownOpen && !isMobileDropdownOpen) {
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

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Call search callback if provided
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    
    // Call status filter callback if provided
    if (onStatusFilter) {
      onStatusFilter(status);
    }
  };

  const handleReset = () => {
    setSelectedMonth("جميع الأشهر");
    setFromDate("");
    setToDate("");
    setSearchQuery("");
    setSelectedStatus("الكل");
    
    // Reset filters
    if (onDateFilter) {
      onDateFilter("", "");
    }
    if (onSearch) {
      onSearch("");
    }
    if (onStatusFilter) {
      onStatusFilter("الكل");
    }
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

      {/* Search Input with Filter */}
      <div className="my-12 relative">
        <div className="relative">
          {/* Desktop Layout: Search Input and Status Filters Side by Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="البحث في المعاملات..."
                className="w-full h-16 px-16 pr-20 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent"
              />
              
              {/* Filter Icon (Left) */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="فتح خيارات التصفية"
              >
                <SearchFilter className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Search Icon (Right) */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>

              {/* Filter Popup - Desktop */}
              {isDropdownOpen && (
                <div ref={dropdownRefDesktop} className="absolute top-full mt-4 left-0 right-0 bg-white border border-gray-300 rounded-2xl shadow-lg z-50 p-6">
                  <div className="relative flex items-center justify-between mb-6">
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute top-0 right-4"
                      aria-label="إغلاق"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <h3 className="text-lg text-center font-bold text-navyteal w-full">خيارات التصفية</h3>
                  </div>
                  <div className="border border-[#D9D9D9] rounded-[16px] p-8 mb-10">
                    {/* Filter by Months */}
                    <div className="mb-6">
                      <h4 className="text-base font-bold text-navyteal mb-4">تصفية بالشهور</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {monthOptions.map((month) => (
                          <button
                            key={month}
                            onClick={() => handleSelectMonth(month)}
                            className={`px-4 py-3 rounded-full text-xs md:text-sm text-nowrap font-bold transition-colors ${
                              selectedMonth === month
                                ? 'bg-orangedeep text-white'
                                : 'border border-[#4F4F5066] text-[#3B3B3C] hover:bg-gray-100'
                            }`}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter by Date */}
                    <div className="mb-6">
                      <h4 className="text-base font-bold text-navyteal mb-4">تصفية بالتاريخ</h4>
                      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">من :</label>
                          <div className="relative">
                            <DatePicker 
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer z-10" 
                              onClick={() => document.getElementById('fromDateInput').showPicker()}
                            />
                            <input
                              id="fromDateInput"
                              type="date"
                              value={fromDate}
                              onChange={(e) => handleDateChange("from", e.target.value)}
                              className="w-full h-10 md:h-12 pl-10 pr-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent"
                              title="اختر تاريخ البداية"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">إلي :</label>
                          <div className="relative">
                            <DatePicker 
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer z-10" 
                              onClick={() => document.getElementById('toDateInput').showPicker()}
                            />
                            <input
                              id="toDateInput"
                              type="date"
                              value={toDate}
                              onChange={(e) => handleDateChange("to", e.target.value)}
                              className="w-full h-10 md:h-12 pl-10 pr-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent"
                              title="اختر تاريخ النهاية"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSearch}
                      disabled={isFiltering}
                      className={`flex-1 h-10 md:h-12 rounded-full font-semibold transition-colors cursor-pointer text-sm md:text-base ${
                        isFiltering 
                          ? 'bg-orangedeep cursor-not-allowed text-white' 
                          : 'bg-orangedeep hover:bg-btnClicked text-navyteal'
                      }`}
                    >
                      {isFiltering ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto text-navyteal cursor-pointer"></div>
                      ) : (
                        'تصفية'
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 h-10 md:h-12 rounded-full font-semibold border border-orangedeep text-navyteal hover:bg-orangedeep transition-colors cursor-pointer text-sm md:text-base"
                    >
                      اعادة تعيين
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter Buttons */}
            <div className="flex gap-3">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusFilter(status.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedStatus === status.value
                      ? 'bg-orangedeep text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Layout: Search Input Above, Status Filters Below */}
          <div className="md:hidden">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="البحث في المعاملات..."
                className="w-full h-14 px-16 pr-20 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent"
              />
              
              {/* Filter Icon (Left) */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="فتح خيارات التصفية"
              >
                <SearchFilter className="w-4 h-4 text-gray-600" />
              </button>
              
              {/* Search Icon (Right) */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>

              {/* Filter Popup - Mobile */}
              {isDropdownOpen && (
                <div ref={dropdownRefMobile} className="absolute top-full mt-4 left-0 right-0 bg-white border border-gray-300 rounded-2xl shadow-lg z-50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-navyteal">خيارات التصفية</h3>
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="إغلاق"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Filter by Months */}
                  <div className="mb-6">
                    <h4 className="text-base font-bold text-navyteal mb-4">تصفية بالشهور</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {monthOptions.map((month) => (
                        <button
                          key={month}
                          onClick={() => handleSelectMonth(month)}
                          className={`px-4 py-3 rounded-full text-xs md:text-sm text-nowrap font-bold transition-colors md:max-w-fit ${
                            selectedMonth === month
                              ? 'bg-orangedeep text-white'
                              : 'border border-[#4F4F5066] text-[#3B3B3C] hover:bg-gray-100'
                          }`}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter by Date */}
                  <div className="mb-6">
                    <h4 className="text-base font-bold text-navyteal mb-4">تصفية بالتاريخ</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">من :</label>
                        <div className="relative">
                          <DatePicker 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer z-10" 
                            onClick={() => document.getElementById('fromDateInputMobile').showPicker()}
                          />
                          <input
                            id="fromDateInputMobile"
                            type="date"
                            value={fromDate}
                            onChange={(e) => handleDateChange("from", e.target.value)}
                            className="w-full h-10 md:h-12 pl-10 pr-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent"
                            title="اختر تاريخ البداية"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">إلي :</label>
                        <div className="relative">
                          <DatePicker 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer z-10" 
                            onClick={() => document.getElementById('toDateInputMobile').showPicker()}
                          />
                          <input
                            id="toDateInputMobile"
                            type="date"
                            value={toDate}
                            onChange={(e) => handleDateChange("to", e.target.value)}
                            className="w-full h-10 md:h-12 pl-10 pr-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent"
                            title="اختر تاريخ النهاية"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSearch}
                      disabled={isFiltering}
                      className={`flex-1 h-10 md:h-12 rounded-full font-semibold transition-colors cursor-pointer text-sm md:text-base ${
                        isFiltering 
                          ? 'bg-orangedeep cursor-not-allowed text-white' 
                          : 'bg-orangedeep hover:bg-btnClicked text-navyteal'
                      }`}
                    >
                      {isFiltering ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto text-navyteal cursor-pointer"></div>
                      ) : (
                        'تصفية'
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 h-10 md:h-12 rounded-full font-semibold border border-orangedeep text-navyteal hover:bg-orangedeep transition-colors cursor-pointer text-sm md:text-base"
                    >
                      اعادة تعيين
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter Buttons */}
            <div className="flex gap-3 mt-4">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusFilter(status.value)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm text-nowrap font-medium transition-colors ${
                    selectedStatus === status.value
                      ? 'bg-orangedeep text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TransactionsFilter;