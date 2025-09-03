import React, { useState } from 'react'
import { Gift, Plus } from '@/utils/icons'
import { AddBalanceModal } from '@/components/profile/modal';
import { AddCouponModal } from '@/components/profile/modal';

const BalanceActionsButtons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddBalanceModalOpen, setIsAddBalanceModalOpen] = useState(false);
  return (
    <div>
        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row w-[90%] lg:w-[50%] mx-auto gap-[18px] justify-center items-center my-14">
            <button
            onClick={() => setIsAddBalanceModalOpen(true)} 
            className="flex w-full h-[60px] items-center justify-center gap-2 px-4 py-2 bg-orangedeep cursor-pointer rounded-[32px] hover:bg-foundationorangenormal-hover"
            >
            <Plus className="w-4 md:w-6" />
            <div className="font-semibold text-lg md:text-2xl">
                إضافة رصيد
            </div>
            </button>
            <button
            onClick={() => setIsModalOpen(true)} 
            className="flex w-full h-[60px] items-center justify-center gap-2 px-4 py-2 border border-orangedeep hover:bg-btnClicked transition cursor-pointer rounded-[32px]"
            >
            <Gift className="w-6 md:w-8" />
            <div className="font-semibold text-lg md:text-2xl">
                كوبون لإضافة رصيد 
            </div>
            </button>
        </div>
        
        <AddCouponModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <AddBalanceModal
          isOpen={isAddBalanceModalOpen}
          onClose={() => setIsAddBalanceModalOpen(false)}
        />
    </div>
  )
}

export default BalanceActionsButtons
