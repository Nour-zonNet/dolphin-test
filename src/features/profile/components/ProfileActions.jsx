import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { performLogout } from "@/features/auth/store/authSlice";
import { ProfileButtons } from "@/components";
import { DeleteAccountModal, LogoutModal } from "@/components/profile/modal";

const ProfileActions = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dispatch = useDispatch();
  // Logout modal handlers
  const handleCloseLogoutModal = () => setIsLogoutModalOpen(false);
  const handleConfirmLogout = () => {
    dispatch(performLogout());
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:py-8 mb-20">
      {/* Logout Button */}
      <ProfileButtons
        variant="secondary"
        size=""
        className="w-full cursor-pointer py-3 lg:py-4 border border-[#E89B32]"
        onClick={() => setIsLogoutModalOpen(true)}
      >
        <img
          className="w-4 md:w-5 lg:w-6"
          alt="Logout"
          src="https://c.animaapp.com/mf29nm7vjLRxgE/img/layer-1-2.svg"
        />
        <span className="text-navyteal font-semibold text-base md:text-xl">
          تسجيل خروج
        </span>
      </ProfileButtons>

      {/* Delete Account Button */}
      <ProfileButtons
        variant="danger"
        size=""
        className="w-full cursor-pointer py-3 lg:py-4 border border-[#B3261E]"
        // onClick={() => setIsDeleteModalOpen(true)}
      >
        <img
          className="w-4 md:w-5 lg:w-6"
          alt="Delete"
          src="https://c.animaapp.com/mf29nm7vjLRxgE/img/layer-1-3.svg"
        />
        <span className="text-navyteal font-semibold text-base md:text-xl">
          تعطيل الحساب
        </span>
      </ProfileButtons>

      {/* Delete Account Modal */}
      {/* <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      /> */}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default ProfileActions;
