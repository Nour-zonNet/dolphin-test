import React from "react";
import { Search } from "../../../utils/icons";

const PlansSearchBar = ({ value, onChange }) => {
  return (
    <div className=" mx-auto px-4 mt-6">
      <div className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-2 md:py-4 shadow-sm">
        <span className="text-gray-500 ml-2">
          <Search className="w-4 md:w-8" />
        </span>
        <input
          type="text"
          placeholder="استكشف الباقات..."
          className="flex-1 text-gray-700 focus:outline-none text-sm sm:text-base"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default React.memo(PlansSearchBar);
