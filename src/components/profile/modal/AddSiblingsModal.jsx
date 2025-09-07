import React, { useState } from 'react'
import Divider from '../../ui/Divider';
import { useClasses } from '@/features/profile/hooks/useClasses';

const AddSiblingsModal = ({  isOpen, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const { classes, loadingClasses, classesError } = useClasses();
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fullName.trim() && gradeLevel) {
      onSubmit({ name: fullName.trim(), grade: Number(gradeLevel), profileImage });
      setFullName("");
      setGradeLevel("");
      setProfileImage(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-[32px] border-[0.5px] border-solid border-[#8c8c8c] w-[95%] md:w-[60%] my-auto">
        <div className="w-[90%] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between py-4 md:py-8">
          <button
            onClick={onClose}
            className="w-[50px] h-[50px] flex items-center justify-center rounded-full cursor-pointer"
          >
            <img
              className="w-6 md:w-auto"
              alt="Close"
              src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame.svg"
            />
          </button>
          <div className="flex-1 text-center">
            <h2 className="font-semibold text-navyteal text-base md:text-xl lg:text-[32px]">
              اضافة أخ أو أخت
            </h2>
          </div>
        </div>
        <Divider />

        <form onSubmit={handleSubmit} className="py-4 md:py-8 space-y-4 md:space-y-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-3.5">
             <label className="flex flex-col items-center justify-center cursor-pointer">
                <img
                  className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] rounded-full"
                  alt="Add photo"
                  src={
                    profileImage
                      ? URL.createObjectURL(profileImage)
                      : "https://c.animaapp.com/mf2i8zbdeyVMjf/img/group-39988.png"
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </label>
              <div className="font-semibold text-black text-sm md:text-base text-center">
                {profileImage ? "تم اختيار صورة" : "أضف صورة"}
              </div>
          </div>

          {/* Full Name Field */}
          <div className="space-y-4">
            <label className="block font-semibold text-navyteal text-base md:text-xl xl:text-2xl">
              الأسم الكامل
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="اكتب الاسم الكامل"
              className="w-full h-12 md:h-16 px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] placeholder:text-[#5d5f62] focus:outline-none focus:border-navyteal transition-colors text-sm md:text-lg"
              required
            />
          </div>

          {/* Grade Level Field */}
          <div className="space-y-4">
            <label className="block font-semibold text-navyteal text-base md:text-xl xl:text-2xl">
              الصف الدراسي الجديد
            </label>
            <div className="relative">
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full h-12 md:h-16 px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] text-[#5d6062] focus:outline-none focus:border-navyteal transition-colors appearance-none bg-white cursor-pointer text-sm md:text-lg"
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
                className="absolute left-8 md:left-14 top-1/2 transform -translate-y-1/2 w-3 md:w-6 pointer-events-none"
                alt="Dropdown arrow"
                src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/angle-left-2.svg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="cursor-pointer w-full py-3 md:py-4 flex items-center justify-center gap-2 px-4 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors"
          >
            <img
              className="w-3 md:w-6"
              alt="Add icon"
              src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame-1.svg"
            />
            <span className="font-semibold text-navyteal text-base md:text-2xl">
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
