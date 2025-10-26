import dolphinChild from "@/assets/images/homeChild.png";
import { Book } from "../../../utils/Illustrations";

const TopHero = ({text}) => {
  return (
        
        <div className="flex items-center gap-2">
          <img
            src={dolphinChild}
            alt="Path"
            className="h-32 sm:h-40 md:h-48 lg:h-56 object-contain mb-4 lg:mb-6"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold text-[#1B648E]">
              {text}
            </h1>

            {/* Underline SVG */}
            <div className="mascot pt-3 flex justify-center lg:justify-start">
              <svg
                width="218"
                height="31"
                viewBox="0 0 218 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-40 sm:w-52 md:w-60 lg:w-72"
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

        {/* Book Illustration */}
        <div>
          <Book className="w-14 sm:w-16 md:w-20 lg:w-28" />
        </div>
      </div>
  );
};

export default TopHero;
