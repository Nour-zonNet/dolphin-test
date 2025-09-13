import React, { useState, useEffect } from 'react';
import Divider from '../../ui/Divider';
import { useClasses } from '@/features/profile/hooks/useClasses';
import camera from '@/assets/images/camera.svg';

const AddSiblingsModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [fullName, setFullName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const { classes, loadingClasses } = useClasses();

  const [profileImage, setProfileImage] = useState(null);     
  const [preview, setPreview] = useState("");                  
  const [showReq, setShowReq] = useState(false); 

  const DEFAULT_AVATAR = "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png";

  useEffect(() => {
    if (!profileImage) {
      setPreview(DEFAULT_AVATAR);
      return;
    }
    const url = URL.createObjectURL(profileImage);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profileImage]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!fullName.trim() || !gradeLevel || !profileImage) {
  //     setShowReq(true);
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("name", fullName.trim());
  //   formData.append("grade", gradeLevel);
  //   formData.append("image", profileImage); 

  //     try {
  //         await onSubmit(formData); 
  //       } catch {
  //         onClose();
  //       }
  // };
  // AddSiblingsModal.jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!fullName.trim() || !gradeLevel) {
    setShowReq(true);
    return;
  }

  const formData = new FormData();
  formData.append("name", fullName.trim());
  formData.append("grade", gradeLevel);

  // إذا لم يتم اختيار صورة، استخدم الصورة الافتراضية
  if (profileImage) {
    formData.append("image", profileImage);
  } else {
    // إرسال معرف الصورة الافتراضية أو تركها فارغة حسب متطلبات الباك إند
    formData.append("use_default_image", "true");
  }

  try {
    // مهم: ما تمسكش النجاح هنا — خلّي الأب يتصرف بعد ما الباك إند يرد
    await onSubmit(formData);
  } catch (err) {
    // في حالة الفشل: اقفل المودال ثم "ارمي" الخطأ للأب
    onClose();
    throw err;                 // <— ده المهم
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
              <img className="w-6 md:w-8 lg:w-auto" alt="Close"
                   src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame.svg" />
            </button>
            <div className="w-full text-center">
              <h2 className="font-semibold text-navyteal text-base md:text-xl lg:text-[32px]">
                اضافة أخ أو أخت
              </h2>
            </div>
          </div>
          <Divider />

          <form onSubmit={handleSubmit} className="py-4 md:py-8 space-y-4 lg:space-y-8">
            {/* Profile Picture (اختيارية) */}
            <div className="flex flex-col items-center gap-2.5">
              <label className="relative flex flex-col items-center justify-center cursor-pointer">
                <img
                  className="w-[50px] h-[50px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px] rounded-full object-cover"
                  alt="Profile preview"
                  src={preview || DEFAULT_AVATAR}
                />
                <img
                  className="w-5 md:w-7 h-5 md:h-7 lg:w-8 lg:h-8 absolute bottom-0 right-0 cursor-pointer"
                  alt="اختيار صورة"
                  src={camera}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProfileImage(e.target.files[0] || null)}
                />
              </label>
              <div className="text-xs md:text-sm text-gray-600">
                أضف صورة (اختياري)
              </div>
            </div>

            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="block font-semibold text-navyteal text-sm md:text-lg lg:text-2xl">
                الأسم الكامل <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="اكتب الاسم الكامل"
                className={`w-full h-10 md:h-14 lg:h-16 px-6 rounded-[100px] border-[0.5px] border-solid
                  ${showReq && !fullName.trim() ? "border-red-500" : "border-[#3c3c4366]"}
                  placeholder:text-[#5d5f62] focus:outline-none focus:border-navyteal transition-colors text-[12px] md:text-base lg:text-lg`}
                aria-invalid={showReq && !fullName.trim()}
              />
              {showReq && !fullName.trim() && (
                <p className="text-red-600 text-xs md:text-sm">هذا الحقل مطلوب.</p>
              )}
            </div>

            {/* Grade Level Field */}
            <div className="space-y-2 mb-4">
              <label className="block font-semibold text-navyteal text-sm md:text-lg lg:text-2xl">
                الصف الدراسي الجديد <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className={`w-full h-10 md:h-14 lg:h-16 px-6 rounded-[100px] border-[0.5px] border-solid
                    ${showReq && !gradeLevel ? "border-red-500" : "border-[#3c3c4366]"}
                    text-[#5d6062] focus:outline-none focus:border-navyteal transition-colors appearance-none bg-white cursor-pointer text-[12px] md:text-base lg:text-lg`}
                  aria-invalid={showReq && !gradeLevel}
                >
                  <option value="">اختر الصف الدراسي الجديد</option>
                  {loadingClasses && <option disabled>جاري تحميل الصفوف...</option>}
                  {classes?.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
                <img
                  className="absolute left-8 md:left-14 top-1/2 transform -translate-y-1/2 w-3 md:w-4 lg:w-6 pointer-events-none"
                  alt="Dropdown arrow"
                  src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/angle-left-2.svg"
                />
              </div>
              {showReq && !gradeLevel && (
                <p className="text-red-600 text-xs md:text-sm">هذا الحقل مطلوب.</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer w-full py-2 md:py-3 lg:py-4 flex items-center justify-center gap-2 px-4 rounded-[60px] transition-colors ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#e89b32] hover:bg-[#d18c2d]"
              }`}
            >
              {loading ? (
                <span className="text-navyteal font-semibold text-base md:text-xl lg:text-2xl">
                  جاري الإضافة...
                </span>
              ) : (
                <>
                  <img
                    className="w-3 md:w-4 lg:w-6"
                    alt="Add icon"
                    src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame-1.svg"
                  />
                  <span className="font-semibold text-navyteal text-base md:text-xl lg:text-2xl">
                    إضافة
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSiblingsModal;
