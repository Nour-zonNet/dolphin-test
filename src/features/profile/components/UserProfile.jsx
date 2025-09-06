import React, { useState } from "react";
import { ChevronDown } from "@/utils/icons";
import { useBrothers } from "../hooks/useBrothers";
import { useDispatch, useSelector } from "react-redux";
import { switchUserAccount } from "../store/profileSlice";

const UserProfile = ({  }) => {
  const user = useSelector((state) => state.profile.user);
  const dispatch = useDispatch();
  const { brothers = [], loadingBrothers } = useBrothers();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState();

  
  const handleSwitch = async (bro) => {
    try {
      await dispatch(switchUserAccount(bro.id)).unwrap();
      dispatch(fetchBrothersThunk());
      setOpen(false);
    } catch (err) {
      console.error("Failed to switch account:", err);
    }
  };

  return (
    <div className="flex items-center gap-4 md:gap-[37px] py-4 md:py-8">
      <div className="relative">
        <img
          className="w-[70px] md:w-[150px] h-[70px] md:h-[150px] rounded-full object-cover"
          alt="Profile"
          src={
            user?.profilePicture ||
            "https://c.animaapp.com/mf29nm7vjLRxgE/img/group-39878.png"
          }
        />
        <img
          className="absolute w-6 md:w-8 h-6 md:h-8 bottom-1 md:bottom-2.5 left-2.5"
          alt="Edit"
          src="https://c.animaapp.com/mf29nm7vjLRxgE/img/frame-1.svg"
        />
      </div>

      <div className="flex items-center md:gap-6">
        <div className="flex flex-col gap-2 md:gap-4">
          <h2 className="flex items-center justify-between text-subtext text-base md:text-[32px] text-center font-semibold">
              {user?.name || "—"}
          </h2>
          <p className="text-[#BA7C28] text-sm md:text-xl font-semibold">
              {user?.gradeName || "—"}
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className=""
          >
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
                <button
                  key={bro.id}
                  className="block w-full text-right p-3 hover:bg-gray-100"
                  onClick={() => {
                    handleSwitch(bro)
                    console.log("Switch to brother:", bro);
                    setOpen(false);
                  }}
                >
                  {bro.student_name} — {bro.class_name}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;