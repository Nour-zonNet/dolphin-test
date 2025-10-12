import React from 'react';
import Header from '@/components/layout/Header';
import Divider from '@/components/ui/Divider';
import { BalanceCard, BalanceActionsButtons } from '../components';
import { TransactionsFilter } from '../components';
import { TransactionsList } from '../components/transactions';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useTransactions } from '../hooks/useTransactions';
import { useTransactionFilter } from '../hooks/useTransactionFilter';

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
  const { transactions, loading, error, refreshTransactions } = useTransactions();
  const { 
    filteredTransactions, 
    handleDateFilter, 
    clearFilters, 
    hasActiveFilters 
  } = useTransactionFilter(transactions);

  const handleRefresh = () => {
    refreshTransactions();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        title="تفاصيل الرصيد" 
        balance={0} 
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
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />
      
      {/* Transactions List */}
      <TransactionsList 
        transactions={transactions}
        filteredTransactions={filteredTransactions}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default BalanceDetails;