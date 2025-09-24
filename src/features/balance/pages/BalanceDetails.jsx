import React, { useState } from 'react'
import Header from '@/components/layout/Header'
import { BalanceCard } from '../components'
import Divider from "@/components/ui/Divider"
import TransactionsFilter from '../components/TransactionsFilter'
import NoTransactions from '../components/NoTransactions'
import { useProfile } from "@/features/profile/hooks/useProfile"

const BalanceDetails = () => {
  const { user } = useProfile();
  const [, setDateFilter] = useState({ startDate: "", endDate: "" });

  const handleDateFilter = (startDate, endDate) => {
    setDateFilter({ startDate, endDate });
    // هنا يمكن إضافة منطق جلب المعاملات المفلترة
    console.log('تصفية التواريخ:', { startDate, endDate });
  };

  return (
    <div>
        <Header  title="تفاصيل الرصيد" balance={0} showBalanceSection={false} onBack={"/profile"} />
        <BalanceCard user={user}/>
        {/* <BalanceActionsButtons /> */}
        <Divider />
        <TransactionsFilter onDateFilter={handleDateFilter} />
        <NoTransactions />
    </div>
  )
}

export default BalanceDetails
