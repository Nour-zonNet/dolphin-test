import React from 'react'
import Header from '@/components/layout/Header'
import { BalanceActionsButtons, BalanceCard } from '../components'
import Divider from "@/components/ui/Divider"
import TransactionsFilter from '../components/TransactionsFilter'
import NoTransactions from '../components/NoTransactions'
import { HomeSupportBtn } from '@/components'
import { useProfile } from "@/features/profile/hooks/useProfile"

const BalanceDetails = () => {
  const { user } = useProfile();
  return (
    <div>
        <Header title="تفاصيل الرصيد" balance={0} showBalanceSection={false} onBack={"/profile"} />
        <BalanceCard user={user}/>
        <BalanceActionsButtons />
        <Divider />
        <TransactionsFilter />
        <NoTransactions />
        <HomeSupportBtn />
    </div>
  )
}

export default BalanceDetails
