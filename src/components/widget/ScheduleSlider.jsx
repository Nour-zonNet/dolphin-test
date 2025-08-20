import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./style.css";
import PackageCard from "../cards/PackageCard";
import notFoundImage from "../../assets/images/notFoundLessons.png";
import { LeftArrow, RightArrow } from "../../utils/icons";
import LessonCard from "../cards/LessonCard";
import { cards } from "../../pages/Schedule";

const data = [
  {
    id: 1,
    title: "بناء مسجد جديد",
    description: "ساهم في بناء مسجد يستوعب 500 مصلٍ في منطقة محرومة",
    image: "/donation_1_1.jpg",
    raised: 45000,
    goal: 100000,
    likes: 12400,
  },
  {
    id: 2,
    title: "إفطار صائم",
    description: "توفير وجبات إفطار شهر رمضان لعائلات محتاجة",
    image: "/donation_1_2.jpg",
    raised: 25000,
    goal: 50000,
    likes: 8700,
  },
  {
    id: 3,
    title: "كفالة يتيم",
    description: "ساهم في كفالة أيتام وتوفير التعليم والرعاية لهم",
    image: "/donation_1_3.jpg",
    raised: 60000,
    goal: 100000,
    likes: 15600,
  },
  {
    id: 4,
    title: "حفر بئر ماء",
    description: "حفر آبار مياه شرب في مناطق تعاني من شح المياه",
    image: "/donation_1_4.jpg",
    raised: 35000,
    goal: 75000,
    likes: 9800,
  },
  {
    id: 5,
    title: "مشروع إغاثة",
    description: "توفير مساعدات عاجلة للمتضررين من الكوارث الطبيعية",
    image: "/donation_1_5.jpg",
    raised: 80000,
    goal: 120000,
    likes: 18200,
  },
  {
    id: 6,
    title: "مكتبة قرآنية",
    description: "إنشاء مكتبة لتعليم القرآن وتحفيظه للأطفال",
    image: "/donation_1_6.jpg",
    raised: 20000,
    goal: 50000,
    likes: 6500,
  },
  {
    id: 7,
    title: "علاج مرضى",
    description: "مساعدة المرضى غير القادرين على تحمل تكاليف العلاج",
    image: "/donation_1_7.jpg",
    raised: 70000,
    goal: 150000,
    likes: 14300,
  },
  {
    id: 8,
    title: "مشروع زواج",
    description: "مساعدة الشباب غير القادرين على تكاليف الزواج",
    image: "/donation_1_8.jpg",
    raised: 30000,
    goal: 80000,
    likes: 7600,
  },
  {
    id: 9,
    title: "تعليم ديني",
    description: "دعم مدارس تحفيظ القرآن وتعليم العلوم الشرعية",
    image: "/donation_1_9.jpg",
    raised: 55000,
    goal: 90000,
    likes: 11200,
  },
];

const ScheduleSlider = () => {
  return (
    <div className="mx-auto pt-16 px-4 sm:px-6 lg:px-10 space-y-20 max-w-[744px]">
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
                className="h-[30rem]  group-hover:scale-110 transition"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            {cards.map((card, index) => (
              <LessonCard
                key={index}
                title={card.title}
                description={card.description}
                color={card.color}
                image={card.image}
                group={card.group}
                teacher={card.teacher}
              />
            ))}
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default ScheduleSlider;
