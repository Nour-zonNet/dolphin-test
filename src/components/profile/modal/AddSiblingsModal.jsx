import React, { useState } from 'react'
import Divider from '../../ui/Divider';

const AddSiblingsModal = ({  isOpen, onClose, onSubmit }) => {
      const [fullName, setFullName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fullName.trim() && gradeLevel) {
      onSubmit({ fullName: fullName.trim(), gradeLevel });
      setFullName("");
      setGradeLevel("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-[32px] border-[0.5px] border-solid border-[#8c8c8c] w-[95%] md:w-[60%] my-auto">
        <div className="w-[90%] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between py-8">
          <button
            onClick={onClose}
            className="w-[50px] h-[50px] flex items-center justify-center rounded-full cursor-pointer"
          >
            <img
              className="w-8 md:w-auto"
              alt="Close"
              src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame.svg"
            />
          </button>
          <div className="flex-1 text-center">
            <h2 className="font-semibold text-navyteal text-xl md:text-xl lg:text-[32px]">
              اضافة أخ أو أخت
            </h2>
          </div>
        </div>
        <Divider />

        <form onSubmit={handleSubmit} className="py-8 space-y-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-3.5">
            <div className="flex items-center justify-center cursor-pointer">
              <img
                className="w-full h-full object-cover rounded-lg"
                alt="Add photo"
                src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/group-39988.png"
              />
            </div>
            <div className="font-semibold text-black text-base text-center">
              أضف صورة
            </div>
          </div>

          {/* Full Name Field */}
          <div className="space-y-4">
            <label className="block font-semibold text-navyteal text-xl xl:text-2xl">
              الأسم الكامل
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="اكتب الاسم الكامل"
              className="w-full h-18 px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] text-lg placeholder:text-[#5d5f62] focus:outline-none focus:border-navyteal transition-colors"
              required
            />
          </div>

          {/* Grade Level Field */}
          <div className="space-y-4">
            <label className="block font-semibold text-navyteal text-xl md:text-2xl">
              الصف الدراسي الجديد
            </label>
            <div className="relative">
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full h-18 px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] text-lg text-[#5d6062] focus:outline-none focus:border-navyteal transition-colors appearance-none bg-white cursor-pointer"
                required
              >
                <option value="">اختر الصف الدراسي الجديد</option>
                <option value="grade-1">الصف الأول</option>
                <option value="grade-2">الصف الثاني</option>
                <option value="grade-3">الصف الثالث</option>
                <option value="grade-4">الصف الرابع</option>
                <option value="grade-5">الصف الخامس</option>
                <option value="grade-6">الصف السادس</option>
                <option value="grade-7">الصف السابع</option>
                <option value="grade-8">الصف الثامن</option>
                <option value="grade-9">الصف التاسع</option>
                <option value="grade-10">الصف العاشر</option>
                <option value="grade-11">الصف الحادي عشر</option>
                <option value="grade-12">الصف الثاني عشر</option>
              </select>
              <img
                className="absolute left-14 top-1/2 transform -translate-y-1/2 w-4 md:w-6 pointer-events-none"
                alt="Dropdown arrow"
                src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/angle-left-2.svg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="cursor-pointer w-full h-[65px] flex items-center justify-center gap-2 px-4 py-2 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors"
          >
            <img
              className="w-4 md:w-6"
              alt="Add icon"
              src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame-1.svg"
            />
            <span className="font-semibold text-navyteal text-lg md:text-2xl">
              إضافة
            </span>
          </button>
        </form>
        </div>
      </div>
    </div>
  )
}

export default AddSiblingsModal
