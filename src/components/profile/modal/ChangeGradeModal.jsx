import React, { useState } from 'react'
import Divider from '../../ui/Divider';
import { ConfirmCheck } from '../../../utils/icons';

const ChangeGradeModal = ({ isOpen, onClose, onConfirm  }) => {
    const [confirmText, setConfirmText] = useState("");
    const isDeleteEnabled = confirmText.trim() === "حذف";
  
    const handleDelete = () => {
      if (isDeleteEnabled) {
        onConfirm();
      }
    };

     const [gradeLevel, setGradeLevel] = useState("");
    
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
             <h2 className="font-semibold text-navyteal text-xl md:text-[32px]">
                 تغيير الصف الدراسي
              </h2>
              <h3 className="font-semibold text-navyteal text-lg md:text-2xl mt-2">اختر الصف الدراسي الجديد</h3>
            </div>
          </div>

          {/* Divider */}
          <Divider />

          {/* Grade Level Field */}
          <div className="space-y-4 mt-4">
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

          {/* Warning Banner */}
          <div className="bg-[#f8f8f8] rounded-[64px] border border-solid border-[#8c8c8c] py-4 px-8 mt-10 text-center w-full mx-auto">
            <p className="font-semibold text-[#B3261E] text-lg md:text-2xl">
                تغيير الصف الدراسي سيؤثر  علي الباقات  والاشتراكات المتاحة  لك
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row w-full mx-auto gap-[18px] justify-center items-center my-12">
            
            <button
              onClick={onClose}
              className="flex w-full h-[60px] items-center justify-center gap-2 px-4 py-2 border border-orangedeep cursor-pointer rounded-[32px] hover:bg-foundationorangenormal-hover"
            >
              <img
                className="w-6 md:w-8"
                alt="Cancel"
                src="https://c.animaapp.com/mf2jwhdmLJjjfJ/img/layer-1-1.svg"
              />
              <div className="font-semibold text-lg md:text-2xl">
                الغاء
              </div>
            </button>
            <button
              className="flex w-full h-[60px] items-center justify-center gap-2 px-4 py-2 bg-orangedeep hover:bg-btnClicked transition cursor-pointer rounded-[32px] hover:bg-foundationorangenormal-hover"
            >
             <ConfirmCheck className="w-6 md:w-8" />
              <div className="font-semibold text-lg md:text-2xl">
                تأكيد التغيير
              </div>
            </button>
          </div>
          </div>
      </div>
    </div>
  )
}

export default ChangeGradeModal
