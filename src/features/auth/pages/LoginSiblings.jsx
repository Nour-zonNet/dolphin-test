import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { AuthLayout } from "../components";

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

const Button = ({
  variant = "default",
  className = "",
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap  text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    default: "bg-red-500 text-white shadow hover:bg-red-600",
    destructive: "bg-red-700 text-white shadow-sm hover:bg-red-800",
    outline: "border border-orangedeep bg-white shadow-sm hover:bg-gray-100 hover:cursor-pointer",
    secondary: "bg-blue-500 text-white shadow-sm hover:bg-blue-600",
    ghost: "hover:bg-gray-100 text-gray-700",
    link: "text-red-500 underline-offset-4 hover:underline",
  }[variant];

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Data ---
const studentsData = [
  {
    id: "1",
    name: "يوستينا صلاح",
    grade: "الصف الأول ابتدائي",
    avatar: "https://c.animaapp.com/mfavn83xeP6Ws5/img/group-39878.png",
  },
  {
    id: "2",
    name: "سارة صلاح",
    grade: "الصف السادس ابتدائي",
    avatar: "https://c.animaapp.com/mfavn83xeP6Ws5/img/group-39878-1.png",
  },
  {
    id: "3",
    name: "يوسف صلاح",
    grade: "الصف الرابع ابتدائي",
    avatar: "https://c.animaapp.com/mfavn83xeP6Ws5/img/group-39878-2.png",
  },
];

// --- Subcomponent ---
export const StudentCard = ({ student, isSelected, delay, onSelect }) => (
  <Card
    role="button"
    tabIndex={0}
    onClick={() => onSelect(student.id)}
    className={`w-full h-32 md:h-36 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300  ${
      isSelected
        ? "border-2 border-[#e89b32] shadow-md"
        : "border border-[#8c8c8c]/50"
    }`}
    style={{ "--animation-delay": `${delay}ms` }}
  >
    <CardContent className="relative h-full p-4 md:p-6 flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-4">
        <img
          className="w-16 h-16 md:w-20 md:h-20"
          alt={`${student.name} avatar`}
          src={student.avatar }
        />
      </div>

      <div className="flex flex-col items-start gap-1 md:gap-2 flex-1 mr-2 md:mr-4">
        <div className="font-bold text-base md:text-lg text-right [font-family:'Cairo',Helvetica]">
          {student.name}
        </div>
        <div className="font-normal text-sm md:text-base text-right [font-family:'Cairo',Helvetica]">
          {student.grade}
        </div>
      </div>
    </CardContent>
  </Card>
);

// --- Main Component ---
const LoginSiblings = () => {
  const [selectedStudent, setSelectedStudent] = useState("2");


  return (
    <AuthLayout showBackButton={false}>
      <main className="relative max-w-2xl  flex flex-col items-center py-10 px-4 sm:px-6 md:px-8  pb-20  sm:pb-10 md:pb-0 mx-auto">
        {/* Logo & Title */}
        <div className="w-full max-w-4xl flex flex-row items-center justify-center gap-6 mb-8 md:mb-12">
          <header className="flex flex-col items-center gap-2  ">
            <h1 className="font-bold text-black text-2xl md:text-3xl text-center [font-family:'Cairo',Helvetica]">
              اختر الحساب
            </h1>
            <img
              className="w-48 md:w-56"
              alt="Decorative vector"
              src="https://c.animaapp.com/mfavn83xeP6Ws5/img/vector-1.svg"
            />
          </header>
          <img
            className="w-16 h-16 md:w-20 md:h-20  "
            alt="Layer logo"
            src="https://c.animaapp.com/mfavn83xeP6Ws5/img/layer-1.svg"
          />
        </div>

        {/* Students */}
        <section className="w-full max-w-4xl space-y-4 mb-8 md:mb-12">
          {studentsData.map((student, index) => (
            <StudentCard
              key={student.id}
              student={student}
              isSelected={selectedStudent === student.id}
              delay={600 + index * 200}
              onSelect={setSelectedStudent}
            />
          ))}
        </section>

        {/* Add account */}
        <section className="w-full max-w-4xl flex flex-col items-center relative mt-auto">
          <Button
            variant="outline"
            className="w-full max-w-2xl h-14 md:h-16 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-[#e89b32] bg-transparent hover:bg-[#e89b32]/10 transition-colors   mb-6 md:mb-8"
          >
            <span className="font-semibold text-sm md:text-base [font-family:'Cairo',Helvetica]">
              إضافة حساب جديد
            </span>
            <PlusIcon className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </section>
      </main>
    </AuthLayout>
  );
};

export default LoginSiblings;
