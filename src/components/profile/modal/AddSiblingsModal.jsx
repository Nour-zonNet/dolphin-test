import React, { useState } from 'react'
import Divider from '../../ui/Divider';
import { useClasses } from '@/features/profile/hooks/useClasses';
import uploadImg from '@/assets/images/upload-img.svg';
import camera from '@/assets/images/camera.svg';
import { ClosePopup } from '@/utils/icons';

const AddSiblingsModal = ({  isOpen, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const { classes, loadingClasses } = useClasses();
  const [profileImage, setProfileImage] = useState(null);

const handleSubmit = (e) => {
  e.preventDefault();

  if (fullName.trim() && gradeLevel && profileImage) {
    const formData = new FormData();
    formData.append("name", fullName.trim());
    formData.append("grade", gradeLevel);
    formData.append("image", profileImage);

    onSubmit(formData); 
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
        <div className="relative flex items-center justify-between py-2 md:py-8">
          <button
            onClick={onClose}
            className="absolute right-0 w-[50px] h-[50px] flex items-center justify-center rounded-full cursor-pointer"
          >
            <img
              className="w-6 md:w-8 lg:w-auto"
              alt="Close"
              src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame.svg"
            />
            {/* <ClosePopup className="w-4 lg:w-8" /> */}
          </button>
          <div className="w-full text-center">
            <h2 className="font-semibold text-navyteal text-base md:text-xl lg:text-[32px]">
              اضافة أخ أو أخت
            </h2>
          </div>
        </div>
        <Divider />

        <form onSubmit={handleSubmit} className="py-4 md:py-8 space-y-4 lg:space-y-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center gap-3.5">
            <label className="relative flex flex-col items-center justify-center cursor-pointer">
                <img
                  className="w-[50px] h-[50px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px] rounded-full"
                  alt="Add photo"
                  src={
                    profileImage
                      ? URL.createObjectURL(profileImage)
                      : uploadImg
                  }

                />
                <img
                    className="w-5 md:w-7 h-5 md:h-7 lg:w-8 lg:h-8 absolute bottom-0 right-0 cursor-pointer"
                    alt="Edit"
                    src={camera}
                  />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </label>
              <div className="font-semibold text-black text-sm md:text-lg text-center">
                {profileImage ? "تم اختيار صورة" : "أضف صورة"}
              </div>
          </div>

          {/* Full Name Field */}
          <div className="space-y-4">
            <label className="block font-semibold text-navyteal text-sm md:text-lg lg:text-2xl">
              الأسم الكامل
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="اكتب الاسم الكامل"
              className="w-full h-10 md:h-14 lg:h-16 px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] placeholder:text-[#5d5f62] focus:outline-none focus:border-navyteal transition-colors text-[12px] md:text-base lg:text-lg"
              required
            />
          </div>

          {/* Grade Level Field */}
          <div className="space-y-4 mb-4">
            <label className="block font-semibold text-navyteal text-sm md:text-lg lg:text-2xl">
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

          {/* Submit Button */}
          <button
            type="submit"
            className="cursor-pointer w-full py-2 md:py-3 lg:py-4 flex items-center justify-center gap-2 px-4 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors"
          >
            <img
              className="w-3 md:w-4 lg:w-6"
              alt="Add icon"
              src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame-1.svg"
            />
            <span className="font-semibold text-navyteal text-base md:text-xl lg:text-2xl">
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
