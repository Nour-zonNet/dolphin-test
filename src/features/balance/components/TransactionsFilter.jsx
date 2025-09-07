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
      <div className="flex items-stretch flex-col md:flex-row gap-6 my-20">
        <div className="flex flex-col md:flex-row items-center justify-between w-full rounded-2xl md:rounded-4xl border-[0.5px] border-[#8C8C8C66] overflow-hidden shadow-sm bg-white relative">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full">
            {/* From Date */}
            <div className="flex items-center gap-2 px-4 py-4 lg:py-0 flex-1 lg:border-l-3 md:border-[#165072] w-full border-b md:border-b-0 border-[#D9D9D9]">
              <div className="flex flex-row lg:flex-col gap-8 lg:gap-2 ms-0 lg:ms-14 w-full">
                <span className="text-black font-bold text-lg text-nowrap">
                  من تاريخ:
                </span>
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
            <div className="flex items-center gap-2 px-4 flex-1 w-full py-4 md:py-0 lg:mt-0 border-b md:border-b-0 border-[#D9D9D9]">
              <div className="flex flex-row lg:flex-col gap-8 lg:gap-2 ms-0 lg:ms-14 w-full">
                <span className="text-black font-bold text-lg text-nowrap">
                  إلى تاريخ:
                </span>
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
          </div>

          {/* Search Button */}
          <button
            className="flex bg-orangedeep rounded-tr rounded-tl md:rounded-4xl 
                       w-full md:w-[140px] h-[60px] md:h-[90px] 
                       items-center justify-center 
                       cursor-pointer"
          >
            <SearchTransactions className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Dropdown (Desktop Layout) */}
        <div className="flex items-center justify-center gap-4 px-4 min-h-16 cursor-pointer min-w-[200px] rounded-2xl md:rounded-4xl border-[0.5px] border-[#8C8C8C66] overflow-hidden shadow-sm bg-white">
          <span className="text-black font-bold text-lg">جميع الأشهر</span>
          <ChevronDown className="w-4" />
        </div>
      </div>
    </div>
  );
};

export default TransactionsFilter;
