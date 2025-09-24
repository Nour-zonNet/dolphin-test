import React from "react";

const GradeSelect = ({ value, onChange, classes, loading }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full h-10 sm:h-12 px-4 sm:px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] text-[#5d6062] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none bg-white cursor-pointer text-sm sm:text-base [font-family:'Cairo',Helvetica]"
        required
      >
        <option value=""> اختر الصف الدراسي </option>
        {loading && (
          <option disabled>جاري تحميل الصفوف...</option>
        )}
        {classes?.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>
      <div className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default GradeSelect;
