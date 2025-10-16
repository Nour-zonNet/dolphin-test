import React from 'react';
import TransactionCard from './TransactionCard';
import NoTransactions from '../NoTransactions';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Enhanced Transactions List Component
 * Handles loading states, empty states, and error states
 */
const TransactionsList = ({ 
  transactions = [], 
  filteredTransactions = [], 
  loading = false, 
  error = '',
  className = '' 
}) => {
  // Use filtered transactions if available, otherwise use all transactions
  const displayTransactions = filteredTransactions.length > 0 ? filteredTransactions : transactions;

  // Loading state
  if (loading) {
    return (
      <div className={`w-[90%] mx-auto mt-8 ${className}`}>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
          <span className="mr-3 text-gray-600">جاري تحميل المعاملات...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`w-[90%] mx-auto mt-8 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-500 hover:text-red-700 underline"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!displayTransactions || displayTransactions.length > 0) {
    return (
      <div className={`w-[90%] mx-auto mt-8 ${className}`}>
        <NoTransactions />
      </div>
      
    );
  }

  // Success state - Display transaction cards
  return (
    <div className={`w-[90%] mx-auto mt-8 ${className}`}>
      <div className="space-y-4">
        {displayTransactions.map((transaction, index) => (
          <TransactionCard 
            key={transaction.id || `transaction-${index}`} 
            transaction={transaction}
            data-testid={`transaction-card-${index}`}
          />
        ))}
      </div>
      
      {/* Transaction count info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        عرض {displayTransactions.length} من {transactions.length} معاملة
      </div>
    </div>
  );
};

export default TransactionsList;
