import { useTranslation } from "react-i18next";

const NavTab = ({ label, labelKey, value, active, onClick }) => {
  const { t } = useTranslation();
  const displayLabel = labelKey ? t(labelKey) : label;

  return (
    <button
      onClick={() => onClick(value)}
      className={`relative pb-1 transition-colors focus:outline-0 cursor-pointer
        text-sm sm:text-sm md:text-2xl lg:text-2xl text-nowrap
        ${active ? "text-orangedeep" : "text-graycustom hover:text-gray-700"}
      `}
    >
      {displayLabel}
      {active && (
        <span className="absolute bottom-[-5px] md:bottom-[-4px] right-0 w-full h-[2px] md:h-[4px] bg-orangedeep rounded"></span>
      )}
    </button>
  );
};

export default NavTab;
