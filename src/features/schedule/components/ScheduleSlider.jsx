// External libs
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Assets & utils
import notFoundImage from "@/assets/images/notFoundLessons.png";

// Local
import LessonCard from "./LessonCard";
import { packagesItems } from "@/constants/packagesItrms";
import SliderHeader from "./SliderHeader";
import { getNext7Days } from "../../../utils/dateHelpers";
import { useState } from "react";

const ScheduleSlider = () => {
  const days = getNext7Days();
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="mx-auto pt-16 px-4 sm:px-6 lg:px-10 ">
      <SliderHeader
        dayLabel={days[activeIndex].label}
        dayDate={days[activeIndex].date}
      />
      <div className="slider pt-3 pb-30">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 1 },
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {days.map((day) => (
            <SwiperSlide key={day.date}>
              <div className="flex flex-col   ">
                {packagesItems.length > 0 ? (
                  packagesItems.map((item, i) => (
                    <LessonCard key={i + item.title} item={item} />
                  ))
                ) : (
                  <div className="relative p-5 flex items-center justify-center bg-white">
                    <img
                      src={notFoundImage}
                      alt="No lessons found"
                      className="max-h-80 group-hover:scale-110 transition"
                    />
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ScheduleSlider;
