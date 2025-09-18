import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RightArrow } from "@/utils/icons";
import SearchFilterBar from "../components/SearchFilterBar";
import { LessonCard } from "../components";
import dolphinStudy from "@/assets/schedule/dolphin-study.svg";
import { useDispatch } from "react-redux";
import { useLessons } from "../../lessons/hooks/useLessons";

// Mock Lessons Data
// const lessons = [
//   {
//     id: 1,
//     title: "الدرس الأول:",
//     subtitle: "أخلاقيات الصحة العامة",
//     date: "1 نوفمبر 2025",
//     image: dolphinStudy,
//   },
//   {
//     id: 2,
//     title: "الدرس الثاني:",
//     subtitle: "أساسيات التغذية",
//     date: "3 نوفمبر 2025",
//     image: dolphinStudy,
//   },
//   {
//     id: 3,
//     title: "الدرس الثالث:",
//     subtitle: "النظافة الشخصية",
//     date: "5 نوفمبر 2025",
//     image: dolphinStudy,
//   },
// ];
const lessons = {
  session_id: 3937,
  teacher_name: "أ.سارة محمد",
  lessons: [
    {
      lesson_id: 1,
      teacher: {
        name: "أ.سارة محمد",
      },
      lesson_data: {
        name: "الدرس الاول 22",
        class_session_id: 3937,
        session_date: "2025-09-17",
      },
      attachments: [
        {
          id: 38,
          type: "exam_link",
          important: true,
          link: "https://admin.com2kdkw",
          name: null,
        },
      ],
      package: [
        {
          id: 115,
          name: "باقة تأسيس اللغة الإنجليزية (المستوى الاول)",
          type: "paid",
          price: 218,
        },
      ],
    },
    {
      lesson_id: 4,
      teacher: {
        name: "أ.سارة محمد",
      },
      lesson_data: {
        name: "الدرس الاول",
        class_session_id: 3937,
        session_date: "2025-09-17",
      },
      attachments: [],
      package: [
        {
          id: 115,
          name: "باقة تأسيس اللغة الإنجليزية (المستوى الاول)",
          type: "paid",
          price: 218,
        },
      ],
    },
  ],
};
const ShowLessons = () => {
  const { packageId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getPackageLessons } = useLessons();
  const [filteredLessons, setFilteredLessons] = React.useState(lessons.lessons);
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await dispatch(getPackageLessons(packageId));
        console.log(res.payload);
        if (res?.payload) {
          setFilteredLessons(res.payload.lessons || lessons.lessons); // 👈 update state
        }
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
      }
    };

    if (packageId) {
      fetchLessons();
    }
  }, [dispatch, getPackageLessons, packageId]);
  return (
    <>
      {/* Header */}
      <div className="w-full bg-white shadow-[0px_2px_4px_0px_rgba(192,192,192,0.25)] py-8 flex items-center relative">
        <div className="w-[90%] mx-auto flex items-center md:items-center justify-between">
          {/* Back Button */}
          <Link
            to="/packages-content"
            className="outline-0 border border-bordercolor md:w-[60px] md:h-[60px] w-[40px] h-[40px] rounded-full flex items-center justify-center"
          >
            <RightArrow className="w-[20px] md:w-[40px]" />
          </Link>

          {/* Centered Content */}
          <div className="flex-1 text-center">
            <h1 className="font-bold text-navyteal text-sm md:text-2xl">
              الدروس
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
          packages={lessons.lessons || []}
          onFilterChange={setFilteredLessons}
          placeholder="ابحث عن الدرس هنا"
        />

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {filteredLessons?.map((lesson) => (
            <LessonCard
              key={lesson.lesson_id}
              title={lesson.lesson_data.name}
              subtitle={lesson.lesson_data.name}
              date={lesson.lesson_data.session_date}
              image={dolphinStudy}
              onStart={() =>
                navigate("/schedule/lessoncontent/" + lesson.session_id)
              }
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ShowLessons;
