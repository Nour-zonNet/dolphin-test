import React, { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import { BalanceCard } from '../components'
import Divider from "@/components/ui/Divider"
import TransactionsFilter from '../components/TransactionsFilter'
import TransactionsList from '../components/TransactionsList'
import { useProfile } from "@/features/profile/hooks/useProfile"
import { BalanceActionsButtons } from '../components'

const BalanceDetails = () => {
  const { user } = useProfile();
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });

  // Sample transaction data for testing
  const sampleTransactions = [
    {
      id: "0018-2025 TXN",
      title: "باقة تأسيس اللغة الإنجليزية (المستوي الأول)",
      type: "subscription",
      status: "completed",
      amount: 200,
      date: "16 ديسمبر 2025",
      paymentMethod: "بطاقة ائتمان"
    },
    {
      id: "0019-2025 TXN",
      title: "شحن الرصيد",
      type: "balance_topup",
      status: "pending",
      amount: 200,
      date: "16 ديسمبر 2025",
      paymentMethod: "بطاقة ائتمان"
    },
    {
      id: "0020-2025 TXN",
      title: "شحن الرصيد",
      type: "renewal",
      status: "canceled",
      amount: 200,
      date: "16 ديسمبر 2025",
      paymentMethod: "بطاقة ائتمان"
    },
    {
      id: "0021-2025 TXN",
      title: "باقة تأسيس اللغة الإنجليزية (المستوي الأول)",
      type: "refund",
      status: "completed",
      amount: 200,
      date: "16 ديسمبر 2025",
      paymentMethod: "بطاقة ائتمان"
    }
  ];

  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
    if (!dateFilter.startDate && !dateFilter.endDate) {
      return sampleTransactions;
    }

    return sampleTransactions.filter(transaction => {
      // Convert transaction date to comparable format
      // For demo purposes, we'll simulate filtering
      // In real implementation, you would compare actual dates
      const transactionDate = new Date('2025-12-16'); // Sample date
      
      if (dateFilter.startDate) {
        const startDate = new Date(dateFilter.startDate);
        if (transactionDate < startDate) return false;
      }
      
      if (dateFilter.endDate) {
        const endDate = new Date(dateFilter.endDate);
        if (transactionDate > endDate) return false;
      }
      
      return true;
    });
  }, [dateFilter]);

  const handleDateFilter = (startDate, endDate) => {
    setDateFilter({ startDate, endDate });
    console.log('تصفية التواريخ:', { startDate, endDate });
  };

  return (
    <div>
        <Header  title="تفاصيل الرصيد" balance={0} showBalanceSection={false} onBack={"/profile"} />
        <BalanceCard user={user}/>
        <BalanceActionsButtons />
        <Divider />
        <TransactionsFilter onDateFilter={handleDateFilter} />
        <TransactionsList 
          transactions={sampleTransactions} 
          filteredTransactions={filteredTransactions} 
        />
    </div>
  )
}

export default BalanceDetails
