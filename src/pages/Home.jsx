import dolphinChild from "../assets/images/homeChild.png";
import { FaTelegramPlane, FaWhatsapp, Lock } from "../utils/icons";
import dolphinLogo from "../assets/Logo/dolphinLogo.png";
import { Kite, Plus } from "../utils/Illustrations";
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={dolphinLogo} alt={"logo"} className="h-10" />
        </div>

        {/* Nav buttons */}
        <div className="flex gap-3">
          <button className="flex items-center gap-1 border border-orangedeep rounded-full px-4 py-2 text-sm font-medium text-[#0C2D40] hover:bg-gray-50">
            {/* <Shield className="w-4 h-4" /> */}
            سياسة الخصوصية
          </button>
          <button className="flex items-center gap-1 border border-orangedeep rounded-full px-4 py-2 text-sm font-medium text-[#0C2D40] hover:bg-gray-50">
            عرض الباقات
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center px-6 mt-8">
        <div className="w-screen flex justify-end py-5">
          <Kite />
        </div>
        <div className="flex items-center gap-2 ">
          <img src={dolphinChild} alt="Path" className="h-46 mb-6" />

          <div>
            {/* Welcome Text */}
            <h1 className="text-2xl font-bold text-[#1B648E]">
              مرحباً بكم في منصة <br />
              <span className="text-[#1B648E]">دولفين التعليمية</span>
            </h1>
            {/* Mascot Image */}
            <div className="mascot pt-3">
              <svg
                width="218"
                height="31"
                viewBox="0 0 218 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.58266 28.3739C59.1646 5.20245 139.615 -3.66695 214.694 8.94163"
                  stroke="#E89B32"
                  stroke-width="5"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Divider decoration */}
        {/* <div className="w-32 h-1 bg-orangedeep skew-3  rounded-full my-4"></div> */}
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FCE9D6] rounded-t-full "></div>

        {/* Login Card */}
        <div className="border-2 border-dashed border-[#0C78B9] z-10 rounded-full px-6 py-6 mt-8 flex flex-row items-center w-full justify-around">
          <div className="pt-10">
            <Plus />
          </div>
          <div className="flex flex-col items-center  text-nowrap">
            <h2 className="text-lg font-semibold text-[#0C2D40]">
              سجل دخول للمنصة
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              للمستخدمين الجدد والحاليين
            </p>
            <button className="mt-4 flex  text-nowrap items-center gap-2 bg-orangedeep text-[#0C2D40] px-6 py-2 rounded-full shadow hover:scale-105 transition">
              <Lock size={18} />
              سجل الآن
            </button>
          </div>
          <div className="pb-10">
            <Plus />
          </div>
        </div>
      </main>

      {/* Background Decoration */}

      {/* Floating Social Buttons */}
      <div className="fixed bottom-6 right-6 space-x-4 px-4 flex gap-3 bg-white border-2 border-dashed border-[#0C78B9] rounded-full p-3 shadow">
        <button>
          <FaWhatsapp />
        </button>
        <button>
          <FaTelegramPlane />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
