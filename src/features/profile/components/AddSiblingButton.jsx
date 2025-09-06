import React, { useState } from 'react'
import { AddSiblingsModal } from '@/components/profile/modal';
import { useDispatch } from 'react-redux';
import { addSibling } from '../store/profileSlice';

const AddSiblingButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

const [submitting, setSubmitting] = useState(false);

const handleAddSibling = async (siblingData) => {
  try {
    setSubmitting(true);
    await dispatch(addSibling(siblingData)).unwrap();
    setIsModalOpen(false);
  } catch (err) {
    console.error("Error adding sibling:", err);
    alert("فشل إضافة الأخ/الأخت. حاول مرة أخرى");
  } finally {
    setSubmitting(false);
  }
};

  return (
     <div className="flex items-center justify-center py-2">
        <button onClick={() => setIsModalOpen(true)} className="focus:outline-0 rounded-[32px] flex items-center gap-2 py-2 md:py-3 px-6 bg-[#E89B32] hover:bg-btnClicked transition cursor-pointer">
            <img
            className="w-4 md:w-6"
            alt="Add"
            src="https://c.animaapp.com/mf29nm7vjLRxgE/img/group.png"
            />
            <span className="text-navyteal font-semibold text-sm md:text-xl">اضافة أخ او أخت</span>
        </button>
        <AddSiblingsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddSibling}
      />
    </div>
  )
}

export default AddSiblingButton
