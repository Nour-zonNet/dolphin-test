import React from "react";
import { ChevronDown, DatePicker, SearchTransactions } from "@/utils/icons"
import highlight from "@/assets/balance/highlight.svg"

const TransactionsFilter = () => {
  return (
    <div className="w-[90%] mx-auto mt-10">
      <div className="relative">
        <h2 className="text-xl md:text-[32px] font-bold text-navyteal">سجل المعاملات</h2>
        <img src={highlight} alt="highlight" className="absolute top-0 right-12 md:right-18 -z-1 w-24 md:w-auto" />
      </div>
      <div className="flex items-center justify-between rounded-4xl border border-[#8C8C8C] overflow-hidden shadow-sm bg-white mt-12">

        <div className="flex items-center justify-between min-w-5xl">
            {/* From Date */}
        <div className="flex items-center gap-2 px-4 flex-1 border-l-3 border-[#165072]">
          <div className="flex flex-col gap-2 ms-14">
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
        <div className="flex items-center gap-2 px-4 flex-1 border-l-3 border-[#165072]">
          <div className="flex flex-col gap-2 ms-14">
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
        {/* Dropdown */}
        <div className="flex items-center gap-4 px-4 cursor-pointer min-w-[120px] ms-14">
          <span className="text-black font-bold text-lg">جميع الأشهر</span>
          <ChevronDown className="w-4" />
        </div>
        </div>
        {/* Search Button */}
        <button className="bg-orangedeep rounded-4xl w-[140px] h-[90px] p-4 flex items-center justify-center">
          <SearchTransactions className="w-6 h-6 text-black" />
        </button>
        
      </div>
    </div>
  );
};

export default TransactionsFilter;
