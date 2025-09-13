import React, { useState } from "react";
import { ChevronDown, DatePicker, SearchTransactions } from "@/utils/icons";
import highlight from "@/assets/balance/highlight.svg";

const TransactionsFilter = ({ onDateFilter }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("جميع الأشهر");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const monthOptions = [
    "الشهر الحالي",
    "الشهر الماضي",
    "آخر 3 شهور",
  ];

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
    setIsDropdownOpen(false);
    
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
      onDateFilter(startDate, endDate);
    }
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

  const handleSearch = () => {
    if (onDateFilter) {
      onDateFilter(fromDate, toDate);
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
                    className="w-4 md:w-5 cursor-pointer" 
                    onClick={() => document.getElementById('fromDateInput').showPicker()}
                  />
                  <input
                    id="fromDateInput"
                    type="date"
                    value={fromDate}
                    onChange={(e) => handleDateChange("from", e.target.value)}
                    className="appearance-none bg-transparent text-sm md:text-xl font-bold text-[#8C8C8C] focus:outline-none cursor-pointer opacity-0 absolute inset-0"
                    placeholder="mm/dd/yyyy"
                  />
                  <span className="text-sm md:text-xl font-bold text-[#8C8C8C] mr-2">
                    {fromDate || "اختر التاريخ"}
                  </span>
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
                    className="w-4 md:w-5 cursor-pointer" 
                    onClick={() => document.getElementById('toDateInput').showPicker()}
                  />
                  <input
                    id="toDateInput"
                    type="date"
                    value={toDate}
                    onChange={(e) => handleDateChange("to", e.target.value)}
                    className="appearance-none bg-transparent text-sm md:text-xl font-bold text-[#8C8C8C] focus:outline-none cursor-pointer opacity-0 absolute inset-0"
                    placeholder="mm/dd/yyyy"
                  />
                  <span className="text-sm md:text-xl font-bold text-[#8C8C8C] mr-2">
                    {toDate || "اختر التاريخ"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="flex bg-orangedeep hover:bg-btnClicked rounded-tr rounded-tl md:rounded-4xl 
                      w-full md:w-[140px] h-[50px] md:h-[90px] 
                      items-center justify-center 
                      cursor-pointer transition-colors duration-300"
          >
            <SearchTransactions className="w-5 md:w-6" />
          </button>
        </div>

         {/* Dropdown */}
        <div className="relative h-[50px] md:h-[90px]">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center gap-4 px-4 min-h-16 md:min-h-23 cursor-pointer min-w-[200px] rounded-2xl md:rounded-4xl border-[0.5px] border-[#8C8C8C66] overflow-hidden bg-white hover:bg-gray-50 transition-colors duration-300"
          >
            <span className="text-black font-bold text-base md:text-lg">{selectedMonth}</span>
            <ChevronDown className={`w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full mt-4 lg:mt-2 w-full py-4 px-10 bg-white border-[0.5px] border-[#8C8C8C66] rounded-2xl text-center z-10">
              {monthOptions.map((month) => (
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