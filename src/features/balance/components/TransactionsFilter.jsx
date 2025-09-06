import React from "react";
import { ChevronDown, DatePicker, SearchTransactions } from "@/utils/icons";
import highlight from "@/assets/balance/highlight.svg";

const TransactionsFilter = () => {
  return (
    <div className="w-[90%] mx-auto mt-10 relative">
      <div className="relative">
        <h2 className="text-xl md:text-[32px] font-bold text-navyteal">
          سجل المعاملات
        </h2>
        <img
          src={highlight}
          alt="highlight"
          className="absolute top-0 right-12 md:right-18 -z-1 w-24 md:w-auto"
        />
      </div>

      {/* Main filter box */}
      <div className="flex flex-col lg:flex-row items-center justify-between rounded-4xl border border-[#8C8C8C] overflow-hidden shadow-sm bg-white mt-12 relative pb-28 lg:pb-0">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full">
          {/* From Date */}
          <div className="flex items-center gap-2 px-4 py-4 lg:py-0 flex-1 lg:border-l-3 border-[#165072] w-full">
            <div className="flex flex-row lg:flex-col gap-14 lg:gap-2 ms-0 lg:ms-14 w-full border-b-[0.5px] border-[#D9D9D9]">
              <span className="text-black font-bold text-lg">من تاريخ:</span>
              <div className="flex items-center">
                <DatePicker className="w-5" />
                <input
                  type="date"
                  className="appearance-none bg-transparent text-base md:text-xl font-bold text-[#8C8C8C] focus:outline-none"
                  placeholder="mm/dd/yyyy"
                />
              </div>
            </div>
          </div>

          {/* To Date */}
          <div className="flex items-center gap-2 px-4 flex-1 lg:border-l-3 border-[#165072] w-full mt-6 lg:mt-0">
            <div className="flex flex-row lg:flex-col gap-14 lg:gap-2 ms-0 lg:ms-14 w-full border-b-[0.5px] border-[#D9D9D9]">
              <span className="text-black font-bold text-lg">إلى تاريخ:</span>
              <div className="flex items-center">
                <DatePicker className="w-5" />
                <input
                  type="date"
                  className="appearance-none bg-transparent text-base md:text-xl font-bold text-[#8C8C8C] focus:outline-none"
                  placeholder="mm/dd/yyyy"
                />
              </div>
            </div>
          </div>

          {/* Dropdown (Desktop Layout) */}
          <div className="hidden lg:flex items-center gap-4 px-4 cursor-pointer min-w-[120px] ms-0 lg:ms-14 mt-6 lg:mt-0">
            <span className="text-black font-bold text-lg">جميع الأشهر</span>
            <ChevronDown className="w-4" />
          </div>
        </div>

        {/* Search Button (Desktop Layout) */}
        <button className="hidden lg:flex bg-orangedeep rounded-4xl w-[140px] h-[90px] p-4 items-center justify-center lg:static absolute bottom-4 left-4">
          <SearchTransactions className="w-6 h-6 text-black" />
        </button>

        {/* Mobile Layout for search and all months */}
        <div className="flex items-center justify-between">
          <div className="flex lg:hidden items-center gap-4 mt-4 cursor-pointer">
            <span className="text-black font-bold text-lg">جميع الأشهر</span>
            <ChevronDown className="w-4" />
          </div>
          <button className="flex lg:hidden bg-orangedeep rounded rounded-bl-4xl w-[140px] h-[90px] items-center justify-center">
            <SearchTransactions className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsFilter;
