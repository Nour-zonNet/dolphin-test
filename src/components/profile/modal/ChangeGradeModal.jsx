import React, { useEffect, useState } from 'react'
import Divider from '../../ui/Divider';
import { ConfirmCheck, ChevronDown } from '@/utils/icons';
import { useClasses } from '@/features/profile/hooks/useClasses';

const ChangeGradeModal = ({ isOpen, onClose, onConfirm, currentGradeId, setCurrentGradeId }) => {
  const { classes, loadingClasses } = useClasses();
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !loadingClasses && classes?.length > 0) {
      // إذا لم يكن هناك gradeId محدد، أو إذا كان القيمة فارغة، نتأكد من تحديد الصف الحالي
      if (!currentGradeId || currentGradeId === "") {
        // البحث عن الصف الحالي للمستخدم من البيانات المرسلة
        const userCurrentGrade = classes.find(cls => cls.current === true) || classes[0];
        if (userCurrentGrade) {
          setCurrentGradeId(userCurrentGrade.id);
        }
      } else {
        // التأكد من أن الصف المحدد موجود في القائمة
        const match = classes.find(cls => cls.id === Number(currentGradeId));
        if (match) {
          setCurrentGradeId(match.id);
        }
      }
    }
  }, [isOpen, loadingClasses, classes, currentGradeId, setCurrentGradeId]);

  const handleConfirm = async () => {
    if (!currentGradeId) return;
    const selectedClass = classes.find(cls => cls.id === Number(currentGradeId));
    if (!selectedClass) return;

    try {
      setIsLoading(true);
      await onConfirm(selectedClass.name, selectedClass.id);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.relative')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
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
              <h3 className="font-semibold text-navyteal text-base md:text-xl lg:text-[32px] mt-2">
                اختر الصف الدراسي الجديد
              </h3>
            </div>
          </div>

          <Divider />

          {/* Grade Level Field */}
          <div className="space-y-4 mt-4">
            <label className="block font-bold text-navyteal text-sm md:text-base lg:text-xl">
              الصف الدراسي الجديد
            </label>
            <div className="relative">
              <div
                onClick={() => !loadingClasses && setIsDropdownOpen(!isDropdownOpen)}
                className="w-full h-12 md:h-14 lg:h-16 px-4 md:px-6 rounded-[100px] border-2 border-gray-200 hover:border-orangedeep focus:border-navyteal transition-all duration-300 bg-white cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md"
              >
                <span className="text-navyteal text-sm md:text-base lg:text-lg font-medium">
                  {loadingClasses 
                    ? "جاري تحميل الصفوف..." 
                    : currentGradeId 
                      ? classes?.find(cls => cls.id === Number(currentGradeId))?.name || "اختر الصف الدراسي"
                      : "اختر الصف الدراسي الجديد"
                  }
                </span>
                <ChevronDown 
                  className={`w-4 md:w-5 lg:w-6 text-navyteal transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`} 
                />
              </div>
              
              {/* Custom Dropdown */}
              {isDropdownOpen && !loadingClasses && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
                  {classes?.map((cls) => (
                    <div
                      key={cls.id}
                      onClick={() => {
                        setCurrentGradeId(cls.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 md:px-6 py-3 md:py-4 cursor-pointer transition-all duration-200 ${
                        Number(currentGradeId) === cls.id
                          ? 'bg-gradient-to-r from-orangedeep/10 to-navyteal/10 text-navyteal font-bold border-r-4 border-orangedeep'
                          : 'hover:bg-gray-50 text-gray-700 font-medium'
                      } first:rounded-t-2xl last:rounded-b-2xl`}
                    >
                      <span className="text-sm md:text-base lg:text-lg">{cls.name}</span>
                      {Number(currentGradeId) === cls.id && (
                        <span className="mr-2 text-orangedeep text-xs md:text-sm font-bold">(محدد حالياً)</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
              <div className="font-semibold text-base md:text-xl lg:text-2xl">الغاء</div>
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !currentGradeId}
              className="cursor-pointer w-full lg:w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="font-semibold text-base md:text-xl lg:text-2xl">
                  جاري التحديث...
                </div>
              ) : (
                <>
                  <ConfirmCheck className="w-4 md:w-6" />
                  <div className="font-semibold text-base md:text-xl lg:text-2xl">
                    تأكيد التغيير 
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeGradeModal;
