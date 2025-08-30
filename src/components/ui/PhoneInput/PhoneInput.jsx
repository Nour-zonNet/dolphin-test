import "react-international-phone/style.css";
import {
  PhoneInput,
  defaultCountries,
  parseCountry,
} from "react-international-phone";

const getDefaultCountry = () => {
  const lang = navigator.language.toLowerCase(); // مثال: "ar-eg", "ar-sa", "ar-qa"
  if (lang.includes("eg")) return "eg";
  if (lang.includes("sa")) return "sa";
  if (lang.includes("qa")) return "qa";
  return "eg"; // fallback
};
// نحدد الدول المسموح بيها فقط
const allowedCountries = defaultCountries.filter((c) => {
  const { iso2 } = parseCountry(c);
  return ["qa", "eg", "sa"].includes(iso2);
});

export default function MyPhone({ value, onChange }) {
  return (
    <div
      dir="ltr"
      className="p-1 px-4 border   border-graycustom/50 rounded-full focus:outline-0"
    >
      <PhoneInput
        value={value}
        countries={allowedCountries}
        onChange={(phone, meta) => {
          // Send both phone and country code to parent
          onChange(phone, meta?.country?.iso2?.toUpperCase());
        }}
        defaultCountry={getDefaultCountry()}
        preferredCountries={["sa", "eg", "qa"]}
        disableCountryGuess={false}
        forceDialCode
        inputClassName="border-0! w-full text-base! rounded-none focus:outline-0!"
        countrySelectorStyleProps={{
          flagClassName: "border-0! w-7 h-7 bg-none!",
          buttonClassName: " border-0! bg-none! ",
          dropdownStyleProps: {
            className: "border-0 focus:outline-0",
          },
        }}
      />
    </div>
  );
}
