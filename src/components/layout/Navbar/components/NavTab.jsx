const NavTab = ({ label, value, active, onClick }) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`text-xs relative pb-1 transition-colors ${
        active ? "text-orangedeep" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-[-6px] right-0 w-full h-1 bg-orangedeep rounded"></span>
      )}
    </button>
  );
};

export default NavTab;
