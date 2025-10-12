import React from 'react';
import { CheckCircle, ClockBalance, XCircle, Copy, CalendarGray, WalletGray } from '@/utils/icons';
import FormatWithCurrency from '@/utils/FormatWithCurrency';

const TransactionCard = ({ transaction }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12" />;
      case 'pending':
        return <ClockBalance className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12" />;
      case 'canceled':
        return <XCircle className="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12" />;
      default:
        return <CheckCircle className="w-6 h-6 w-8 h-8 lg:w-12 lg:h-12" />;
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
        return 'text-[#1B872C]';
      case 'balance_topup':
        return 'text-orangedeep';
      case 'renewal':
        return 'text-[#E21B1B]';
      case 'refund':
        return 'text-[#2E7D32]';
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

  const copyTransactionId = () => {
    navigator.clipboard.writeText(transaction.id);
    // يمكن إضافة إشعار للمستخدم هنا
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#B3B3B3] md:p-4 mb-6">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
          {/* Status */}
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full ${getStatusColor(transaction.status)} flex items-center justify-center`}>
              {getStatusIcon(transaction.status)}
            </div>
            <span className="text-sm font-medium text-black mt-2">
              {getStatusText(transaction.status)}
            </span>
          </div>
          {/* Transaction Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="text-sm md:text-base lg:text-lg font-bold text-navyteal mb-2">
                {transaction.title}
              </h3>
              {/* Amount in mobile view */}
              <div className="md:hidden items-center gap-4 flex">
                {/* Amount */}
                {formatAmount(transaction.amount, transaction.type)} 
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm lg:text-lg text-gray-600 mt-4">
              <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                {getTypeText(transaction.type)}
              </span>
              <span className="text-[#D9D9D9]">|</span>
              <span className="text-[#686868]">رقم العملية: {transaction.id}</span>
              <button 
                onClick={copyTransactionId}
                className="flex items-center gap-1 hover:text-blue-600 transition-colors ms-4"
              >
                <Copy className="w-3 h-3" />
                <span className="text-[#404040]">نسخ</span>
              </button>
            </div>
            <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <CalendarGray className="w-3 h-3" />
                  <span className="text-[#8C8C8C] text-sm md:text-base">{transaction.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <WalletGray className="w-3 h-3" />
                  <span className="text-[#8C8C8C] text-sm md:text-base">{transaction.paymentMethod}</span>
                </div>
            </div>
          </div>
        </div>

        {/* Amount in tablet and desktop */}
        <div className="md:flex items-center gap-4 hidden">
          {/* Amount */}
          {formatAmount(transaction.amount, transaction.type)} 
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
