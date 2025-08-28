const NavTab = ({ label, value, active, onClick }) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`relative pb-1 transition-colors focus:outline-0 cursor-pointer
        text-sm sm:text-lg md:text-xl lg:text-2xl text-nowrap
        ${active ? "text-orangedeep" : "text-graycustom hover:text-gray-700"}
      `}
    >
      {label}
      {active && (
        <span className="absolute bottom-[-3px] md:bottom-[-4px] right-0 w-full h-[2px] md:h-[4px] bg-orangedeep rounded"></span>
      )}
    </button>
  );
};

export default NavTab;
