const NavTab = ({ label, value, active, onClick }) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`text-xl relative pb-1 transition-colors focus:outline-0 cursor-pointer ${
        active ? "text-orangedeep " : "text-graycustom hover:text-gray-700"
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-[-4px] right-0 w-full h-1 bg-orangedeep rounded"></span>
      )}
    </button>
  );
};

export default NavTab;
