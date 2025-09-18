import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChevronDown, Plus } from "@/utils/icons";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useModal } from "@/components/feedback/modal/useModal";
import AddSiblingsModal from "@/components/profile/modal/AddSiblingsModal";
import { addBrother } from "../../auth/store/authSlice";

export const DEFAULT_AVATAR =
  "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { updateUserImage, switchUserAccount, brothers, user } = useAuth();
  const { openStatusModal } = useModal();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState({});
  const dropdownWrapperRef = useRef(null);
  const successCheckedRef = useRef(false);

  // Check if user is primary student
  const isPrimaryStudent =
    user?.isPrimary === true ||
    user?.canAddSiblings === true ||
    user?.accountType === "primary";

  // Resolve avatar helper
  const resolveAvatar = (src) => {
    if (!src) return DEFAULT_AVATAR;
    const invalids = [
      "null",
      "undefined",
      "default.png",
      "default.jpg",
      "avatar.png",
      "avatar.jpg",
      "",
    ];
    if (invalids.includes(String(src).trim().toLowerCase()))
      return DEFAULT_AVATAR;
    if (/^https?:\/\//i.test(src)) return src;

    const base =
      import.meta.env.VITE_OLD_ASSETS_URL ||
      import.meta.env.VITE_ASSETS_URL ||
      "";
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

  // Handle outside click + Escape for dropdown
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
  }, [open, openStatusModal]);

  if (!user) return null;

  // Add sibling
  const handleAddSibling = async (siblingData) => {
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
      await dispatch(addBrother(siblingData)).unwrap();
      setIsModalOpen(false);
      openStatusModal("SUCCESS", {
        title: "تمت الإضافة بنجاح",
        message: "سيتم تحديث الصفحة لعرض الأخ/الأخت الجديد.",
      });
    } catch (err) {
      openStatusModal("ERROR", {
        title: "فشل في إضافة الأخ",
        message:
          err?.message || "حدث خطأ أثناء المحاولة. حاول مرة أخرى لاحقًا.",
      });
    }
  };

  // Update profile image
  const handleImageChange = async (e, userId) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImages((prev) => ({ ...prev, [userId]: file }));
    try {
      await updateUserImage(file);
    } catch (err) {
      openStatusModal("ERROR", {
        title: "فشل رفع الصورة",
        message: err?.message || "تعذر رفع الصورة. حاول مرة أخرى.",
      });
    }
  };

  // Switch account
  const handleSwitch = async (bro) => {
    if (bro.id === user.id) return;
    try {
      const { payload } = await switchUserAccount(bro.id);
      if (payload?.token) localStorage.setItem("token", payload.token);
      setOpen(false);
    } catch (err) {
      openStatusModal("ERROR", {
        title: "فشل تبديل الحساب",
        message: err?.message || "تعذر تبديل الحساب. حاول مرة أخرى.",
      });
    }
  };

  return (
    <div className="flex items-center flex-col md:flex-row gap-4 md:gap-[37px] py-4 md:py-8">
      {/* Current user profile */}
      <div className="relative">
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

      {/* Name & Grade + Dropdown */}
      <div onClick={() => setOpen(!open)} ref={dropdownWrapperRef} className="flex cursor-pointer items-center md:gap-6">
        <div className="flex flex-col gap-2 md:gap-4">
          <h2 className="text-subtext text-base md:text-2xl lg:text-[32px] font-semibold text-nowrap">
            {user?.name || "—"}
          </h2>
          <p className="text-[#BA7C28] text-[12px] md:text-base lg:text-xl font-semibold">
            {user?.gradeName || "—"}
          </p>
        </div>

        <button  className="focus:outline-0">
          <ChevronDown className="w-4 lg:w-6 cursor-pointer -mt-4 md:-mt-5 ms-2" />
        </button>

        {/* Brothers dropdown */}
        <div className="relative">
          <div
            role="menu"
            aria-label="قائمة الإخوة"
            className={`absolute top-2 -right-50 lg:-right-10 bg-white border border-[#D9D9D966] rounded-4xl z-50 p-4 shadow-lg 
              transition-all duration-300 ease-in-out transform 
              ${
                open
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            {/* Empty state */}
            {brothers.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-6 text-gray-500">
                <img
                  src="/empty.svg"
                  alt="Empty"
                  className="w-16 h-16 opacity-70"
                />
                <p className="text-sm">لا يوجد إخوة</p>
              </div>
            )}

            {/* Brothers List */}
            {brothers?.map((bro, index) => (
              <div
                role="menuitem"
                key={bro.id}
                className={`flex items-center justify-between p-4 cursor-pointer rounded-lg transition 
                  hover:bg-gray-50 active:bg-gray-100 
                  ${
                    index !== brothers.length - 1
                      ? "border-b-[0.5px] border-[#8C8C8C44]"
                      : ""
                  }`}
                onClick={() => handleSwitch(bro)}
              >
                <div className="flex items-center gap-4">
                  {bro.profilePicture ? (
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden border-[0.5px] border-black/10">
                      <img
                        key={bro.id + (bro.profilePicture || DEFAULT_AVATAR)}
                        className="w-full h-full object-cover"
                        src={
                          selectedImages[bro.id]
                            ? URL.createObjectURL(selectedImages[bro.id])
                            : resolveAvatar(bro.profilePicture)
                        }
                        alt={bro.student_name}
                        onError={handleImgError}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-gray-200 text-navyteal font-bold">
                      {bro.student_name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] md:text-xl font-bold text-navyteal text-nowrap">
                        {bro.student_name}
                      </p>
                      {(bro.isPrimary ||
                        bro.canAddSiblings ||
                        bro.accountType === "primary") && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold">
                          أساسي
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] md:text-base text-navyteal text-nowrap">
                      {bro.class_name}
                    </p>
                  </div>
                </div>

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

            {/* Add sibling button */}
          </div>
        </div>
      </div>
      {isPrimaryStudent && (
        <button
          onClick={() => {
            setIsModalOpen(true);
            setOpen(false);
          }}
          className="w-full mt-3 flex items-center justify-center gap-2 py-2 md:py-3 px-6 
                           bg-orangedeep hover:bg-orange-100 active:bg-orange-200 
                           rounded-[32px] font-bold text-navyteal transition focus:outline-0"
        >
          <Plus className="w-3 md:w-4" />
          <span className="text-sm md:text-base">إضافة أخ أو أخت</span>
        </button>
      )}
      <AddSiblingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSibling}
      />
    </div>
  );
};

export default UserProfile;
