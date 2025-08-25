import { useState } from "react";

import flagSA from "@/assets/authentication/flag.svg";
import caretDown from "@/assets/authentication/caret-down.svg";
export const countries = [
  { name: "السعودية", code: "+966", flag: flagSA },
  { name: "الإمارات", code: "+971", flag: flagSA },
  { name: "الكويت", code: "+965", flag: flagSA },
  { name: "قطر", code: "+974", flag: flagSA },
  { name: "البحرين", code: "+973", flag: flagSA },
  { name: "عُمان", code: "+968", flag: flagSA },
];

// -------- Country Selector --------
const CountrySelector = ({ selectedCountry, setSelectedCountry }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-3 border-r cursor-pointer"
      >
        <img
          src={selectedCountry.flag}
          alt={selectedCountry.name}
          className="w-6 h-6"
        />
        <img src={caretDown} alt="caret" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
          {countries.map((c) => (
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
