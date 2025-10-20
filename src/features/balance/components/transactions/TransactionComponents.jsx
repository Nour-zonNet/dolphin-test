import React from 'react';
import { getStatusColor, formatCurrency } from '../../utils/transactionUtils';
import { getArabicStatusLabel } from '../../utils/transactionTransform';

/**
 * Transaction status badge component
 */
export const TransactionStatusBadge = ({ status, className = '' }) => {
  const statusColor = getStatusColor(status);
  const statusLabel = getArabicStatusLabel(status);

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-sm md:text-base ${statusColor} ${className}`}
    >
      {statusLabel}
    </span>
  );
};

/**
 * Transaction amount display component
 */
export const TransactionAmount = ({ amount, type, className = '' }) => {
  const isNegative = type === 'refund';
  const formattedAmount = formatCurrency(Math.abs(amount));
  
  return (
    <div className={`text-right ${className}`}>
      <span className={`font-semibold ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
        {isNegative ? '-' : '+'}{formattedAmount}
      </span>
    </div>
  );
};

/**
 * Transaction date display component
 */
export const TransactionDate = ({ date, className = '' }) => {
  return (
    <div className={`text-sm md:text-base lg:text-lg text-[#484848] font-semibold ${className}`}>
      {date}
    </div>
  );
};

/**
 * Transaction payment method display component
 */
export const TransactionPaymentMethod = ({ paymentMethod, className = '' }) => {
  return (
    <div className={`text-xs text-gray-400 ${className}`}>
      {paymentMethod}
    </div>
  );
};
