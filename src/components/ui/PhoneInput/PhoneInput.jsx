import "react-international-phone/style.css";
import { useState, useEffect } from "react";
import {
  PhoneInput,
  defaultCountries,
  parseCountry,
} from "react-international-phone";
import { detectUserCountry } from "@/utils/countryDetection";
import { SUPPORTED_COUNTRIES } from "../../../constants/SUPPORTED_COUNTRIES";

// Supported countries configuration - جميع الدول العربية


// Filter allowed countries
const allowedCountries = defaultCountries.filter((country) => {
  const { iso2 } = parseCountry(country);
  return SUPPORTED_COUNTRIES.includes(iso2);
});

export default function MyPhone({ value, onChange }) {
  const [defaultCountry, setDefaultCountry] = useState(null); // null → wait for detection

  useEffect(() => {
    const detectCountry = async () => {
      const country = await detectUserCountry();
      setDefaultCountry(
        SUPPORTED_COUNTRIES.includes(country) ? country : "sa"
      );
    };
    detectCountry();
  }, []);

  const handlePhoneChange = (phone, meta) => {
    const countryCode = meta?.country?.iso2?.toUpperCase();
    const dialCode = `+${meta?.country?.dialCode}`;

    if (phone === dialCode) {
      onChange(dialCode, countryCode);
    } else {
      onChange(phone, countryCode);
    }
  };

  // Skeleton while detecting country
  if (!defaultCountry) {
    return (
      <div className="flex items-center justify-center py-3 animate-pulse">
        <div className="h-10 w-40 md:w-80 bg-gray-200 rounded-full" />
      </div>
    );
  }
  return (
    <div
      dir="ltr"
      className="px-4 border border-graycustom/50 rounded-full focus-within:border-orangedeep focus-within:ring-1 focus-within:ring-orangedeep transition-colors"
    >
      <PhoneInput
        value={value}
        countries={allowedCountries}
        onChange={handlePhoneChange}
        defaultCountry={defaultCountry}
        preferredCountries={["sa", "ae", "kw", "qa", "bh", "om"]}
        forceDialCode
        inputClassName="border-0! w-full text-base! rounded-none focus:outline-0! focus:ring-0! !focus:outline-orangedeep"
        countrySelectorStyleProps={{
          flagClassName: "border-0! w-7 h-7 bg-none!",
          buttonClassName:
            "border-0! bg-none! hover:bg-gray-50! transition-colors",
          dropdownStyleProps: {
            className: "border-0 focus:outline-0 shadow-lg",
          },
        }}
      />
    </div>
  );
}
