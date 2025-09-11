import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import notFoundImage from "@/assets/images/notFoundLessons.png";
import { getNext7Days } from "../../../utils/dateHelpers";

import LessonCard from "./LessonCard";
import SliderHeader from "./SliderHeader";
import { useLessons } from "../hooks/useLessons";
import { subjectFactory } from "../factory/subjectFactory";

const ScheduleSlider = () => {
  const { items, loading } = useLessons();
  const days = getNext7Days();
  const [activeIndex, setActiveIndex] = useState(0);

  const NAVBAR_HEIGHT = 64;
  const MOBILE_BAR_HEIGHT = 56;

  const renderNoLessons = () => (
    <div
      className="flex justify-center items-center"
      style={{ height: `calc(70svh - ${NAVBAR_HEIGHT + MOBILE_BAR_HEIGHT}px)` }}
    >
      <img
        src={notFoundImage}
        alt="No lessons found"
        className="max-h-full w-auto object-contain mt-12"
      />
    </div>
  );

  if (loading) return null;

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-10">
      <SliderHeader
        dayLabel={days[activeIndex].label}
        dayDate={days[activeIndex].date}
      />

      <div className="slider py-6">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {days.map((day) => {
            const lessonsForDay = items.filter(
              (item) =>
                day.dayEn.toLowerCase() === item.day_of_week.toLowerCase()
            );

            return (
              <SwiperSlide key={day.date}>
                {lessonsForDay.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                    {lessonsForDay.map((lesson, i) => {
                      const { image, bgColor } = subjectFactory(lesson.subject);
                      return (
                        <LessonCard
                          key={`${lesson.title}-${i}`}
                          item={lesson}
                          image={image}
                          color={bgColor}
                           lessonDate={day.date}  
                        />
                      );
                    })}
                  </div>
                ) : (
                  renderNoLessons()
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default ScheduleSlider;
