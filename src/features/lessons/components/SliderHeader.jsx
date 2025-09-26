import SliderNavButton from "./SliderNavButton";
import { useTranslation } from "react-i18next";
import { LeftArrow, RightArrow } from "@/utils/icons";
import { PreviewScheduleBtn } from "@/components/ui";

const SliderHeader = ({ dayLabel, dayDate }) => {
  const { i18n } = useTranslation();
  const dateObj = new Date(dayDate);

  // Always English digits for the day number
  const dayNumber = dateObj.toLocaleDateString("en-US", { day: "numeric" });

  // Localized month name
  const monthName = dateObj.toLocaleDateString(
    i18n.language === "ar" ? "ar-EG" : "en-US",
    { month: "long" }
  );

  const formattedDate = `${dayNumber} ${monthName}`;

  return (
    <div className="flex items-center flex-col lg:flex-row lg:gap-8">
      <div className="flex items-center justify-between gap-4 border-[1px] border-dashed border-oceandeep rounded-full py-2 sm:py-4 md:px-6 px-6 w-full">
        <SliderNavButton
          direction="prev"
          ariaLabel="Previous slide"
          className="custom-prev cursor-pointer"
        >
          <RightArrow size={22} className="w-4 sm:w-5" />
        </SliderNavButton>

        <div className="text-deepnavy text-center flex flex-col md:text-xl text-sm">
          <span>{dayLabel}</span>
          <span>{formattedDate}</span>
        </div>

        <SliderNavButton
          direction="next"
          ariaLabel="Next slide"
          className="custom-next cursor-pointer"
        >
          <LeftArrow size={22} className="w-4 sm:w-5" />
        </SliderNavButton>
      </div>
      <div className="lg:hidden block w-full">
        <PreviewScheduleBtn />
      </div>
    </div>
  );
};

export default SliderHeader;
