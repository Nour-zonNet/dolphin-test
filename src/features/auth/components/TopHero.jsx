import dolphinChild from "@/assets/images/homeChild.png";
import { Book } from "../../../utils/Illustrations";

const TopHero = () => {
  return (
    <div className="">
        {/* Hero Section */}
        <div className="flex items-center justify-center gap-10 mt-7">
            {/* Dolphin Child */}
            <d
            iv className="flex items-center justify-center gap-2">
                <img src={dolphinChild} alt="Path" className="h-46 lg:h-[100%] mb-6" />
                <div>
                    <h1 className="text-3xl lg:text-4xl text-center font-bold text-[#1B648E]">
                        ادخل لحسابك 
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
            </d>
            {/* Book Illustration */}
            <div>
                <Book className="w-16 lg:w-28"/>
            </div>
        </div>
    </div>
  )
}

export default TopHero
