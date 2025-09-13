import React, { useState } from 'react';
import { AddSiblingsModal } from '@/components/profile/modal';
import { useDispatch, useSelector } from 'react-redux';
import { addSibling } from '../store/profileSlice';
import { useModal } from '@/components/feedback/modal/useModal';

const AddSiblingButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading] = useState(false); 
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);
  const brothers = useSelector((state) => state.profile.brothers || []);
  const { openStatusModal } = useModal();
  
  // تحديد ما إذا كان المستخدم الحالي هو الطالب الأساسي
  const isPrimaryStudent = user?.isPrimary === true || user?.canAddSiblings === true || user?.accountType === "primary";
  
  console.log("AddSiblingButton - Primary check:", {
    isPrimary: user?.isPrimary,
    canAddSiblings: user?.canAddSiblings,
    accountType: user?.accountType,
    result: isPrimaryStudent
  });

  const handleAddSibling = async (siblingData) => {
    // التحقق من أن المستخدم الحالي هو الطالب الأساسي
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
      await dispatch(addSibling(siblingData)).unwrap();
      openStatusModal("SUCCESS", {
        title: "تمت الإضافة بنجاح",
        message: "تمت إضافة الأخ/الأخت بنجاح إلى الحساب.",
      });
      setIsModalOpen(false); 
    } catch {
      openStatusModal("ERROR", {
        title: "فشل في إضافة الأخ",
        message: "حدث خطأ أثناء محاولة الإضافة. حاول مرة أخرى.",
      });
    }
  };

  // لا تظهر الزر إذا لم يكن المستخدم هو الطالب الأساسي
  if (!isPrimaryStudent) {
    return null; // إخفاء الزر تماماً
  }

  return (
    <div className="flex items-center justify-center py-2">
      <button
        onClick={() => setIsModalOpen(true)}
        className="focus:outline-0 rounded-[32px] flex items-center gap-2 py-2 md:py-3 px-6 bg-[#E89B32] hover:bg-btnClicked transition cursor-pointer"
      >
        <img
          className="w-4 md:w-5 lg:w-6"
          alt="Add"
          src="https://c.animaapp.com/mf29nm7vjLRxgE/img/group.png"
        />
        <span className="text-navyteal font-semibold text-sm md:text-xl">
          اضافة أخ او أخت
        </span>
      </button>

      <AddSiblingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSibling}
        loading={loading} 
      />
    </div>
  );
};

export default AddSiblingButton;
