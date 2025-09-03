import React, { useState } from 'react'
import { AddSiblingsModal } from '@/components/profile/modal';

const AddSiblingButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siblings, setSiblings] = useState([]);
  return (
     <div className="flex py-2">
        <button onClick={() => setIsModalOpen(true)} className="rounded-[32px] flex items-center gap-2 py-2 md:py-3 px-4 bg-[#E89B32] hover:bg-btnClicked transition cursor-pointer">
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
      />
    </div>
  )
}

export default AddSiblingButton
