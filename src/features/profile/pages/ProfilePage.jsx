import React from 'react'
import { Divider, ProfileHeader } from '@/components'
import UserProfile from '../components/UserProfile'
import AddSiblingButton from '../components/AddSiblingButton'
import WalletBalance from '../components/WalletBalance'
import AccountInfo from '../components/AccountInfo'
import SubscriptionSection from '../components/SubscriptionSection'
import { ProfileActions } from '../components'
import { MobileNav } from '@/components'

const ProfilePage = () => {
  return (
     <div className="min-h-screen bg-white flex flex-col">
      <ProfileHeader title="الملف الشخصي" />
      
      <main className="flex-1 px-4 sm:px-8 lg:px-20 py-8 space-y-16 mx-auto w-full">
       <div className="flex items-center justify-between">
         <UserProfile />
         <AddSiblingButton />
       </div>
        
        <div className="space-y-16">
          <WalletBalance />
          <Divider />
          <AccountInfo />
          <Divider />
          <SubscriptionSection />
        </div>
        
        <ProfileActions />
      </main>
      <MobileNav />
    </div>
  )
}

export default ProfilePage
