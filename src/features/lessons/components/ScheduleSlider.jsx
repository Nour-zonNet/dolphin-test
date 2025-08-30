// External libs
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Assets & utils
import notFoundImage from "@/assets/images/notFoundLessons.png";
import { getNext7Days } from "../../../utils/dateHelpers";

// Local components
import LessonCard from "./LessonCard";
import SliderHeader from "./SliderHeader";
import { useLessons } from "../hooks/useLessons";
import { subjectFactory } from "../factory/subjectFactory";

const ScheduleSlider = () => {
  const { items, loading } = useLessons();
  const days = getNext7Days();
  const [activeIndex, setActiveIndex] = useState(0);

  const NAVBAR_HEIGHT = 64; // px
  const MOBILE_BAR_HEIGHT = 56; // px

  const renderNoLessons = () => (
    <div
      className="flex justify-center items-center"
      style={{ height: `calc(70svh - ${NAVBAR_HEIGHT + MOBILE_BAR_HEIGHT}px)` }}
    >
      <img
        src={notFoundImage}
        alt="No lessons found"
        className="max-h-full w-auto object-contain"
      />
    </div>
  );
  if (loading) return null;

  return (
    <div className="mx-auto  px-4 sm:px-6 lg:px-10">
      <SliderHeader
        dayLabel={days[activeIndex].label}
        dayDate={days[activeIndex].date}
      />

      <div className="slider py-3">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 1 },
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {days.map((day) => {
            const lessonsForDay = items.filter(
              (item) =>
                day.dayEn.toLowerCase() === item.day_of_week.toLowerCase()
            );

            return (
              <SwiperSlide key={day.date}>
                <div className="flex flex-col">
                  {lessonsForDay.length > 0
                    ? lessonsForDay.map((lesson, i) => {


                       const { image, bgColor } = subjectFactory(lesson.subject);
                        return (
                          <LessonCard
                            key={`${lesson.title}-${i}`}
                            item={lesson}
                            image={image}
                            color={bgColor}
                          />
                        );
                      })
                    : renderNoLessons()}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default ScheduleSlider;
