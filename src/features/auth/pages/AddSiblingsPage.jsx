import React, { useState, useEffect } from "react";
import { AuthLayout } from "../components";
import { useClasses } from "@/features/profile/hooks/useClasses";
import { LeftArrow} from "../../../utils/icons";
import { useDispatch } from "react-redux";
import { addBrotherLocal, addSibling } from "../../profile/store/profileSlice";
import { toast } from "react-toastify";
import { useBrothers } from "../../profile/hooks/useBrothers";
import profileImg from "@/assets/images/profileImage.png";

const AddSiblingsPage = () => {

  const [fullName, setFullName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [hasSiblings, setHasSiblings] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { classes, loadingClasses } = useClasses();
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { brothers } = useBrothers();
  const dispatch = useDispatch();

  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(profileImage);
    } else {
      setImagePreview(null);
    }
  }, [profileImage]);

  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5MB");
        return;
      }
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast.error("يرجى إدخال الاسم الكامل");
      return;
    }
    
    if (!gradeLevel) {
      toast.error("يرجى اختيار الصف الدراسي");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const siblingData = {
        name: fullName.trim(),
        grade: Number(gradeLevel),
        profileImage,
      };
      
      // Dispatch to Redux store
      dispatch(addBrotherLocal(siblingData));
      
      // Try to save to server
      try {
        await dispatch(addSibling(siblingData)).unwrap();
        toast.success("تمت إضافة الأخ بنجاح");
      } catch (error) {
        console.warn("Failed to save to server, but stored locally", error);
        toast.success("تمت إضافة الأخ بنجاح (محلياً)");
      }
      
      // Reset form
      setFullName("");
      setGradeLevel("");
      setProfileImage(null);
      setImagePreview(null);
    } catch  {
      toast.error("فشل في إضافة الأخ");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <AuthLayout showBackButton={false}>
      <main className="relative max-w-2xl flex flex-col items-center py-4 sm:py-6 px-4 sm:px-6 md:px-8 pb-16 sm:pb-10 mx-auto">
        <div className="max-w-md flex flex-row items-center justify-between gap-4 mb-6 md:mb-8">
          <header className="flex flex-col items-center gap-2">
            <h1 className="font-bold text-status text-xl sm:text-2xl text-right [font-family:'Cairo',Helvetica]">
              اضف اخوة
            </h1>
            <img
              className="w-36 sm:w-44 mt-2"
              alt="Decorative vector"
              src="https://c.animaapp.com/mfavn83xeP6Ws5/img/vector-1.svg"
            />
          </header>
          <img
            className="w-12 h-12 sm:w-16 sm:h-16"
            alt="Layer logo"
            src="https://c.animaapp.com/mfavn83xeP6Ws5/img/layer-1.svg"
          />
        </div>

        {/* Content */}
        <section className="w-full max-w-md space-y-6 mb-6">
          <div className="space-y-3 text-center">
            <h2 className="text-navyteal text-lg sm:text-xl font-semibold [font-family:'Cairo',Helvetica]">
              هل لديك اخوة ؟
            </h2>
            <p className="text-status text-sm sm:text-base [font-family:'Cairo',Helvetica]">
              اخبرنا اذا كان لديك اخوة لتضيفهم الى حسابك
            </p>
          </div>

          <div className="flex items-stretch gap-3">
            <button
              className={`flex-1 py-3 rounded-xl border transition-colors [font-family:'Cairo',Helvetica] ${
                hasSiblings === true 
                  ? "bg-orange-50 border-orange-500 text-orange-700" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setHasSiblings(true)}
            >
              نعم
            </button>
            <button
              className={`flex-1 py-3 rounded-xl border transition-colors [font-family:'Cairo',Helvetica] ${
                hasSiblings === false 
                  ? "bg-gray-100 border-gray-400 text-gray-700" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setHasSiblings(false)}
            >
              لا
            </button>
          </div>

          {/* Form (shown only if user has siblings) */}
          {hasSiblings === true && (
            <div className="w-full" id="sibling-form">
              <form
                onSubmit={handleSubmit}
                className="py-4 md:py-6 space-y-4 md:space-y-6"
              >
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-2">
                  <label className="flex flex-col items-center justify-center cursor-pointer relative">
                    <div className="relative">
                      <img
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-200"
                        alt="Add photo"
                        src={imagePreview || "https://c.animaapp.com/mf2i8zbdeyVMjf/img/group-39988.png"}
                      />
                      <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <div className="font-semibold text-black text-sm sm:text-base text-center [font-family:'Cairo',Helvetica]">
                    {imagePreview ? "تم اختيار صورة" : "أضف صورة"}
                  </div>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileImage(null);
                        setImagePreview(null);
                      }}
                      className="text-red-500 text-sm mt-1"
                    >
                      إزالة الصورة
                    </button>
                  )}
                </div>

                {/* Full Name Field */}
                <div className="space-y-2">
                  <label className="block font-semibold text-navyteal text-sm sm:text-base md:text-lg [font-family:'Cairo',Helvetica]">
                    الأسم الكامل
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="اكتب الاسم الكامل"
                    className="w-full h-10 sm:h-12 px-4 sm:px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] placeholder:text-[#5d5f62] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base [font-family:'Cairo',Helvetica]"
                    required
                  />
                </div>

                {/* Grade Level Field */}
                <div className="space-y-2">
                  <label className="block font-semibold text-navyteal text-sm sm:text-base md:text-lg [font-family:'Cairo',Helvetica]">
                    الصف الدراسي
                  </label>
                  <div className="relative">
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full h-10 sm:h-12 px-4 sm:px-6 rounded-[100px] border-[0.5px] border-solid border-[#3c3c4366] text-[#5d6062] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none bg-white cursor-pointer text-sm sm:text-base [font-family:'Cairo',Helvetica]"
                      required
                    >
                      <option value=""> اختر الصف الدراسي </option>
                      {loadingClasses && (
                        <option disabled>جاري تحميل الصفوف...</option>
                      )}
                      {classes?.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`cursor-pointer w-full py-2 sm:py-3 flex items-center justify-center gap-2 px-4 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors mt-4 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <LeftArrow color="#061A2F" />
                  )}
                  <span className="font-semibold text-navyteal text-sm sm:text-base md:text-lg [font-family:'Cairo',Helvetica]">
                    {isSubmitting ? "جاري الإضافة..." : "حفظ ومتابعة"}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* Message when user has no siblings */}
          {hasSiblings === false && (
            <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200 mt-4">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2 [font-family:'Cairo',Helvetica]">
                لا يوجد إخوة
              </h3>
              <p className="text-status text-sm [font-family:'Cairo',Helvetica]">
                يمكنك إضافة إخوة لاحقاً من خلال الإعدادات
              </p>
            </div>
          )}
        </section>

        {/* Brothers List */}
        {brothers.length > 0 && (
          <section className="w-full max-w-4xl space-y-4 mb-8 border-t border-gray-300 py-6 px-4 sm:px-6 md:px-8 md:mb-12">
           
            {brothers.map((bro) => (
              <div
                key={bro.id}
                className="w-full h-18 md:h-20 rounded-2xl  p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                    <img
                      className="w-full h-full object-cover"
                      alt={`${bro.name} avatar`}
                      src={bro.profileImage || profileImg}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-bold text-base text-right [font-family:'Cairo',Helvetica]">
                      {bro.name}
                    </div>
                    <div className="font-normal text-sm text-gray-600 text-right [font-family:'Cairo',Helvetica]">
                      {classes?.find(c => c.id === bro.grade.toString())?.name || `الصف ${bro.grade}`}
                    </div>
                  </div>
                </div>
                {/* <div className="flex gap-2">
                  <button 
                    onClick={() => editBrother(bro)}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                  >
                    <EditIcon size={18} />
                  </button>
                  <button 
                    onClick={() => removeBrother(bro.id)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <TrashIcon size={18} />
                  </button>
                </div> */}
              </div>
            ))}
          </section>
        )}
      </main>
    </AuthLayout>
  );
};

export default AddSiblingsPage;