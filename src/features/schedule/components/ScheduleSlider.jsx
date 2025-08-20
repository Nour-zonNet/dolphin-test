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



const ScheduleSlider = () => {
  return (
    <div className="mx-auto pt-16 px-4 sm:px-6 lg:px-10 space-y-20">
      <SliderHeader />

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
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 1 },
          }}
        >
          {/* Placeholder slide */}
          <SwiperSlide>
            <div className="relative p-5 flex items-end justify-center bg-white">
              <img
                src={notFoundImage}
                alt="No lessons found"
                className="max-h-140 group-hover:scale-110 transition"
              />
            </div>
          </SwiperSlide>

          {/* Lessons slide */}
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
