import React, { useState } from 'react'
import Divider from '../../ui/Divider';
import { ConfirmCheck } from '../../../utils/icons';

const LogoutModal = ({ isOpen, onClose, onConfirm  }) => {
    const [confirmText, setConfirmText] = useState("");
    const isDeleteEnabled = confirmText.trim() === "حذف";
  
    const handleDelete = () => {
      if (isDeleteEnabled) {
        onConfirm();
      }
    };

     const [gradeLevel, setGradeLevel] = useState("");
    
    if (!isOpen) return null;
  return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
        <div className="bg-white rounded-[32px] border-[0.5px] border-solid border-[#8c8c8c] w-[95%] md:w-[60%] my-auto">
         <div className="w-[90%] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between py-8">
            <button
            onClick={onClose}
            className="w-[50px] h-[50px] flex items-center justify-center rounded-full cursor-pointer"
          >
            <img
              className="w-8 md:w-auto"
              alt="Close"
              src="https://c.animaapp.com/mf2i8zbdeyVMjf/img/frame.svg"
            />
          </button>
            <div className="flex-1 text-center">
             <h2 className="font-semibold text-[#B3261E]  text-xl md:text-[32px]">
                   تسجيل الخروج
              </h2>
            </div>
          </div>

          {/* Divider */}
          <Divider />

          {/* Warning Banner */}
          <div className="rounded-[64px] py-4 px-8 mt-10 text-center w-full mx-auto">
            <p className="font-semibold text-[#707070] text-lg md:text-[32px]">
                هل أنت متأكد من رغبتك في<br /> تسجيل الخروج؟  
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row w-full mx-auto gap-[18px] justify-center items-center my-12">
            
            <button
              onClick={onClose}
              className="flex w-full h-[60px] items-center justify-center gap-2 px-4 py-2 border border-orangedeep cursor-pointer rounded-[32px]"
            >
              <img
                className="w-6 md:w-8"
                alt="Cancel"
                src="https://c.animaapp.com/mf2jwhdmLJjjfJ/img/layer-1-1.svg"
              />
              <div className="font-semibold text-lg md:text-2xl">
                الغاء
              </div>
            </button>
            <button
              className="flex w-full h-[60px] items-center justify-center gap-2 px-4 py-2 bg-orangedeep hover:bg-btnClicked transition cursor-pointer rounded-[32px]"
            >
             <ConfirmCheck className="w-6 md:w-8" />
              <div className="font-semibold text-lg md:text-2xl">
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
