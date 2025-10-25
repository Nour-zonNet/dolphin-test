import { useState } from "react";

import caretDown from "@/assets/authentication/caret-down.svg";
import { COUNTRIES } from "../../../constants/countries";

// -------- Country Selector --------
const CountrySelector = ({ selectedCountry, setSelectedCountry }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-3  cursor-pointer"
      >
        <img
          src={selectedCountry.flag}
          alt={selectedCountry.name}
          className="w-8 h-8"
        />
        <img src={caretDown} alt="caret" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
          {COUNTRIES.map((c) => (
            <div
              key={c.name}
              onClick={() => {
                setSelectedCountry(c);
                setOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <img src={c.flag} alt={c.name} className="w-5 h-5" />
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
