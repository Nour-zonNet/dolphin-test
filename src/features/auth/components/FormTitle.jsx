import { Book } from "@/utils/Illustrations";
import { UnderlineSVG } from "@/utils/icons";

const FormTitle = ({ text, isMobile }) => {
  return (
    <div
      className={`relative  md:pl-10  lg:mb-8
        ${isMobile ? "block lg:hidden" : "hidden lg:block"}`}
    >
      <h1 className="text-xl px-2 sm:text-3xl lg:text-[40px] text-right lg:text-right font-bold text-[#1B648E]">
        {text}
      </h1>

      <div className="mascot pt-2 flex justify-center lg:justify-start">
        <UnderlineSVG className="w-34 sm:w-38 md:w-44 lg:w-55 text-right" />
      </div>

      <Book className="absolute  top-0 -left-8 sm:-left-10 lg:-left-14 w-8 sm:w-16 md:w-15 lg:w-12" />
    </div>
  );
};

export default FormTitle;
