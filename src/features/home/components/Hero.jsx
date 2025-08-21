import dolphinChild from "@/assets/images/homeChild.png";
import { Kite } from "@/utils/Illustrations";

const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center px-6 mt-8">
      <div className="w-screen flex justify-end py-5">
        <Kite />
      </div>

      <div className="flex items-center gap-2">
        <img src={dolphinChild} alt="Path" className="h-46 mb-6" />

        <div>
          <h1 className="text-2xl font-bold text-[#1B648E]">
            مرحباً بكم في منصة <br />
            <span className="text-[#1B648E]">دولفين التعليمية</span>
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
    </div>
  );
};

export default Hero;
