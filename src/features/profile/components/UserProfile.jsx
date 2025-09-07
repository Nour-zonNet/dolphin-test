import React, { useEffect, useState } from "react";
import { ChevronDown } from "@/utils/icons";
import { useBrothers } from "../hooks/useBrothers";
import { useDispatch, useSelector } from "react-redux";
import { switchUserAccount, updateUserImage, getBrothers } from "../store/profileSlice";
import { Plus } from "@/utils/icons";
import AddSiblingsModal from "@/components/profile/modal/AddSiblingsModal";

const UserProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();
  const { brothers = [], loadingBrothers } = useBrothers();
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState({}); 

  if (!user) return null;
  const handleImageChange = (e, userId) => {
  const file = e.target.files[0];
    if (!file) return;

    // update local preview
    setSelectedImages((prev) => ({ ...prev, [userId]: file }));

    // send to backend
    dispatch(updateUserImage({ userId, file }))
      .unwrap()
      .then(() => console.log("Profile image updated successfully"))
      .catch((err) => console.error("Failed to update profile image:", err));
  };

  const handleSwitch = async (bro) => {
    if (bro.id === user.id) return; 
    try {
      await dispatch(switchUserAccount(bro.id)).unwrap();
      await dispatch(getBrothers()).unwrap();

      // Clear local preview
      setSelectedImages({});

      setOpen(false);
    } catch (err) {
      console.error("Failed to switch account:", err);
    }
  };

  const handleAddSibling = async (siblingData) => {
    if (brothers.length >= 3) {
        toast.error("لا يمكنك إضافة أكثر من 3 إخوة");
        return;
      }
    // try {
    //   setSubmitting(true);
    //   await dispatch(addSibling(siblingData)).unwrap();
    //   setIsModalOpen(false);
    // } catch (err) {
    //   console.error("Error adding sibling:", err);
    //   alert("فشل إضافة الأخ/الأخت. حاول مرة أخرى");
    // } finally {
    //   setSubmitting(false);
    // }
    try {
        await dispatch(addSibling(siblingData)).unwrap();
        toast.success("تمت إضافة الأخ بنجاح");
      } catch (err) {
        toast.error("فشل في إضافة الأخ");
      }
  };

  // useEffect(() => {
  //   return () => {
  //     Object.values(selectedImages).forEach((file) => URL.revokeObjectURL(file));
  //   };
  // }, [selectedImages]);

  return (
    <div className="flex items-center gap-4 md:gap-[37px] py-4 md:py-8">
      {/* Current user profile */}
      <div className="relative">
        <img
          key={user?.profilePicture} 
          className="w-[70px] md:w-[150px] h-[70px] md:h-[150px] rounded-full object-cover"
          alt="Profile"
          src={
            selectedImages[user.id]
              ? URL.createObjectURL(selectedImages[user.id])
              : user?.profilePicture || "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png"
          }
        />

        <label className="absolute bottom-1 md:bottom-2.5 left-2.5 cursor-pointer">
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
      <div className="flex items-center md:gap-6">
        <div className="flex flex-col gap-2 md:gap-4">
          <h2 className="text-subtext text-base md:text-[32px] font-semibold">
            {user?.name || "—"}
          </h2>
          <p className="text-[#BA7C28] text-sm md:text-xl font-semibold">
            {user?.gradeName || "—"}
          </p>
        </div>

        {/* Brothers dropdown */}
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="focus:outline-0">
            <ChevronDown className="w-3 md:w-6 cursor-pointer -mt-8" />
          </button>

          {open && (
            <div className="absolute top-4 bg-white shadow-lg rounded-4xl w-96 overflow-y-auto z-50 p-4">
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
                    ${index !== brothers.length - 1 ? "border-b-[0.5px] border-[#8C8C8C88]" : ""}`}
                  onClick={() => handleSwitch(bro)}
                >
                  <div className="flex items-center gap-4">
                    <img
                        className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover border-[0.5px] border-black/10"
                        src={
                          selectedImages[bro.id] // show local selected file first
                            ? URL.createObjectURL(selectedImages[bro.id])
                            : bro.profilePicture || "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png"
                        }
                        alt={bro.student_name}
                      />
                    <div className="space-y-2">
                      <p className="text-base md:text-xl font-bold text-navyteal">
                        {bro.student_name}
                      </p>
                      <p className="text-sm md:text-base font-regular text-navyteal">
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
              <button onClick={() => setIsModalOpen(true)} className="focus:outline-0 rounded-[32px] flex items-center gap-2 py-2 md:py-3 px-6 cursor-pointer">
                  <Plus className="w-3 md:w-4" />
                  <span className="text-navyteal text-sm md:text-base font-bold">اضافة أخ او أخت</span>
              </button>
                <AddSiblingsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddSibling}
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;