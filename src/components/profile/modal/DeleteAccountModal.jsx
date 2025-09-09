import React, { useState } from 'react'
import Divider from '../../ui/Divider';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState("");
  const isDeleteEnabled = confirmText.trim() === "حذف";

  const handleDelete = () => {
    if (isDeleteEnabled) {
      onConfirm();
    }
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
                حذف الحساب
              </h2>
            </div>
          </div>

          {/* Divider */}
          <Divider />

          {/* Warning Section */}
          <div className="bg-[#E6E9EC] w-[90%] mx-auto rounded-3xl p-2 md:p-8 my-2 md:my-8">
            <h2 className="font-normal text-[#B3261E] text-base md:text-xl lg:text-[32px] md:text-center mb-8">
              تحذير مهم: سيؤدي حذف حسابك إلي :
            </h2>

            <ul className="flex flex-col gap-4 mb-4 md:mb-8 list-[square] marker:text-sm px-6 md:px-8">
              <li className="font-normal text-navyteal text-sm md:text-lg lg:text-2xl">
                فقدان جميع الاشتراكات والباقات
              </li>
              <li className="font-normal text-navyteal text-sm md:text-lg lg:text-2xl">
                فقدان رصيد المحفظة
              </li>
              <li className="font-normal text-navyteal text-sm md:text-lg lg:text-2xl">
                حذف جميع البيانات بشكل نهائي
              </li>
              <li className="font-normal text-navyteal text-sm md:text-lg lg:text-2xl">
                عدم إمكانية استرداد الحساب مرة أخري
              </li>
            </ul>

            {/* Warning Banner */}
            <div className="bg-[#f8f8f8] rounded-[64px] border border-solid border-[#8c8c8c] py-2 md:py-4 px-2 md:px-8 text-center w-full md:w-[90%] mx-auto">
              <p className="font-semibold text-[#B3261E] text-sm md:text-lg lg:text-2xl">
                هذا الإجراء لا يمكن التراجع عنه
              </p>
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="text-center mb-6">
            <p className="font-semibold text-black text-sm md:text-lg lg:text-2xl">
              لتأكيد الحذف، اكتب كلمة "حذف" في الحقل أدناه
            </p>
          </div>

          {/* Input Field */}
          <div className="mb-8 w-[90%] mx-auto">
            <div className="relative">
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="اكتب: حذف"
                className="w-full h-10 md:h-14 lg:h-18 rounded-[100px] border-[0.5px] border-solid border-[#7A8085] focus:outline-navyteal px-8 text-sm md:text-lg lg:text-2xl text-center placeholder-[#5d6062]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row w-full mx-auto gap-[18px] justify-center items-center mb-10">
            
            <button
              onClick={onClose}
              className="cursor-pointer w-full md:w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 bg-[#e89b32] hover:bg-[#d18c2d] rounded-[60px] transition-colors disabled:cursor-not-allowed"
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
{/* 
            <button
              onClick={handleDelete}
              // disabled={!isDeleteEnabled}
              className={`cursor-pointer w-full md:w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 rounded-[32px] border border-solid border-[#b3261e] ${
                  isDeleteEnabled 
                  ? 'hover:bg-red-50 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
                }`}
            > */}

            <button
              onClick={handleDelete}
              className={`cursor-pointer w-full md:w-[60%] mx-auto h-10 md:h-[65px] flex items-center justify-center gap-2 px-4 py-2 rounded-[32px] border border-solid border-[#b3261e]`}
            >
                <img
                className="w-4"
                alt="Delete"
                src="https://c.animaapp.com/mf2jwhdmLJjjfJ/img/layer-1.svg"
                />
              <div className="font-semibold text-[#B3261E] text-base md:text-2xl">
                تعطيل الحساب 
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccountModal
