import { PlusIcon } from "lucide-react";
import React, { useEffect } from "react";
import { AuthLayout } from "../components";
import { useAuth } from "../hooks/useAuth";
import profileImg from "@/assets/images/profileImage.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UnderlineSVG } from "../../../utils/icons";
import { Book } from "@/utils/Illustrations";

// --- Mock UI Components (replace with shadcn/ui if available) ---
const Card = ({ className = "", children, ...props }) => (
  <div className={`rounded-xl border bg-white shadow ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ className = "", children, ...props }) => (
  <div className={`p-2 ${className}`} {...props}>
    {children}
  </div>
);

export const StudentCard = ({ student, delay }) => {
  const navigate = useNavigate();
  const { switchUserAccount, user } = useAuth();
  const handleSwitch = async (bro) => {
    if (user.id === student.id) return navigate("/schedule");
    const { payload } = await switchUserAccount(bro.id);
    if (payload?.token) {
      localStorage.setItem("token", payload.token);
      navigate("/schedule");
    }
  };
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => handleSwitch(student)}
      className="w-full  rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 border border-[#8c8c8c]/50"
      style={{ "--animation-delay": `${delay}ms` }}
    >
      <CardContent className="relative h-full p-4 md:p-6 flex items-center justify-between">
        <div className="flex items-center rounded-full border border-gray-200 gap-3 md:gap-4">
          {student.profilePicture ? (
            <img
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full"
              alt={`${student.student_name} avatar`}
              src={student.profilePicture || profileImg}
            />
          ) : (
            <img
              className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-full"
              alt={`${student.student_name} avatar`}
              src={profileImg}
            />
          )}
        </div>

        <div className="flex flex-col items-start gap-1 md:gap-2 flex-1 mr-2 md:mr-4">
          <div className="font-bold text-base md:text-lg  [font-family:'Cairo',Helvetica]">
            {student.student_name}
          </div>
          <div className="font-normal text-sm md:text-base  [font-family:'Cairo',Helvetica]">
            {student.class_name}
          </div>
        </div>
        {user.id === student.id && (
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold">
            أساسي
          </span>
        )}
      </CardContent>
    </Card>
  );
};

// --- Main Component ---
const LoginSiblings = () => {
  const { brothers, user, loading } = useAuth();
  const navigate = useNavigate();

  // Only redirect if loading is complete and there are no brothers
  useEffect(() => {
    if (!loading && brothers.length === 0) {
      navigate("/schedule");
    }
  }, [loading, brothers.length, navigate]);

  // // Show loading while fetching brothers
  if (loading) {
    return null;
  }

  const currentBrother = {
    id: user?.id,
    student_name: user?.name,
    profilePicture: user?.profilePicture,
    class_name: user?.gradeName,
  };

  return (
    <AuthLayout showBackButton={false}>
      <main className="relative max-w-2xl  flex flex-col items-center py-10 px-4 sm:px-6 md:px-8  pb-20  sm:pb-10 md:pb-0 mx-auto">
        {/* Logo & Title */}
        <div className="w-full max-w-4xl flex flex-row items-center justify-center gap-6 mb-8 md:mb-12">
          <div className={`relative  md:pl-10 md:mt-4   lg:mb-8`}>
            <h1 className="text-xl  text-nowrap px-2 sm:text-3xl lg:text-[40px] text-right lg:text-right font-bold text-[#1B648E]">
              اختر الحساب
            </h1>

            <div className="mascot md:mt-4  flex justify-center lg:justify-start">
              <UnderlineSVG className="w-30 sm:w-38 md:w-44 lg:w-55 text-right" />
            </div>

            <Book className="absolute  top-0 lg:top-5  -left-8  sm:-left-10 lg:-left-8 w-8 sm:w-16 md:w-15 lg:w-12" />
          </div>
        </div>

        {/* Students */}
        <section className="w-full max-w-4xl space-y-4 mb-8 md:mb-12">
          {[currentBrother, ...brothers].map((student, index) => (
            <StudentCard
              key={student.id}
              student={student}
              delay={600 + index * 200}
            />
          ))}
        </section>

        {/* Add account */}
        <section className="w-full max-w-4xl flex flex-col items-center relative mt-auto">
          <Link
            to="/auth/addsiblings"
            className="w-full max-w-2xl h-14 md:h-16 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-[#e89b32] bg-transparent hover:bg-[#e89b32]/10 transition-colors   mb-6 md:mb-8"
          >
            <span className="font-semibold text-sm md:text-base [font-family:'Cairo',Helvetica]">
              إضافة حساب جديد
            </span>
            <PlusIcon className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </section>
      </main>
    </AuthLayout>
  );
};

export default LoginSiblings;
