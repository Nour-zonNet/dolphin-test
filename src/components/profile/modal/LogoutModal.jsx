import React from 'react'
import Divider from '../../ui/Divider';
import { ConfirmCheck } from '../../../utils/icons';
import { useDispatch } from 'react-redux';
import { performLogout } from '@/features/auth/store/authSlice';

const LogoutModal = ({ isOpen, onClose, onConfirm  }) => {
    const dispatch = useDispatch();
    const handleConfirm = () => {
      if (typeof onConfirm === 'function') {
        onConfirm();
        onClose && onClose();
        return;
      }

      dispatch(performLogout());
      onClose && onClose();
    };
    if (!isOpen) return null;
  return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
        <div className="bg-white rounded-[32px] border-[0.5px] border-solid border-[#8c8c8c] w-[95%] md:w-[60%] my-auto">
          <div className="w-[90%] mx-auto">
          {/* Header */}
          <div className="relative flex items-center justify-between py-4 md:py-8">
            <button
            onClick={onClose}
            className="absolute right-0 w-[50px] h-[50px] flex items-center justify-center rounded-full cursor-pointer"
          >
            <img
              className="w-6 md:w-8 lg:w-auto"
              alt="Close"
              src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame.svg"
            />
          </button>
            <div className="w-full text-center">
              <h2 className="font-semibold text-[#B3261E] text-base md:text-xl lg:text-[32px]">  
                تسجيل الخروج
              </h2>
            </div>
          </div>

          {/* Divider */}
          <Divider />

          {/* Warning Banner */}
          <div className="rounded-[64px] py-4 px-4 md:px-8 mt-4 md:mt-10 text-center w-full mx-auto">
            <p className="font-semibold text-[#707070] text-base md:text-2xl lg:text-[32px]">
                هل أنت متأكد من رغبتك في<br /> تسجيل الخروج؟  
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row w-full mx-auto gap-[18px] justify-center items-center my-4 md:my-12">
            
            <button
              onClick={onClose}
              className="cursor-pointer w-full lg:w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 border border-orangedeep rounded-[60px] transition-colors disabled:cursor-not-allowed"
            >
              <img
                className="w-4 md:w-6"
                alt="Cancel"
                src="https://c.animaapp.com/mf2jwhdmLJjjfJ/img/layer-1-1.svg"
              />
              <div className="font-semibold text-base md:text-2xl">
                الغاء
              </div>
            </button>
            <button

              onClick={handleConfirm}

              className="cursor-pointer w-full lg:w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors disabled:cursor-not-allowed"
            >
              <ConfirmCheck className="w-4 md:w-6" />
              <div className="font-semibold text-base md:text-2xl">
                تأكيد 
              </div>
            </button>
          </div>
          </div>
      </div>
    </div>
  )
}

export default LogoutModal
