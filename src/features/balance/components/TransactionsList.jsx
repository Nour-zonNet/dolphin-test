import React from 'react';
import TransactionCard from './TransactionCard';
import NoTransactions from './NoTransactions';

const TransactionsList = ({ transactions, filteredTransactions }) => {
  // Use filtered transactions if available, otherwise use all transactions
  const displayTransactions = filteredTransactions || transactions;

  // If no transactions to display, show NoTransactions component
  if (!displayTransactions || displayTransactions.length === 0) {
    return <NoTransactions />;
  }

  // Display transaction cards
  return (
    <div className="w-[90%] mx-auto mt-8">
      {displayTransactions.map((transaction, index) => (
        <TransactionCard key={transaction.id || index} transaction={transaction} />
      ))}
    </div>
  );
};

export default TransactionsList;
