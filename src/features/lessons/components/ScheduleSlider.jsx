import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import notFoundImage from "@/assets/images/notFoundLessons.png";
import nationalDayBanner from "@/assets/images/national-day.svg";
import { getSevenDaysBeforeAndAfter, todayDate } from "@/utils/dateHelpers";

import LessonCard from "./LessonCard";
import SliderHeader from "./SliderHeader";
import { useLessons } from "../hooks/useLessons";
import { subjectFactory } from "../factory/subjectFactory";
import NationalDayCard from "./NationalDayCard";

const ScheduleSlider = () => {
  const { items, loading } = useLessons();
  const days = getSevenDaysBeforeAndAfter();

  // Index of today
  const todayIndex = days.findIndex((d) => d.date === todayDate);
  const [activeIndex, setActiveIndex] = useState(
    todayIndex !== -1 ? todayIndex : 0
  );

  const NAVBAR_HEIGHT = 64;
  const MOBILE_BAR_HEIGHT = 56;

  if (loading) return null;

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-10">
      <SliderHeader
        dayLabel={days[activeIndex].label}
        dayDate={days[activeIndex].date}
      />

      <div className="slider py-6">
        <Swiper
          key={todayIndex} // ensure starting at today
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          initialSlide={activeIndex}
        >
          {days.map((day) => {
            const lessonsForDay = items.filter((item) => {
              if (item.session_date) {
                return item.session_date === day.date;
              } else {
                return (
                  day.dayEn.toLowerCase() === item.day_of_week.toLowerCase()
                );
              }
            });

            return (
              <SwiperSlide key={day.date}>
                {"2025-09-23" === day.date ? (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      height: `calc(70svh - ${
                        NAVBAR_HEIGHT + MOBILE_BAR_HEIGHT
                      }px)`,
                    }}
                  >
                    <NationalDayCard src={nationalDayBanner} />
                    {/* Or just: <img src={nationalDayBanner} alt="Saudi National Day" className="w-full max-w-4xl h-auto rounded-2xl shadow" /> */}
                  </div>
                ) : lessonsForDay.length > 0 ? (
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
                  <div
                    className="flex justify-center items-center"
                    style={{
                      height: `calc(70svh - ${
                        NAVBAR_HEIGHT + MOBILE_BAR_HEIGHT
                      }px)`,
                    }}
                  >
                    <img
                      src={notFoundImage}
                      loading="lazy"
                      alt="No lessons found"
                      className="max-h-full w-auto object-contain mt-12"
                    />
                  </div>
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
