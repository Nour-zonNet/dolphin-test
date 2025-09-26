import dolphinLogo from "@/assets/logo/dolphinLogo.png";
import { Books } from "../../../utils/icons";
import { Link } from "react-router-dom";
// import LanguageSwitcher from "../../../components/ui/LanguageSwitcher";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white ">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src={dolphinLogo}
          alt="logo"
          loading="lazy"
          className="h-12 sm:h-16 md:h-20 w-auto object-contain"
        />
      </div>

      {/* Nav buttons */}
      <div className="flex gap-2 sm:gap-3 items-center">
        {/* Show language switcher only on md+ screens */}
        {/* <div >
          <LanguageSwitcher />
        </div> */}

        <Link
          to={"/privacy-policy"}
          className="flex items-center gap-1 sm:gap-2 border border-orangedeep hover:bg-orangedeep focus:bg-orangedeep focus:outline-0 transition rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium text-[#0C2D40] cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.842 17.988L13.5345 17.8312C11.0647 16.5705 9.79125 14.9692 9.75 13.0702V10.1205C9.75 9.474 10.1632 8.9025 10.7775 8.6985L13.875 7.671L16.9725 8.6985C17.586 8.901 18 9.47175 18 10.1205V13.0538C17.9565 15.2145 16.6658 16.8248 14.1615 17.856L13.842 17.988ZM8.274 13.5H3V12H8.24925V10.5H3V9H8.47575C8.7315 8.367 9.19425 7.8345 9.8025 7.5H3V6H10.5V7.21125L13.5 6.216V1.5H9.62175C9.312 0.627 8.478 0 7.5 0H6C5.022 0 4.188 0.627 3.87825 1.5H0V15.75C0 16.9905 1.0095 18 2.25 18H10.986C9.02625 16.4895 8.39625 14.826 8.274 13.5Z"
              fill="#08233F"
            />
          </svg>
          سياسة الخصوصية
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
