import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Divider from '@/components/ui/Divider';
import { BalanceCard, BalanceActionsButtons } from '../components';
import { TransactionsFilter } from '../components';
import { TransactionsList } from '../components/transactions';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useTransactions } from '../hooks/useTransactions';
import { useTransactionFilter } from '../hooks/useTransactionFilter';
import { useSelector } from 'react-redux';

/**
 * Enhanced Balance Details Page
 * 
 * Features:
 * - Clean separation of concerns
 * - Custom hooks for data management
 * - Proper error handling and loading states
 * - Reusable components
 * - Modern React patterns
 */
const BalanceDetails = () => {
  const { user } = useProfile();
  const { currentBalance } = useSelector((state) => state.balance);
  const { transactions, loading, error, refreshTransactions } = useTransactions();
  const { 
    filteredTransactions, 
    handleDateFilter, 
    handleStatusFilter,
    handleSearch,
  } = useTransactionFilter(transactions);
  const [isFiltering, setIsFiltering] = useState(false);

  const handleRefresh = () => {
    refreshTransactions();
  };

  const handleFiltering = (filtering) => {
    setIsFiltering(filtering);
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <Header 
        title="تفاصيل الرصيد" 
        balance={currentBalance} 
        showBalanceSection={false} 
        onBack="/profile" 
      />
      
      {/* Balance Card */}
      <BalanceCard user={user} />
      
      {/* Action Buttons */}
      <BalanceActionsButtons />
      
      {/* Divider */}
      <Divider />
      
      {/* Transactions Filter */}
      <TransactionsFilter 
        onDateFilter={handleDateFilter}
        onStatusFilter={handleStatusFilter}
        onSearch={handleSearch}
        onFiltering={handleFiltering}
      />
      
      {/* Transactions List */}
      <TransactionsList 
        transactions={transactions}
        filteredTransactions={filteredTransactions}
        loading={loading || isFiltering}
        error={error}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default BalanceDetails;