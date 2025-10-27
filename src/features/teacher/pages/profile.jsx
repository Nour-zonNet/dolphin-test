import React from "react";
import Header from "../../../components/layout/Header";

const Tag = ({ children, variant = "filled" }) => (
  <span
    className={
      `inline-block px-8 py-1 rounded-full text-xs sm:text-sm font-medium mt-5 ` +
      (variant === "filled"
        ? "bg-[#F8E0BF] text-navyteal font-semibold"
        : " bg-[#E8F0F4]   text-navyteal font-semibold")
    }
  >
    {children}
  </span>
);

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-col sm:justify-between  py-3  last:border-b-0">
    <div className="text-lg sm:text-sm text-black mb-1 sm:mb-0 font-semibold">
      {label}
    </div>
    <div className="text-xs  sm:text-sm  font-semibold text-navyteal">
      {value}
    </div>
  </div>
);

export default function TeacherProfile({
  name = "محمد علي",
  title = "معلم لغة انجليزية",
  rating = 4.5,
  subject = "لغة إنجليزية",
  stages = ["المرحلة الابتدائية", "المرحلة الاعدادية"],
  bio = "معلم لغة إنجليزية بخبرة في تعليم مختلف المستويات بالعربية، يتميز بأسلوب تفاعلي يجعل التعلم ممتعًا وسهل الفهم. شغوف بمساعدة الطلاب على تحسين مهاراتهم في المحادثة والاستماع والكتابة.",
  avatarUrl = "https://admin.learnadolphin.com/images/students/HbvD0yjxCiJgOWWdOJ3UO3rAPBNX2mvjqYtnTBWu.jpg",
  videoThumbnailUrl = "/_next/static/media/video-thumb.png",
}) {
  return (
    // max-w-md md:max-w-lg lg:max-w-2xl
    <>
      <Header title="الملف الشخصي" onBack="/" />
      <div dir="rtl" className=" container mx-auto p-3 sm:p-6">
        {/* profile card */}
        <div className="w-full h-30" />
        <div className="bg-gradient-to-r from-amber-50 to-sky-50 rounded-xl p-4 sm:p-6 pt-12 sm:pt-14 relative ">
          <div className="absolute -top-10 inset-x-0 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white ">
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-center mt-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              {name}
            </h2>
            <p className="text-md sm:text-lg text-gray-500 mt-1">{title}</p>

            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-2">
              <span className="text-gray-700 text-sm sm:text-base font-semibold">
                {rating}
              </span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.164c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.839-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.644 9.393c-.783-.57-.38-1.81.588-1.81h4.164a1 1 0 00.95-.69L9.05 2.927z" />
              </svg>
            </div>
          </div>
        </div>

        {/* bio */}
        <div className="mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
            نبذة تعريفية
          </h3>
          <p className="text-xs sm:text-sm text-[#474747] leading-relaxed">
            {bio}
          </p>
          <button className="text[] text-xs sm:text-sm mt-2 hover:underline">
            عرض المزيد....
          </button>
        </div>

        {/* video */}
        <div className="mt-4">
          <div className="relative rounded-lg overflow-hidden shadow-sm">
            <img
              src={videoThumbnailUrl}
              alt="video thumbnail"
              className="w-full h-40 sm:h-52 md:h-64 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M5 3v18l15-9L5 3z"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] sm:text-xs bg-black/60 text-white rounded px-2 py-1">
              50:07
            </div>
          </div>
        </div>

        {/* additional info */}
        <div className="mt-5 bg-white   rounded-xl overflow-hidden ">
          <div className="p-3 sm:p-4 flex flex-col gap-2 md:gap-8 md:flex-row">
            <InfoRow label="المواد التى ادرسها" value={<Tag>{subject}</Tag>} />
            <InfoRow
              label="المراحل الدراسية"
              value={
                <div className="flex flex-wrap space-x-2 ">
                  {stages.map((s) => (
                    <Tag key={s} variant="outline">
                      {s}
                    </Tag>
                  ))}
                </div>
              }
            />
          </div>
        </div>

        {/* actions */}
        {/* <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button className="w-full sm:flex-1 py-3 rounded-xl bg-amber-500 text-white font-semibold shadow text-sm sm:text-base">
        حجز درس
        </button>
        <button className="w-full sm:flex-1 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm sm:text-base">
        مراسلة
        </button>
        </div> */}
      </div>
    </>
  );
}
