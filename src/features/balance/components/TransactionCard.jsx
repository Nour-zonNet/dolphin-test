import React from 'react';
import { CheckCircle, ClockBalance, XCircle, Copy, Calendar, CreditCard } from '@/utils/icons';

const TransactionCard = ({ transaction }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-white" />;
      case 'pending':
        return <ClockBalance className="w-8 h-8 text-white" />;
      case 'canceled':
        return <XCircle className="w-8 h-8 text-white" />;
      default:
        return <CheckCircle className="w-8 h-8 text-white" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '';
      case 'pending':
        return '';
      case 'canceled':
        return '';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'معلق';
      case 'canceled':
        return 'ملغي';
      default:
        return 'مكتمل';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'subscription':
        return 'text-green-600';
      case 'balance_topup':
        return 'text-orange-600';
      case 'renewal':
        return 'text-red-600';
      case 'refund':
        return 'text-green-600';
      default:
        return 'text-green-600';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'subscription':
        return 'اشتراك';
      case 'balance_topup':
        return 'اضافة رصيد';
      case 'renewal':
        return 'تجديد';
      case 'refund':
        return 'استرداد';
      default:
        return 'اشتراك';
    }
  };

  const formatAmount = (amount, type) => {
    const isNegative = type === 'refund';
    const sign = isNegative ? '-' : '+';
    const color = isNegative ? 'text-red-600' : 'text-green-600';
    
    return (
      <span className={`text-lg font-bold ${color}`}>
        {sign} {amount}
      </span>
    );
  };

  const copyTransactionId = () => {
    navigator.clipboard.writeText(transaction.id);
    // يمكن إضافة إشعار للمستخدم هنا
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Transaction Details */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black mb-2">
            {transaction.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className={`font-medium ${getTypeColor(transaction.type)}`}>
              {getTypeText(transaction.type)}
            </span>
            <span>|</span>
            <span>رقم العملية: {transaction.id}</span>
            <button 
              onClick={copyTransactionId}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>نسخ</span>
            </button>
            <span>|</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{transaction.date}</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              <span>{transaction.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Status and Amount */}
        <div className="flex items-center gap-4">
          {/* Amount */}
          {formatAmount(transaction.amount, transaction.type)}
          
          {/* Status */}
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full ${getStatusColor(transaction.status)} flex items-center justify-center`}>
              {getStatusIcon(transaction.status)}
            </div>
            <span className="text-sm font-medium text-black mt-1">
              {getStatusText(transaction.status)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
