import React from 'react';
import { CheckCircle, ClockBalance, XCircle, Copy, CalendarGray, WalletGray } from '@/utils/icons';
import FormatWithCurrency from '@/utils/FormatWithCurrency';
import { TransactionStatusBadge, TransactionAmount, TransactionDate, TransactionPaymentMethod } from './TransactionComponents';
import { TRANSACTION_TYPE_LABELS } from '../../utils/sampleData';

/**
 * Enhanced Transaction Card Component
 * Uses modern React patterns and improved structure
 */
const TransactionCard = ({ transaction, className = '' }) => {
  const getStatusIcon = (status) => {
    const iconProps = "w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12";
    
    switch (status) {
      case 'completed':
        return <CheckCircle className={iconProps} />;
      case 'pending':
        return <ClockBalance className={iconProps} />;
      case 'canceled':
        return <XCircle className={iconProps} />;
      default:
        return <CheckCircle className={iconProps} />;
    }
  };

  const getTypeColor = (type) => {
    const typeColors = {
      'subscription': 'text-[#1B872C]',
      'balance_topup': 'text-orangedeep',
      'renewal': 'text-[#E21B1B]',
      'refund': 'text-[#2E7D32]',
    };
    
    return typeColors[type] || 'text-green-600';
  };

  const formatAmount = (amount, type) => {
    const isNegative = type === 'refund';
    const sign = isNegative ? '-' : '+';
    const color = isNegative ? 'text-red-600' : 'text-green-600';
    
    return (
      <div className={`text-lg lg:text-2xl font-bold ${color} flex items-center gap-1`}>
        <span>{sign}</span>
        <FormatWithCurrency 
          amount={amount} 
          showSymbol={true}
          className=""
          symbolClass="w-4 h-4 lg:w-6 lg:h-6"
          symbolFill={isNegative ? "#E21B1B" : "#2E7D32"}
        />
      </div>
    );
  };

  const copyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(transaction.id);
      // TODO: Add toast notification for successful copy
    } catch (error) {
      console.error('Failed to copy transaction ID:', error);
      // TODO: Add error notification
    }
  };

  const typeLabel = TRANSACTION_TYPE_LABELS[transaction.type] || transaction.type;

  return (
    <div className={`bg-white rounded-[24px] border border-[#B3B3B3] md:p-4 mb-6 ${className}`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
          {/* Status Icon */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              {getStatusIcon(transaction.status)}
            </div>
            <TransactionStatusBadge 
              status={transaction.status} 
              className="mt-2"
            />
          </div>

          {/* Transaction Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="text-sm md:text-base lg:text-lg font-bold text-navyteal mb-2">
                {transaction.title}
              </h3>
              
              {/* Amount in mobile view */}
              <div className="md:hidden items-center gap-4 flex">
                {formatAmount(transaction.amount, transaction.type)} 
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm lg:text-lg text-gray-600 mt-4">
              <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                {typeLabel}
              </span>
              <span className="text-[#D9D9D9]">|</span>
              <span className="text-[#686868]">رقم العملية: {transaction.id}</span>
              <button 
                onClick={copyTransactionId}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors ms-4"
                aria-label="نسخ رقم العملية"
              >
                <Copy className="w-3 h-3" />
                <span className="text-[#404040]">نسخ</span>
              </button>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <CalendarGray className="w-3 h-3" />
                <TransactionDate date={transaction.date} />
              </div>

              <div className="flex items-center gap-2">
                <WalletGray className="w-3 h-3" />
                <TransactionPaymentMethod paymentMethod={transaction.paymentMethod} />
              </div>
            </div>
          </div>
        </div>

        {/* Amount in tablet and desktop */}
        <div className="md:flex items-center gap-4 hidden">
          {formatAmount(transaction.amount, transaction.type)} 
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
