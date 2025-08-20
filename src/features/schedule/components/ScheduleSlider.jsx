import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import "./style.css";
import notFoundImage from "../../../assets/images/notFoundLessons.png";
import { LeftArrow, RightArrow } from "../../../utils/icons";
import LessonCard from "./LessonCard";

export const packagesItems = [
  {
    title: "باقة الصحة العامة",
    description: "",
    color: "border-r-16 border-r-health",
    group: "المجموعة الأولي",
    teacher: "أ. حنان",
  },
  {
    title: "باقة ركن المسلم",
    description: "",
    color: "border-r-16 border-r-quran",
    group: "المجموعة الأولي",
    teacher: "أ. حنان",
  },
];

const ScheduleSlider = () => {
  return (
    <div className="mx-auto pt-16   px-4 sm:px-6 lg:px-10 space-y-20">
      <div className="flex items-center justify-between my-2 gap-4 border-[1px]  border-dashed  border-oceandeep rounded-full px-10 py-4">
        <button
          className="custom-prev  text-black w-12 h-12 rounded-full flex items-center justify-center   transition-all hover:scale-105 disabled:opacity-50"
          aria-label="Previous slide"
        >
          <RightArrow size={18} />
        </button>
        <div className="text-deepnavy text-center flex flex-col text-sm md:text-base">
          <span>الاثنين</span>
          <span>17 اغسطس</span>
        </div>
        <button
          className="custom-next  text-black w-12 h-12 rounded-full flex items-center justify-center  transition-all hover:scale-105 disabled:opacity-50"
          aria-label="Next slide"
        >
          <LeftArrow size={18} />
        </button>
      </div>
      <div className="slider">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 1,
            },
          }}
        >
          {/* must be lessons of one day for one Slide */}
          <SwiperSlide>
            <div className="relative p-5   flex items-end justify-center  bg-white">
              <img
                src={notFoundImage}
                alt="profile"
                className="max-h-140  group-hover:scale-110 transition"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col justify-center items-center">
              {packagesItems.map((item, index) => (
                <LessonCard key={index + item.title} item={item} />
              ))}
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default ScheduleSlider;
