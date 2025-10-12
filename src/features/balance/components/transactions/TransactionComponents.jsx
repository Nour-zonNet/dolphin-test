import React from 'react';
import { getStatusColor, formatCurrency } from '../../utils/transactionUtils';
import { STATUS_LABELS } from '../../utils/sampleData';

/**
 * Transaction status badge component
 */
export const TransactionStatusBadge = ({ status, className = '' }) => {
  const statusColor = getStatusColor(status);
  const statusLabel = STATUS_LABELS[status] || status;

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} ${className}`}
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
    <div className={`text-sm text-gray-500 ${className}`}>
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
