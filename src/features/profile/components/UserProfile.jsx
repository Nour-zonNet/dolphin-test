import React, { useState } from "react";
import { ChevronDown } from "@/utils/icons";
import { useBrothers } from "../hooks/useBrothers";
import { useDispatch, useSelector } from "react-redux";
import { switchUserAccount, updateUserImage, getBrothers } from "../store/profileSlice";

const UserProfile = () => {
  const user = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();
  const { brothers = [], loadingBrothers } = useBrothers();
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState({}); 

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
    if (bro.id === user.id) return; // Skip switching if current user
    try {
      await dispatch(switchUserAccount(bro.id)).unwrap();
      await dispatch(getBrothers()).unwrap();
      setOpen(false);
    } catch (err) {
      console.error("Failed to switch account:", err);
    }
  };

  return (
    <div className="flex items-center gap-4 md:gap-[37px] py-4 md:py-8">
      {/* Current user profile */}
      <div className="relative">
        <img
          className="w-[70px] md:w-[150px] h-[70px] md:h-[150px] rounded-full object-cover"
          alt="Profile"
          src={user?.profilePicture || "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png"}
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
          <button onClick={() => setOpen(!open)}>
            <ChevronDown className="w-3 md:w-6 cursor-pointer -mt-8" />
          </button>

          {open && (
            <div className="absolute top-4 bg-white shadow-lg rounded-lg w-56 max-h-60 overflow-y-auto z-50">
              {loadingBrothers && (
                <p className="p-3 text-sm text-gray-500">جاري التحميل...</p>
              )}
              {!loadingBrothers && brothers.length === 0 && (
                <p className="p-3 text-sm text-gray-500">لا يوجد إخوة</p>
              )}
              {brothers.map((bro) => (
                <div
                  key={bro.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleSwitch(bro)}
                >
                  <div className="flex items-center gap-2">
                    <img
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                        src={
                          selectedImages[bro.id] // show local selected file first
                            ? URL.createObjectURL(selectedImages[bro.id])
                            : bro.profilePicture || "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png"
                        }
                        alt={bro.student_name}
                      />
                    <span className="text-right text-sm md:text-base">
                      {bro.student_name} — {bro.class_name}
                    </span>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
