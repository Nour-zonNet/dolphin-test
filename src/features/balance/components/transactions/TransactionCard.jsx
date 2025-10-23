import React from 'react';
import { CheckCircle, ClockBalance, XCircle, Copy, CalendarGray, WalletGray } from '@/utils/icons';
import FormatWithCurrency from '@/utils/FormatWithCurrency';
import { TransactionStatusBadge, TransactionAmount, TransactionDate, TransactionPaymentMethod } from './TransactionComponents';
import { TRANSACTION_TYPE_LABELS } from '../../utils/sampleData';
import { useModal } from '@/components/feedback/modal/useModal';
import { Book } from '@/utils/icons';

/**
 * Enhanced Transaction Card Component
 * Uses modern React patterns and improved structure
 */
const TransactionCard = ({ transaction, className = '' }) => {
  const { openTransactionDetailsModal } = useModal();

  const handleCardClick = () => {
    openTransactionDetailsModal(transaction);
  };
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
      const idToCopy = transaction.reference_id || transaction.id;
      await navigator.clipboard.writeText(idToCopy.toString());
      // TODO: Add toast notification for successful copy
    } catch (_error) {
      // Failed to copy transaction ID
      // TODO: Add error notification
    }
  };

  const typeLabel = TRANSACTION_TYPE_LABELS[transaction.type] || transaction.type;

  return (
    <div 
      className={`bg-white rounded-[24px] border border-[#B3B3B3] md:p-4 mb-6 cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
          {/* Status Icon */}
          {/* Transaction Details */}
          <div className="flex items-center gap-4">
            {/* if transaction.type is 'balance_topup' */}
            {transaction.type === 'balance_topup' && (
              <div className="w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 bg-[#3A880922] rounded-full flex items-center justify-center">
                <WalletGray className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7" />
              </div>
            )}
            {/* if transaction.type is 'subscription'  */}
            {transaction.type === 'subscription' && (
              <div className="w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 bg-[#E89B3222] rounded-full flex items-center justify-center">
                <Book className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7" fill="#D18C2D"/>
              </div>
            )}
            <div>
              <div className="flex items-start justify-between">
                <h3 className="text-sm md:text-base lg:text-lg font-bold text-navyteal">
                  {transaction.title}
                </h3>
                
                {/* Amount in mobile view */}
                {/* <div className="md:hidden items-center gap-4 flex">
                  {formatAmount(transaction.amount, transaction.type)} 
                </div> */}
              </div>
          {/*             
              <div className="flex flex-wrap items-center gap-2 text-sm lg:text-lg text-gray-600 mt-4">
                <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                  {typeLabel}
                </span>
                <span className="text-[#D9D9D9]">|</span>
                <span className="text-[#686868]">رقم العملية: {transaction.reference_id || transaction.id}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    copyTransactionId();
                  }}
                  className="flex items-center gap-1 hover:text-btnClicked transition-colors ms-4 text-orangedeep"
                  aria-label="نسخ رقم العملية"
                >
                  <Copy className="w-3 h-3" />
                  <span>نسخ</span>
                </button>
              </div> */}

              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <CalendarGray className="w-3 h-3" />
                  <TransactionDate date={transaction.date} />
                </div>

                {/* <div className="flex items-center gap-2">
                  <WalletGray className="w-3 h-3" />
                  <TransactionPaymentMethod paymentMethod={transaction.paymentMethod} />
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:gap-6 ">
          {/* Amount in tablet and desktop */}
          <div>
            {formatAmount(transaction.amount, transaction.type)} 
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 md:w-6 md:h-6 xl:w-8 xl:h-8 rounded-full flex items-center justify-center">
              {getStatusIcon(transaction.status)}
            </div>
            <TransactionStatusBadge 
              status={transaction.status} 
              className=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;