import React from 'react'
import { ProfileButtons, ProfileCard } from '@/components'
import { useNavigate } from 'react-router-dom'

const WalletBalance = () => {
  const navigate = useNavigate();
  
  return (
     <ProfileCard className="md:h-[178px] flex flex-col items-center justify-center gap-4 p-6">
      <h3 className="font-semibold text-lg text-[#BA7C28] md:text-3xl lg:text-5xl text-center">
        الرصيد: 0 ريال
      </h3>
      <ProfileButtons variant="outline" size="sm" className="w-[210px] mt-2 cursor-pointer" onClick={() => navigate("/balance-details")}>
        <img
          className="w-4 md:w-5 lg:w-6"
          alt="Details"
          src="https://c.animaapp.com/mf29nm7vjLRxgE/img/layer-1-1.svg"
        />
        <span className="text-navyteal font-semibold text-sm md:text-base">تفاصيل الرصيد</span>
      </ProfileButtons>
    </ProfileCard>
  )
}

export default WalletBalance
