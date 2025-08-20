import dolphinLogo from "../../../assets/Logo/dolphinLogo.png";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={dolphinLogo} alt="logo" className="h-10" />
      </div>

      {/* Nav buttons */}
      <div className="flex gap-3">
        <button className="flex items-center gap-1 border border-orangedeep rounded-full px-4 py-2 text-sm font-medium text-[#0C2D40] hover:bg-gray-50">
          سياسة الخصوصية
        </button>
        <button className="flex items-center gap-1 border border-orangedeep rounded-full px-4 py-2 text-sm font-medium text-[#0C2D40] hover:bg-gray-50">
          عرض الباقات
        </button>
      </div>
    </header>
  );
};

export default Navbar;
