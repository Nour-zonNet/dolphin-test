

import React, { useState, useRef } from "react";
import { ChevronDown } from "@/utils/icons";
import { useBrothers } from "../hooks/useBrothers";
import { useDispatch, useSelector } from "react-redux";
import { switchUserAccount, updateUserImage, getBrothers, addSibling } from "../store/profileSlice";
import { toast } from "react-toastify";
import { Plus } from "@/utils/icons";
import 'react-toastify/dist/ReactToastify.css';
import AddSiblingsModal from "@/components/profile/modal/AddSiblingsModal";

const UserProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();
  const { brothers = [], loadingBrothers } = useBrothers();
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState({}); 

  if (!user) return null;
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
      await dispatch(switchUserAccount(bro.id)).unwrap();
      await dispatch(getBrothers()).unwrap();

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
    try {
        await dispatch(addSibling(siblingData)).unwrap();
        toast.success("تمت إضافة الأخ بنجاح");
      } catch  {
        toast.error("فشل في إضافة الأخ");
      }
  };

  return (
    <div className="flex items-center gap-4 md:gap-[37px] py-4 md:py-8">
      {/* Current user profile */}
      <div className="relative">
        <img
          // key={user?.profilePicture} 
          key={user.id + (user.profilePicture || "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png")}
          className="w-[70px] md:w-[100px] lg:w-[150px] h-[70px] md:h-[100px] lg:h-[150px] rounded-full object-cover"
          alt="Profile"
          src={
            selectedImages[user.id]
              ? URL.createObjectURL(selectedImages[user.id])
              : user?.profilePicture || "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png"
          }
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
      <div className="flex items-center md:gap-6">
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
        <div className="relative" ref={dropdownRef}>

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
                    <img
                        key={bro.id + (bro.profilePicture || "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png")}
                        className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover border-[0.5px] border-black/10"
                        src={
                          selectedImages[bro.id] // show local selected file first
                            ? URL.createObjectURL(selectedImages[bro.id])
                            : bro.profilePicture || "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png"
                        }
                        alt={bro.student_name}
                      />
                    <div className="space-y-2">
                      <p className="text-[12px] md:text-xl font-bold text-navyteal text-nowrap">
                        {bro.student_name}
                      </p>
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
              <button onClick={() => {
                setIsModalOpen(true);
                setOpen(false);
                }}
                className="focus:outline-0 rounded-[32px] flex items-center gap-2 py-2 md:py-3 px-6 cursor-pointer">
                  <Plus className="w-3 md:w-4" />
                  <span className="text-navyteal text-sm md:text-base font-bold">اضافة أخ او أخت</span>
              </button>
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