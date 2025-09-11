import React, { useState } from 'react'
import Divider from '../../ui/Divider';
import { ConfirmCheck } from '@/utils/icons';
import { useClasses } from '@/features/profile/hooks/useClasses';
const ChangeGradeModal = ({ isOpen, onClose, onConfirm  }) => {
    const [gradeLevel, setGradeLevel] = useState("");
    const { classes, loadingClasses } = useClasses();
    
    const handleConfirm = () => {
      if (gradeLevel) {
        // const selectedClass = classes.find(cls => cls.id === gradeLevel);
        const selectedClass = classes.find(cls => cls.id === Number(gradeLevel));
        if (selectedClass) {
          onConfirm(selectedClass.name, selectedClass.id); 
        }
        setGradeLevel("");
        // onClose();
        // setGradeLevel();
      }
    };
    
  if (!isOpen) return null;
  return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
        <div className="bg-white rounded-[32px] border-[0.5px] border-solid border-[#8c8c8c] w-[95%] md:w-[60%] my-auto">
          <div className="w-[90%] mx-auto">
          {/* Header */}
          <div className="relative flex items-center justify-between py-4 md:py-8">
            <button
            onClick={onClose}
            className="absolute right-0 w-[50px] h-[50px] flex items-center justify-center rounded-full cursor-pointer"
          >
            <img
              className="w-6 md:w-8 lg:w-auto"
              alt="Close"
              src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame.svg"
            />
          </button>
            <div className="w-full text-center">
             <h2 className="font-semibold text-navyteal text-base md:text-xl lg:text-[32px]">
              تغيير الصف الدراسي
              </h2>
              <h3 className="font-semibold text-navyteal text-base md:text-xl lg:text-[32px] mt-2">اختر الصف الدراسي الجديد</h3>
            </div>
          </div>

          {/* Divider */}
          <Divider />

          {/* Grade Level Field */}
          <div className="space-y-4 mt-4">
            <label className="block font-semibold text-navyteal text-sm md:text-base lg:text-2xl">
              الصف الدراسي الجديد
            </label>
            <div className="relative">
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full h-10 md:h-14 lg:h-16 px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] text-[#5d6062] focus:outline-none focus:border-navyteal transition-colors appearance-none bg-white cursor-pointer text-[12px] md:text-base lg:text-lg"
                required
              >
                <option value="">اختر الصف الدراسي الجديد</option>
                {loadingClasses && <option disabled>جاري تحميل الصفوف...</option>}
                {classes?.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <img
                className="absolute left-8 md:left-14 top-1/2 transform -translate-y-1/2 w-3 md:w-4 lg:w-6 pointer-events-none"
                alt="Dropdown arrow"
                src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/angle-left-2.svg"
              />
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-[#f8f8f8] rounded-[64px] border border-solid border-[#8c8c8c] py-2 md:py-4 px-8 mt-6 md:mt-10 text-center w-full mx-auto">
            <p className="font-semibold text-[#B3261E] text-sm md:text-base lg:text-2xl">
                تغيير الصف الدراسي سيؤثر  علي الباقات  والاشتراكات المتاحة  لك
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row w-full mx-auto gap-[18px] justify-center items-center my-4 md:my-12">
            <button
              onClick={onClose}
              className="cursor-pointer w-full lg:w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 border border-orangedeep rounded-[60px] transition-colors disabled:cursor-not-allowed"
            >
              <img
                className="w-4 md:w-6"
                alt="Cancel"
                src="https://c.animaapp.com/mf2jwhdmLJjjfJ/img/layer-1-1.svg"
              />
              <div className="font-semibold text-base md:text-xl lg:text-2xl">
                الغاء
              </div>
            </button>
            <button
              onClick={handleConfirm}
              className="cursor-pointer w-full lg:w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors disabled:cursor-not-allowed"
            >
              <ConfirmCheck className="w-4 md:w-6" />
              <div className="font-semibold text-base md:text-xl lg:text-2xl">
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
