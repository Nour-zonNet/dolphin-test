import React from 'react'
import { ProfileButtons, ProfileCard } from '@/components'
import SubscriptionCard from './SubscriptionCard'

const SubscriptionSection = () => {
  return (
     <ProfileCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-navyteal text-base md:text-xl">
          الباقات والاشتراكات
        </h3>
        <ProfileButtons variant="primary" size="sm" className="cursor-pointer bg-orangedeep hover:bg-btnClicked transition w-[170px] md:w-[200px]">
          <img
            className="w-4 md:w-6"
            alt="Details"
            src="https://c.animaapp.com/mf29nm7vjLRxgE/img/bold.svg"
          />
          <span className="text-navyteal font-semibold text-base">تفاصيل الباقات</span>
        </ProfileButtons>
      </div>

      <div className="mb-6">
        <SubscriptionCard
          title="باقة تأسيس اللغة الإنجليزية (المستوي الأول)"
          icon="https://c.animaapp.com/mf29nm7vjLRxgE/img/adobe-express---file--1--1.png"
          subscriptionDate="29 اغسطس 2025"
          expiryDate="18 سبتمبر 2025"
          status="فعالة"
        />
      </div>

      <div className="text-center">
        <button className="font-bold text-[#BA7C28] text-base md:text-xl underline cursor-pointer">
          عرض كل اشتراكاتي
        </button>
      </div>
    </ProfileCard>
  )
}

export default SubscriptionSection
