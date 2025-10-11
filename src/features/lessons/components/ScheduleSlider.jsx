import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import SessionRatingModal from "../../../components/feedback/modal/modals/SessionRatingModal";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import notFoundImage from "@/assets/images/notFoundLessons.png";
import nationalDayBanner from "@/assets/images/national-day.svg";
import { getSevenDaysBeforeAndAfter, todayDate } from "@/utils/dateHelpers";
import PreviewScheduleBtn from "@/components/ui/PreviewScheduleBtn";

import LessonCard from "./LessonCard";
import SliderHeader from "./SliderHeader";
import { useLessons } from "../hooks/useLessons";
import { subjectFactory } from "../factory/subjectFactory";

const ScheduleSlider = () => {
  const { items } = useLessons();
  const days = getSevenDaysBeforeAndAfter();

  // Index of today
  const todayIndex = days.findIndex((d) => d.date === todayDate);
  const [activeIndex, setActiveIndex] = useState(
    todayIndex !== -1 ? todayIndex : 0
  );

  const NAVBAR_HEIGHT = 64;
  const MOBILE_BAR_HEIGHT = 56;


  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-10">
      <SliderHeader
        dayLabel={days[activeIndex].label}
        dayDate={days[activeIndex].date}
      />
      <div className="lg:hidden block ">
        <PreviewScheduleBtn />
      </div>

      <div className="slider py-6 pb-20">
        <Swiper
          key={todayIndex}
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          initialSlide={activeIndex}
        >
          {days.map((day) => {
            const lessonsForDay = items.filter((item) => {
              if (item.date) {
                const itemDate = new Date(item.date)
                  .toISOString()
                  .split("T")[0];
                return itemDate === day.date;
              }
            });

            return (
              <SwiperSlide key={day.date}>
                {"2025-09-23" === day.date ? (
                  <div
                    className="flex flex-col justify-center items-center mt-12  "
                    style={{
                      height: `calc(60svh - ${
                        NAVBAR_HEIGHT + MOBILE_BAR_HEIGHT
                      }px)`,
                    }}
                  >
                    <img
                      src={nationalDayBanner}
                      loading="lazy"
                      alt="No lessons found"
                      className="max-h-full w-auto object-cover  "
                    />
                    <p className="text-[#155274] font-semibold text-lg md:text-3xl lg:text-2xl text-center mt-4 mb-4 md:mb-0">
                      لا توجد دروس اليوم بمناسبة اليوم <br /> الوطني السعودي
                      استمتعوا بإجازتكم
                    </p>
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
