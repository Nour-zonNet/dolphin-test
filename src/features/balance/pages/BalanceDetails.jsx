import React from 'react'
import Header from '@/components/layout/Header'
import { BalanceActionsButtons, BalanceCard } from '../components'
import Divider from "@/components/ui/Divider"
import TransactionsFilter from '../components/TransactionsFilter'
import NoTransactions from '../components/NoTransactions'
import { HomeSupportBtn } from '@/components'
const BalanceDetails = () => {
  return (
    <div>
        <Header title="تفاصيل الرصيد" balance={0} showBalanceSection={false}/>
        <BalanceCard />
        <BalanceActionsButtons />
        <Divider />
        <TransactionsFilter />
        <NoTransactions />
        <HomeSupportBtn />
    </div>
  )
}

export default BalanceDetails
