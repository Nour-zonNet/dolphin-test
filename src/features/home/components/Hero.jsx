import dolphinChild from "@/assets/images/homeChild.png";
import { RightKite } from "@/utils/Illustrations";
import flash from "@/assets/home/flash.svg";
import pencil from "@/assets/home/pencil.svg";
import textHighlight from "@/assets/home/text-highlight.svg";

const Hero = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <img src={dolphinChild} alt="Path" className="h-[75%] lg:h-[90%]" />
          <div>
            <h1 className="text-2xl lg:text-[32px] font-bold text-[#1B648E] z-10">
              مرحباً بكم في منصة <br />
              <span className="text-[#1B648E] relative z-10"><img src={textHighlight} alt="text-highlight" className="absolute -top-16 lg:-top-22 left-2 -z-1"/>الدلفين التعليمية</span>
            </h1>
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
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="-translate-y-18">
          <img src={flash} alt="flash" />
        </div>
      </div>
      <div className="flex justify-between items-start overflow-x-hidden">
        <RightKite className="flex-shrink-0 w-full" />
        <div className="ml-14 -mt-8 flex-shrink-0">
          <img src={pencil} alt="pencil" className="w-40" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
