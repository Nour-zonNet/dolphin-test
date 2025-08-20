import SliderNavButton from "./SliderNavButton";
import { LeftArrow, RightArrow } from "@/utils/icons";
const SliderHeader = () => (
  <div className="flex items-center justify-between my-2 gap-4 border-[1px] border-dashed border-oceandeep rounded-full px-10 py-4">
    <SliderNavButton
      direction="prev"
      ariaLabel="Previous slide"
      className="custom-prev"
    >
      <RightArrow size={18} />
    </SliderNavButton>

    <div className="text-deepnavy text-center flex flex-col text-sm md:text-base">
      <span>الاثنين</span>
      <span>17 اغسطس</span>
    </div>

    <SliderNavButton
      direction="next"
      ariaLabel="Next slide"
      className="custom-next"
    >
      <LeftArrow size={18} />
    </SliderNavButton>
  </div>
);

export default SliderHeader;
