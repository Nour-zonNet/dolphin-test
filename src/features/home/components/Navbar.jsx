import dolphinLogo from "@/assets/logo/dolphinLogo.png";
import { Books } from "../../../utils/icons";
import { useTranslation } from "react-i18next";
// import LanguageSwitcher from "../../../components/ui/LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white ">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src={dolphinLogo}
          alt="logo"
          className="h-12 sm:h-16 md:h-20 w-auto object-contain"
        />
      </div>

      {/* Nav buttons */}
      <div className="flex gap-2 sm:gap-3 items-center">
        {/* Show language switcher only on md+ screens */}
        {/* <div >
          <LanguageSwitcher />
        </div> */}

        <button className="flex items-center gap-1 sm:gap-2 border border-orangedeep hover:bg-orangedeep focus:bg-orangedeep focus:outline-0 transition rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium text-[#0C2D40] cursor-pointer">
          <Books className="w-4 sm:w-5 md:w-6 h-auto" />
          {t("buttons.subscribe")}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
