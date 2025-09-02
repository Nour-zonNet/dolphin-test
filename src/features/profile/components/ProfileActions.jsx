import React, { useState } from 'react'
import { ProfileButtons } from '@/components'
import { DeleteAccountModal, LogoutModal } from '@/components/profile/modal';

const ProfileActions = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Delete modal handlers
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);
  const handleConfirmDelete = () => {
    console.log("Account deletion confirmed");
    setIsDeleteModalOpen(false);
  };

  // Logout modal handlers
  const handleCloseLogoutModal = () => setIsLogoutModalOpen(false);
  const handleConfirmLogout = () => {
    console.log("Logout confirmed");
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 py-8 mb-20">
      {/* Logout Button */}
      <ProfileButtons
        variant="secondary"
        size="md"
        className="w-full cursor-pointer"
        onClick={() => setIsLogoutModalOpen(true)}
      >
        <img
          className="w-6 md:w-8"
          alt="Logout"
          src="https://c.animaapp.com/mf29nm7vjLRxgE/img/layer-1-2.svg"
        />
        <span className="text-navyteal font-semibold text-base md:text-xl">تسجيل خروج</span>
      </ProfileButtons>

      {/* Delete Account Button */}
      <ProfileButtons
        variant="danger"
        size="md"
        className="w-full cursor-pointer"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        <img
          className="w-6 md:w-8"
          alt="Delete"
          src="https://c.animaapp.com/mf29nm7vjLRxgE/img/layer-1-3.svg"
        />
        <span className="text-navyteal font-semibold text-base md:text-xl">حذف الحساب</span>
      </ProfileButtons>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
      />
    </div>
  )
}

export default ProfileActions
