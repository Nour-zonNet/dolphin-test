import dolphinChild from "@/assets/images/homeChild.png";
import flash from "@/assets/home/flash.svg";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-row-reverse items-center justify-start px-4 sm:px-6 lg:px-12 py-8 lg:py-0 max-w-7xl mx-auto pt-0 ">
      {/* Text Content */}
      <div className="w-full  flex flex-col  mt-2   relative">
        {/* Flash Icon */}
        <div className="absolute -top-6 sm:-top-8 left-4 md:left-0 -translate-x-1/2  lg:-left-10 lg:translate-x-0">
          <img src={flash} alt="flash" className="w-10 sm:w-12 lg:w-12" />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-[#1B648E] mb-4 lg:mb-6 leading-tight">
          <span className="block text-nowrap">{t("home.welcome")}</span>
          <span className="block relative mt-2">{t("home.platformName")}</span>
        </h1>

        {/* Mascot underline */}
        <svg
          width="218"
          height="31"
          viewBox="0 0 218 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 sm:w-30 md:w-56 lg:w-50 text-right"
        >
          <path
            d="M2.58266 28.3739C59.1646 5.20245 139.615 -3.66695 214.694 8.94163"
            stroke="#E89B32"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Image */}
        <img
          src={dolphinChild}
          alt="Child with dolphin"
          className="w-2/5 sm:w-4/5 md:w-5/6 lg:w-2/6  object-contain"
        />
    </section>
  );
};

export default Hero;
