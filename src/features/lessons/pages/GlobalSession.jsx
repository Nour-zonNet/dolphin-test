import React from "react";
import logo from "../../../assets/logo/dolphinLogo.png";

const GlobalSessionPage = () => {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4 font-sans"
    >
      <div className="bg-white rounded-2xl  w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r  p-6 text-white text-center">
          <img src={logo} alt="logo" className=" mx-auto h-15" />
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6 border rounded-xl border-gray-200">
          {/* Teacher Name */}
          <div className="space-y-2">
            <label className="block  text-[#E89B32] font-bold">
              اسم المعلم:
            </label>
            <div className="bg-[#DDE8EE] rounded-2xl p-3  text-navyteal  border-gray-200">
              الزهراء ذهري
            </div>
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <label className="block  text-[#E89B32] font-bold">
              الصف الدراسي
            </label>
            <div className="bg-[#DDE8EE] rounded-2xl p-3  text-navyteal  border-gray-200">
              الصف الرابع الابتدائي
            </div>
          </div>

          {/* Lesson */}
          <div className="space-y-2">
            <label className="block  text-[#E89B32] font-bold">الدرس:</label>
            <div className="bg-[#DDE8EE] rounded-2xl p-3  text-navyteal  border-gray-200">
              الاشعال المساعدة
            </div>
          </div>

          {/* Group */}
          <div className="space-y-2">
            <label className="block  text-[#E89B32] font-bold">المجموعة:</label>
            <div className="bg-[#DDE8EE] rounded-2xl p-3  text-navyteal  border-gray-200">
              الرابعة
            </div>
          </div>

          <div className="space-y-4 border-[#00477C] rounded-2xl p-4 border-1 border-dashed">
            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block  text-[#E89B32] font-bold">
                رقم الجوال
              </label>
              <input
                type="tel"
                placeholder="أدخل رقم جوالك"
                className="w-full p-3 border border-gray-300  rounded-2xl  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orangedeep focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button className="w-full bg-gradient-to-r   text-navyteal py-3 rounded-full  font-bold  bg-orangedeep  transition-all duration-300 shadow-md hover:shadow-lg">
              دخول الحصة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSessionPage;
