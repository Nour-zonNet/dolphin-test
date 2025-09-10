import React from 'react'
import { ProfileButtons, ProfileCard } from '@/components'
import SubscriptionCard from './SubscriptionCard'
import { Link, useNavigate } from 'react-router-dom'
import { useSubscriptions } from '../../subscription/hooks/useSubscriptions'

const SubscriptionSection = () => {
  const { items, loading } = useSubscriptions();
  const navigate = useNavigate();

  return (
     <ProfileCard className="p-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:items-center justify-between mb-6">
        <h3 className="font-bold text-navyteal text-base md:text-xl">
          الباقات والاشتراكات
        </h3>
        <ProfileButtons onClick={() => navigate("/main-packages")} variant="primary" size="" className="cursor-pointer bg-orangedeep hover:bg-btnClicked transition w-[200px] mx-auto md:mx-0 py-2">
          <img
            className="w-4 md:w-5 lg:w-6"
            alt="Details"
            src="https://c.animaapp.com/mf29nm7vjLRxgE/img/bold.svg"
          />
          <span className="text-navyteal font-semibold text-sm md:text-base">تفاصيل الباقات</span>
        </ProfileButtons>
      </div>
      <div className="mb-6">
        {loading ? (
        <p className="text-center text-gray-500">...جاري التحميل</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">لا يوجد اشتراكات</p>
          ) : (
            items.slice(0, 1).map((sub) => (
              <SubscriptionCard
                key={sub.id}
                title={sub.package_name}
                icon="https://c.animaapp.com/mf29nm7vjLRxgE/img/adobe-express---file--1--1.png" 
                subscriptionDate={sub.start_date}
                expiryDate={sub.end_date}
                status={sub.status}
                daysRemaining={sub.days_remaining}
              />
            ))
          )}
      </div>

      <div className="text-center">
        <Link to="/manage-subscription" className="font-bold text-[#BA7C28] text-base md:text-lg lg:text-xl underline cursor-pointer">
          عرض كل اشتراكاتي
        </Link>
      </div>
    </ProfileCard>
  )
}

export default SubscriptionSection
