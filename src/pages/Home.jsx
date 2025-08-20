import dolphinChild from "../assets/images/homeChild.png";
import { FaTelegramPlane, FaWhatsapp, Lock, Plus } from "../utils/icons";
import dolphinLogo from "../assets/Logo/dolphinLogo.png";
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
          <svg
            width="289"
            height="167"
            viewBox="0 0 289 167"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M278.163 140.493C269.843 138.012 261.509 135.531 253.188 133.05C252.011 132.7 252.512 130.853 253.702 131.217C262.023 133.698 270.357 136.178 278.677 138.659C279.841 138.996 279.34 140.843 278.163 140.493Z"
              fill="#00477C"
            />
            <path
              d="M252.958 133.266C233.192 139.954 213.413 146.641 193.647 153.329C192.591 153.679 192.01 152.142 192.916 151.589C208.718 141.989 224.506 132.376 240.308 122.777C241.364 122.129 242.324 123.788 241.269 124.421C225.467 134.021 209.679 143.634 193.877 153.234C193.633 152.654 193.389 152.075 193.146 151.495C212.912 144.807 232.692 138.12 252.458 131.432C253.621 131.028 254.122 132.875 252.958 133.266Z"
              fill="#00477C"
            />
            <path
              d="M279.34 143.136C244.462 150.322 209.448 156.848 174.327 162.713C173.122 162.915 172.608 161.081 173.812 160.879C208.934 155.014 243.947 148.488 278.825 141.302C280.043 141.059 280.557 142.893 279.34 143.136Z"
              fill="#00477C"
            />
            <path
              d="M240.904 123.707C231.257 123.087 221.638 122.156 212.046 120.916C210.842 120.754 210.828 118.853 212.046 119.015C221.638 120.255 231.244 121.186 240.904 121.806C242.121 121.887 242.135 123.788 240.904 123.707Z"
              fill="#00477C"
            />
            <path
              d="M171.269 160.731C184.96 145.374 199.45 130.799 214.751 117.019C215.658 116.197 217.024 117.545 216.104 118.368C200.803 132.134 186.313 146.708 172.622 162.079C171.81 162.996 170.457 161.647 171.269 160.731Z"
              fill="#00477C"
            />
            <path
              d="M254.5 130.529C254.528 121.671 255.028 112.853 256.043 104.049C256.178 102.849 258.099 102.836 257.95 104.049C256.949 112.853 256.435 121.671 256.408 130.529C256.408 131.756 254.5 131.756 254.5 130.529Z"
              fill="#00477C"
            />
            <path
              d="M241.187 123.114C245.868 116.44 250.536 109.752 255.217 103.078C255.92 102.081 257.571 103.024 256.868 104.036C252.186 110.71 247.519 117.397 242.838 124.071C242.148 125.069 240.484 124.125 241.187 123.114Z"
              fill="#00477C"
            />
            <path
              d="M256.151 104.265C247.722 110.763 239.05 116.912 230.121 122.696C229.079 123.37 228.132 121.711 229.16 121.051C237.954 115.348 246.505 109.307 254.812 102.916C255.772 102.175 257.125 103.51 256.151 104.265Z"
              fill="#00477C"
            />
            <path
              d="M-1.60576 0.999996C-4.14924 22.7207 5.86227 44.6167 21.2719 60.1759C36.6816 75.735 56.9888 85.6313 77.7696 92.6154C85.2917 95.1367 93.0034 97.3613 99.8491 101.379C112.539 108.822 121.049 121.846 126.447 135.491C130.52 145.791 131.399 160.501 121.252 165.004C114.163 168.146 105.437 163.454 102 156.524C98.5773 149.594 99.3485 141.302 101.473 133.873C107.425 113.042 123.16 95.9591 141.641 84.5796C160.135 73.2002 181.308 66.9307 202.495 62.0769C216.781 58.8006 231.42 56.0906 246.018 57.3714C260.616 58.6523 275.335 64.342 284.846 75.4653C286.7 77.636 288.431 80.3326 287.904 83.137C287.484 85.4021 285.712 87.1279 284.021 88.6919C277.892 94.3951 271.75 100.112 265.621 105.815"
              stroke="#00477C"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-dasharray="9.74 9.74"
            />
            <path
              d="M212.127 146.358C213.561 143.634 214.981 140.924 216.416 138.201C216.984 137.109 218.634 138.079 218.066 139.158C216.632 141.882 215.211 144.592 213.777 147.315C213.209 148.407 211.559 147.436 212.127 146.358Z"
              fill="#00477C"
            />
            <path
              d="M219.378 145.71C221.34 141.234 223.302 136.771 225.264 132.295C225.751 131.176 227.401 132.147 226.914 133.252C224.952 137.728 222.991 142.191 221.029 146.668C220.542 147.8 218.891 146.829 219.378 145.71Z"
              fill="#00477C"
            />
            <path
              d="M230.581 139.198C232.434 135.167 234.274 131.122 236.128 127.091C236.642 125.972 238.292 126.942 237.778 128.048C235.925 132.079 234.085 136.124 232.231 140.155C231.717 141.275 230.067 140.304 230.581 139.198Z"
              fill="#00477C"
            />
            <path
              d="M239.307 135.814C241.323 129.76 243.488 123.761 245.788 117.815C246.22 116.682 248.074 117.167 247.627 118.327C245.328 124.273 243.163 130.273 241.147 136.326C240.768 137.486 238.915 136.987 239.307 135.814Z"
              fill="#00477C"
            />
            <path
              d="M246.41 130.879C248.277 125.217 250.13 119.554 251.997 113.891C252.376 112.732 254.23 113.23 253.837 114.403C251.97 120.066 250.117 125.729 248.25 131.392C247.871 132.538 246.018 132.039 246.41 130.879Z"
              fill="#00477C"
            />
            <path
              d="M253.026 130.246C253.878 127.333 254.433 124.381 254.663 121.347C254.758 120.134 256.665 120.12 256.571 121.347C256.327 124.543 255.759 127.671 254.866 130.745C254.528 131.918 252.674 131.419 253.026 130.246Z"
              fill="#00477C"
            />
          </svg>
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
