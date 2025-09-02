import React from 'react'
import { Link } from 'react-router-dom'
import { RightArrow } from '@/utils/icons'
import { useTranslation } from "react-i18next"
import SearchFilterBar from '../components/SearchFilterBar'
import { LessonCard } from '../components'
import dolphinStudy from "@/assets/schedule/dolphin-study.svg"

// Mock Lessons Data
const lessons = [
  {
    id: 1,
    title: "الدرس الأول:",
    subtitle: "أخلاقيات الصحة العامة",
    date: "1 نوفمبر 2025",
    image: dolphinStudy,
  },
  {
    id: 2,
    title: "الدرس الثاني:",
    subtitle: "أساسيات التغذية",
    date: "3 نوفمبر 2025",
    image: dolphinStudy,
  },
  {
    id: 3,
    title: "الدرس الثالث:",
    subtitle: "النظافة الشخصية",
    date: "5 نوفمبر 2025",
    image: dolphinStudy,
  },
];

const ShowLessons = () => {
  const [filteredLessons, setFilteredLessons] = React.useState(lessons);
  const { t } = useTranslation();

  return (
    <>
      {/* Header */}
      <div className="w-full bg-white shadow-[0px_2px_4px_0px_rgba(192,192,192,0.25)] py-8 flex items-center relative">
        <div className="w-[90%] mx-auto flex items-center md:items-center justify-between">
          {/* Back Button */}
          <Link
            to="/schedule"
            className="outline-0 border border-bordercolor md:w-[60px] md:h-[60px] w-[40px] h-[40px] rounded-full flex items-center justify-center"
          >
            <RightArrow className="w-[20px] md:w-[40px]" />
          </Link>

          {/* Centered Content */}
          <div className="flex-1 text-center">
            <h1 className="font-bold text-navyteal text-sm md:text-2xl">
              {t("lesson_content.lesson")}
            </h1>
            <p className="font-semibold text-[#BA7C28] text-[12px] md:text-xl mt-2">
              الصحة العامة
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-[90%] mx-auto">
        {/* Search Bar */}
        <SearchFilterBar
          packages={lessons}
          onFilterChange={setFilteredLessons}
          placeholder="ابحث عن الدرس هنا"
        />

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              title={lesson.title}
              subtitle={lesson.subtitle}
              date={lesson.date}
              image={lesson.image}
              onStart={() => alert(`بدء ${lesson.title} ${lesson.subtitle}`)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default ShowLessons
