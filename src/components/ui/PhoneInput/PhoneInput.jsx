import "react-international-phone/style.css";
import {
  PhoneInput,
  defaultCountries,
  parseCountry,
} from "react-international-phone";

// Supported countries configuration
const SUPPORTED_COUNTRIES = ["qa", "eg", "sa"];

/**
 * Get default country based on browser language
 * @returns {string} Country code (eg, sa, qa)
 */
const getDefaultCountry = () => {
  const lang = navigator.language.toLowerCase();

  if (lang.includes("eg")) return "eg";
  if (lang.includes("sa")) return "sa";
  if (lang.includes("qa")) return "qa";

  return "eg"; // Default fallback
};

// Filter allowed countries
const allowedCountries = defaultCountries.filter((country) => {
  const { iso2 } = parseCountry(country);
  return SUPPORTED_COUNTRIES.includes(iso2);
});

/**
 * Custom Phone Input component with validation support
 * @param {Object} props - Component props
 * @param {string} props.value - Current phone value
 * @param {Function} props.onChange - Change handler (phone, countryCode)
 */
export default function MyPhone({ value, onChange }) {
  const handlePhoneChange = (phone, meta) => {
    const countryCode = meta?.country?.iso2?.toUpperCase();
    const dialCode = `+${meta?.country?.dialCode}`;

    // If user just changed country, set to dial code only
    if (phone === dialCode) {
      onChange(dialCode, countryCode);
    } else {
      onChange(phone, countryCode);
    }
  };

  return (
    <div
      dir="ltr"
      className=" px-4 border border-graycustom/50 rounded-full focus-within:border-orangedeep focus-within:ring-1 focus-within:ring-orangedeep transition-colors "
    >
      <PhoneInput
        value={value}
        countries={allowedCountries}
        onChange={handlePhoneChange}
        defaultCountry={getDefaultCountry()}
        preferredCountries={SUPPORTED_COUNTRIES}
        disableCountryGuess={false}
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
