import { ChevronDown, ChevronUp } from "@/utils/icons";
import { useState } from "react";

const PeriodDropdown = ({ selectedPeriod, onPeriodChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const periods = [
    { value: "month", label: "شهري" },
    { value: "quarter", label: "فصلي" }
  ];

  const handlePeriodSelect = (period) => {
    onPeriodChange(period);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-navyteal text-base md:text-2xl font-semibold">اداء المواد الدراسية</h3>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-center gap-3 px-4 py-2 text-navyteal border border-[#B8C1C8] rounded-lg hover:border-orangedeep transition-all duration-200 md:min-w-[120px]"
        >
          <span>{periods.find(p => p.value === selectedPeriod)?.label}</span>
          <div className="transition-transform duration-200">
            {isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
        
        <div className={`absolute top-full left-0 mt-2 w-full border border-[#B8C1C8] rounded-lg shadow-lg bg-white z-10 transition-all duration-200 ${
          isDropdownOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}>
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => handlePeriodSelect(period.value)}
              className="w-full px-4 py-2 text-left text-navyteal hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeriodDropdown;
