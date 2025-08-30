import SliderNavButton from "./SliderNavButton";
import { useTranslation } from "react-i18next";
import { LeftArrow, RightArrow } from "@/utils/icons";

const SliderHeader = ({ dayLabel, dayDate }) => {
  const { t, i18n } = useTranslation();
  
  // Format date nicely based on current language
  const formattedDate = new Date(dayDate).toLocaleDateString(
    i18n.language === 'ar' ? "ar-EG" : "en-US", 
    {
      day: "numeric",
      month: "long",
    }
  );
  return (
    <div className="flex items-center justify-between  gap-4 border-[1px] border-dashed border-oceandeep rounded-full px-10 py-5">
      <SliderNavButton
        direction="prev"
        ariaLabel="Previous slide"
        className="custom-prev"
      >
        <RightArrow size={22} className="w-4 sm:w-5" />
      </SliderNavButton>

      <div className="text-deepnavy text-center flex flex-col  md:text-xl text-sm">
        <span>{dayLabel}</span>
        <span>{formattedDate}</span>
      </div>

      <SliderNavButton
        direction="next"
        ariaLabel="Next slide"
        className="custom-next"
      >
        <LeftArrow size={22} className="w-4 sm:w-5" />
      </SliderNavButton>
    </div>
  );
};

export default SliderHeader;
