import React from 'react'
import { Gift } from '@/utils/icons'
import { Plus } from '@/utils/icons'

const BalanceActionsButtons = () => {
  return (
    <div>
        {/* Action Buttons */}
        <div className="flex flex-col lg:flex-row w-[90%] lg:w-[50%] mx-auto gap-[18px] justify-center items-center my-14">
            
            <button
            className="flex w-full h-[60px] items-center justify-center gap-2 px-4 py-2 bg-orangedeep cursor-pointer rounded-[32px] hover:bg-foundationorangenormal-hover"
            >
            <Plus className="w-4 md:w-6" />
            <div className="font-semibold text-lg md:text-2xl">
                إضافة رصيد
            </div>
            </button>
            <button
            className="flex w-full h-[60px] items-center justify-center gap-2 px-4 py-2 border border-orangedeep hover:bg-btnClicked transition cursor-pointer rounded-[32px]"
            >
            <Gift className="w-6 md:w-8" />
            <div className="font-semibold text-lg md:text-2xl">
                تأكيد 
            </div>
            </button>
        </div>
    </div>
  )
}

export default BalanceActionsButtons
