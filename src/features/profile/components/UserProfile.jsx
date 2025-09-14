

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "@/utils/icons";
import { useBrothers } from "../hooks/useBrothers";
import { useDispatch, useSelector } from "react-redux";
import { switchUserAccount, updateUserImage, addSibling } from "../store/profileSlice";
import { Plus } from "@/utils/icons";
import AddSiblingsModal from "@/components/profile/modal/AddSiblingsModal";
import { useModal } from "@/components/feedback/modal/useModal";

const UserProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownWrapperRef = useRef(null);
  const user = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();
  const { brothers = [], loadingBrothers } = useBrothers();
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState({}); 
  const { openStatusModal } = useModal();
  
  // تحديد ما إذا كان المستخدم الحالي هو الطالب الأساسي
  const isPrimaryStudent = user?.isPrimary === true || user?.canAddSiblings === true || user?.accountType === "primary";
  const DEFAULT_AVATAR = "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png";

  const successCheckedRef = useRef(false);
  const resolveAvatar = (src) => {
  if (!src) return DEFAULT_AVATAR;

  const invalids = ["null", "undefined", "default.png", "default.jpg", "avatar.png", "avatar.jpg", ""];
  if (invalids.includes(String(src).trim().toLowerCase())) return DEFAULT_AVATAR;

  if (/^https?:\/\//i.test(src)) return src;

  const base = import.meta.env.VITE_OLD_ASSETS_URL || import.meta.env.VITE_ASSETS_URL || "";
  if (base) {
    const b = base.replace(/\/+$/, "");
    const p = String(src).replace(/^\/+/, "");
    return `${b}/${p}`;
  }

  return src;
};

const handleImgError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = DEFAULT_AVATAR;
};

useEffect(() => {
  if (!successCheckedRef.current) {
    successCheckedRef.current = true;
    const flag = sessionStorage.getItem("SIBLING_ADDED");
    if (flag === "1") {
      sessionStorage.removeItem("SIBLING_ADDED");
      openStatusModal("SUCCESS", {
        title: "تمت الإضافة بنجاح",
        message: "تمت إضافة الأخ/الأخت بنجاح إلى الحساب.",
      });
    }
  }

  if (!open) return; 

  const el = dropdownWrapperRef.current;
  const handlePointerDown = (e) => {
    if (el && !el.contains(e.target)) setOpen(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") setOpen(false);
  };

  document.addEventListener("mousedown", handlePointerDown, true);
  document.addEventListener("touchstart", handlePointerDown, true);
  document.addEventListener("keydown", handleKeyDown, true);

  return () => {
    document.removeEventListener("mousedown", handlePointerDown, true);
    document.removeEventListener("touchstart", handlePointerDown, true);
    document.removeEventListener("keydown", handleKeyDown, true);
  };
}, [open, openStatusModal, dropdownWrapperRef]);

if (!user) return null;

const handleAddSibling = async (siblingData) => {
  // التحقق من أن المستخدم الحالي هو الطالب الأساسي
  if (!isPrimaryStudent) {
    openStatusModal("ERROR", {
      title: "غير مسموح بإضافة الأخوة",
      message: "وظيفة إضافة الأخوة متاحة للطالب الأساسي فقط.",
    });
    return;
  }

  if (brothers.length >= 3) {
    openStatusModal("ERROR", {
      title: "لا يمكنك إضافة أكثر من 3 إخوة",
      message: "لقد وصلت للحد الأقصى المسموح به.",
    });
    return;
  }

  try {
    await dispatch(addSibling(siblingData)).unwrap();

    setIsModalOpen(false);
    openStatusModal("SUCCESS", {
      title: "تمت الإضافة بنجاح",
      message: "سيتم تحديث الصفحة لعرض الأخ/الأخت الجديد.",
    });
    
    // setTimeout(() => {
    //   if (typeof window !== "undefined") {
    //     window.location.reload();            // window.location.replace(window.location.href);
    //     // لو بتستخدم React Router v6 ممكن: navigate(0)
    //   }
    // }, 1200);
  } catch (err) {
    openStatusModal("ERROR", {
      title: "فشل في إضافة الأخ",
      message: err?.message || "حدث خطأ أثناء محاولة الإضافة. حاول مرة أخرى.",
    });
  }
};


    const handleImageChange = (e, userId) => {
    const file = e.target.files[0];
      if (!file) return;

      setSelectedImages((prev) => ({ ...prev, [userId]: file }));
      dispatch(updateUserImage({ userId, file }))
        .unwrap()

    };

  const handleSwitch = async (bro) => {
  if (bro.id === user.id) return; 
  try {
    const res = await dispatch(switchUserAccount(bro.id)).unwrap();

    if (res?.token) {
      localStorage.setItem("token", res.token);
    }
    setOpen(false);
    window.location.reload(); 
  } catch (err) {
    console.error("Failed to switch account:", err);
  }
};

  return (
    <div className="flex items-center gap-4 md:gap-[37px] py-4 md:py-8">
      {/* Current user profile */}
      <div className="relative">
        {/* <img
          // key={user?.profilePicture} 
          key={user.id + (user.profilePicture || DEFAULT_AVATAR)}
          className="w-[70px] md:w-[100px] lg:w-[150px] h-[70px] md:h-[100px] lg:h-[150px] rounded-full object-cover"
          alt="Profile"
          src={
            selectedImages[user.id]
              ? URL.createObjectURL(selectedImages[user.id])
              : user?.profilePicture || "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png"
          }
        /> */}

        <img
          key={user.id + (user.profilePicture || DEFAULT_AVATAR)}
          className="w-[70px] md:w-[100px] lg:w-[150px] h-[70px] md:h-[100px] lg:h-[150px] rounded-full object-cover"
          alt="Profile"
          src={
            selectedImages[user.id]
              ? URL.createObjectURL(selectedImages[user.id])
              : resolveAvatar(user?.profilePicture)
          }
          onError={handleImgError}
        />

        <label className="absolute bottom-0 lg:bottom-2.5 left-0 lg:left-2.5 cursor-pointer">
          <img
            className="w-6 md:w-8 h-6 md:h-8"
            alt="Edit"
            src="https://c.animaapp.com/mf29nm7vjLRxgE/img/frame-1.svg"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, user.id)}
          />
        </label>
      </div>

      {/* Name & Grade */}
      <div ref={dropdownWrapperRef} className="flex items-center md:gap-6">
        <div className="flex flex-col gap-2 md:gap-4">
          <h2 className="text-subtext text-base md:text-2xl lg:text-[32px] font-semibold text-nowrap">
            {user?.name || "—"}
          </h2>
          <p className="text-[#BA7C28] text-[12px] md:text-base lg:text-xl font-semibold">
            {user?.gradeName || "—"}
          </p>
        </div>
          <button onClick={() => setOpen(!open)} className="focus:outline-0">
            <ChevronDown className="w-4 lg:w-6 cursor-pointer -mt-4 md:-mt-5 ms-2" />
          </button>

        {/* Brothers dropdown */}
        <div className="relative">

          {open && (
            <div className="absolute top-2 -right-50 lg:-right-10 bg-white border border-[#D9D9D966] rounded-4xl w-64 md:w-96 overflow-y-auto z-50 p-4">
              {loadingBrothers && (
                <p className="p-3 text-sm text-gray-500">جاري التحميل...</p>
              )}
              {!loadingBrothers && brothers.length === 0 && (
                <p className="p-3 text-sm text-gray-500">لا يوجد إخوة</p>
              )}
              {brothers.map((bro, index) => (
                <div
                  key={bro.id}
                  className={`flex items-center justify-between p-4 cursor-pointer 
                    ${index !== brothers.length - 1 ? "border-b-[0.5px] border-[#8C8C8C44]" : ""}`}
                  onClick={() => handleSwitch(bro)}
                >
                  <div className="flex items-center gap-4">
                    {/* <img
                        key={bro.id + (bro.profilePicture || "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png")}
                        className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover border-[0.5px] border-black/10"
                        src={
                          selectedImages[bro.id] // show local selected file first
                            ? URL.createObjectURL(selectedImages[bro.id])
                            : bro.profilePicture || "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png"
                        }
                        alt={bro.student_name}
                      /> */}
                      <img
                        key={bro.id + (bro.profilePicture || DEFAULT_AVATAR)}
                        className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover border-[0.5px] border-black/10"
                        src={
                          selectedImages[bro.id]
                            ? URL.createObjectURL(selectedImages[bro.id])
                            : resolveAvatar(bro.profilePicture)
                        }
                        alt={bro.student_name}
                        onError={handleImgError}
                      />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-[12px] md:text-xl font-bold text-navyteal text-nowrap">
                          {bro.student_name}
                        </p>
                        {/* مؤشر الطالب الأساسي */}
                        {(bro.isPrimary === true || bro.canAddSiblings === true || bro.accountType === "primary") && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold">
                            أساسي
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] md:text-base font-regular text-navyteal text-nowrap">
                        {bro.class_name}
                      </p>
                    </div>
                  </div>

                  {/* Show image upload for current user */}
                  {bro.id === user.id && (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, bro.id)}
                      />
                      <img
                        className="w-5 h-5 md:w-6 md:h-6"
                        alt="Edit"
                        src="https://c.animaapp.com/mf29nm7vjLRxgE/img/frame-1.svg"
                      />
                    </label>
                  )}
                </div>
              ))}
              {/* زر إضافة أخ - متاح للطالب الأساسي فقط */}
              {isPrimaryStudent && (
                <button onClick={() => {
                  setIsModalOpen(true);
                  setOpen(false);
                  }}
                  className="focus:outline-0 rounded-[32px] flex items-center gap-2 py-2 md:py-3 px-6 cursor-pointer">
                    <Plus className="w-3 md:w-4" />
                    <span className="text-navyteal text-sm md:text-base font-bold">اضافة أخ او أخت</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <AddSiblingsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddSibling}
      />
    </div>
  );
};

export default UserProfile;