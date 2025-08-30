import dolphinChild from "@/assets/images/homeChild.png";
import flash from "@/assets/home/flash.svg";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-row items-center lg:justify-center">
      {/* Image */}
    <img
      src={dolphinChild}
      alt="Path"
      className="h-[60%] sm:h-[70%] lg:h-[100%] "
    />

      {/* Text */}
      <div className="relative text-center lg:text-right max-w-xl flex-1">
        {/* Flash Icon */}
        <div className="absolute -top-12 left-0 lg:-left-5">
          <img src={flash} alt="flash" className="w-10 lg:w-14" />
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-4xl lg:text-7xl font-bold text-[#1B648E] z-10 text-nowrap leading-relaxed ">
          {t('home.welcome')} <br />
          <span className="  relative  text-xl md:text-4xl lg:text-7xl">{t('home.platformName')}</span>
        </h1>

        {/* Mascot underline */}
        <svg
          width="218"
          height="31"
          viewBox="0 0 218 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-22 sm:w-33 lg:w-44 mx-auto"
        >
          <path
            d="M2.58266 28.3739C59.1646 5.20245 139.615 -3.66695 214.694 8.94163"
            stroke="#E89B32"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
