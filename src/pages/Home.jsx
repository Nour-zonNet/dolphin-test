import dolphinChild from "../assets/images/homeChild.png";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Dolphin Logo" className="h-10" />
        </div>

        {/* Nav buttons */}
        <div className="flex gap-3">
          <button className="flex items-center gap-1 border rounded-full px-4 py-2 text-sm font-medium text-[#0C2D40] hover:bg-gray-50">
            {/* <Shield className="w-4 h-4" /> */}
            سياسة الخصوصية
          </button>
          <button className="flex items-center gap-1 border rounded-full px-4 py-2 text-sm font-medium text-[#0C2D40] hover:bg-gray-50">
            عرض الباقات
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-6 mt-8">
        {/* Airplane path */}
        <img src={dolphinChild} alt="Path" className="h-16 mb-6" />

        {/* Welcome Text */}
        <h1 className="text-2xl font-bold text-[#0C2D40]">
          مرحباً بكم في منصة <br />
          <span className="text-[#0C78B9]">دولفين التعليمية</span>
        </h1>

        {/* Mascot Image */}
        <img src="/mascot.png" alt="Mascot" className="h-32 mt-6" />

        {/* Divider decoration */}
        <div className="w-32 h-1 bg-[#E89B32] rounded-full my-4"></div>

        {/* Login Card */}
        <div className="border-2 border-dashed border-[#0C78B9] rounded-2xl px-6 py-6 mt-8 flex flex-col items-center max-w-md">
          <h2 className="text-lg font-semibold text-[#0C2D40]">
            سجل دخول للمنصة
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            للمستخدمين الجدد والحاليين
          </p>
          <button className="mt-4 flex items-center gap-2 bg-[#E89B32] text-[#0C2D40] px-6 py-2 rounded-full shadow hover:scale-105 transition">
            سجل الآن
            {/* <Lock className="w-4 h-4" /> */}
          </button>
        </div>
      </main>

      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FCE9D6] rounded-t-full"></div>

      {/* Floating Social Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <button className="bg-white border-2 border-dashed border-[#0C78B9] rounded-full p-3 shadow">
          {/* <FaTelegramPlane className="text-sky-500 w-6 h-6" /> */}
        </button>
        <button className="bg-white border-2 border-dashed border-[#0C78B9] rounded-full p-3 shadow">
          {/* <FaWhatsapp className="text-green-500 w-6 h-6" /> */}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
