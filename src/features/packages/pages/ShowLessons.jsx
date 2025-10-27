import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RightArrow } from "@/utils/icons";
import SearchFilterBar from "../components/SearchFilterBar";
import { LessonCard } from "../components";
import dolphinStudy from "@/assets/schedule/dolphin-study.webp";
import { useDispatch } from "react-redux";
import { useLessons } from "../../lessons/hooks/useLessons";
import { Header } from "@/components/layout";
import { usePackages } from "../hooks/usePackages";

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
  const { mine } = usePackages();
  const [filteredLessons, setFilteredLessons] = React.useState(lessons.lessons);
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await dispatch(getPackageLessons(packageId));
        if (res?.payload) {
          setFilteredLessons(res.payload.lessons); // 👈 update state
        }
      } catch (error) {
        // Failed to fetch lessons
      }
    };

    if (packageId) {
      fetchLessons();
    }
  }, [dispatch, getPackageLessons, packageId]);
  return (
    <>
      {/* Header */}

      <Header
        balance={"0"}
        showBalanceSection={false}
        title="الدروس"
        supTitle={mine.find((pkg) => pkg.package_id == packageId)?.package_name}
        onBack={"/packages-content"}
      />
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
