import React from 'react';
import { ClosePopup, Copy } from '@/utils/icons';
import FormatWithCurrency from '@/utils/FormatWithCurrency';
import { TRANSACTION_TYPE_LABELS } from '@/features/balance/utils/sampleData';
import { X } from "lucide-react";
import { ExportReceipt } from '@/utils/icons';
import { CheckCircle } from '@/utils/icons';
/**
 * Transaction Details Modal Component
 * Displays transaction receipt in the exact format shown in the image
 */
const TransactionDetailsModal = ({ transaction, onClose }) => {
  // Debug: Log transaction data to understand the structure
  console.log('Transaction data in modal:', transaction);
  
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

  const downloadReceipt = () => {
    // Create a printable version of the receipt
    const receiptContent = `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 20px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px; font-weight: bold;">ايصال</h2>
          <p style="margin: 10px 0; color: #666;">معاملة رقم ${transaction.reference_id || transaction.id}</p>
        </div>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">نوع العملية:</span>
            <span style="font-weight: semibold;">${getOperationType(transaction.type)}</span>
          </div>
          ${getPackageName(transaction) ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">اسم الباقة:</span>
            <span>${getPackageName(transaction)}</span>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: bold;">مقدم الخدمة:</span>
            <span>${getServiceProvider()}</span>
          </div>
        </div>
        
         <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
           <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
             <span style="font-weight: bold;">التاريخ:</span>
             <span>${formatDate(transaction)}</span>
           </div>
           <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
             <span style="font-weight: bold;">الوقت:</span>
             <span>${formatTime(transaction)}</span>
           </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: bold;">رقم المعاملة:</span>
            <span>${transaction.reference_id || transaction.id}</span>
          </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: bold;">الحالة:</span>
            <span style="color: ${transaction.status === 'completed' ? '#2E7D32' : transaction.status === 'pending' ? 'orange' : 'red'};">${getStatusText(transaction.status)}</span>
          </div>
           <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
             <span style="font-weight: bold;">طريقة الدفع:</span>
             <span style="font-weight: semibold;">${getPaymentMethod(transaction)}</span>
           </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: bold;">المبلغ:</span>
            <span style="color: ${transaction.type === 'refund' ? 'red' : 'green'}; font-weight: bold;">
              ${transaction.type === 'refund' ? '-' : ''}${transaction.amount} ر.س
            </span>
          </div>
        </div>
      </div>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>ايصال - ${transaction.reference_id || transaction.id}</title>
          <style>
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${receiptContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusText = (status) => {
    const statusLabels = {
      'completed': 'عملية ناجحة',
      'pending': 'قيد الانتظار',
      'canceled': 'عملية ملغية',
    };
    return statusLabels[status] || 'عملية ناجحة';
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'text-green-600' : 
           status === 'pending' ? 'text-yellow-600' : 'text-red-600';
  };

  const getOperationType = (type) => {
    const typeLabels = {
      'subscription': 'اشتراك في باقة',
      'balance_topup': 'شحن الرصيد',
      'renewal': 'تجديد اشتراك',
      'refund': 'استرداد',
    };
    return typeLabels[type] || 'معاملة';
  };

  const getPackageName = (transaction) => {
    if (transaction.type === 'subscription' || transaction.type === 'renewal') {
      return transaction.title || 'باقة غير محددة';
    }
    return null; // Don't show package name for wallet recharge
  };

  const getServiceProvider = () => {
    return 'منصة الدلفين التعليمية';
  };

  const getPaymentMethod = (transaction) => {
    // For wallet recharge (balance_topup), show wallet payment method
    if (transaction.type === 'balance_topup') {
      return 'محفظة إلكترونية';
    }
    
    // For subscriptions and renewals, show credit card
    if (transaction.type === 'subscription' || transaction.type === 'renewal') {
      return 'بطاقة ائتمان';
    }
    
    // For refunds, show the original payment method or default to credit card
    if (transaction.type === 'refund') {
      return 'بطاقة ائتمان';
    }
    
    // Default fallback
    return 'بطاقة ائتمان';
  };

  const formatDate = (transaction) => {
    // First try to use the already formatted date string
    if (transaction.date && typeof transaction.date === 'string' && transaction.date !== 'undefined' && transaction.date !== 'NaN') {
      return transaction.date;
    }
    
    // If no formatted date, try to use timestamp
    if (transaction.timestamp) {
      const date = new Date(transaction.timestamp);
      
      // Check if date is valid
      if (!isNaN(date.getTime())) {
        const months = [
          'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
          'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      }
    }
    
    return 'غير محدد';
  };

  const formatTime = (transaction) => {
    // Try to use timestamp first (it's more reliable for time)
    if (transaction.timestamp) {
      const date = new Date(transaction.timestamp);
      
      // Check if date is valid
      if (!isNaN(date.getTime())) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        
        const period = hours >= 12 ? 'م' : 'ص';
        const displayHours = hours > 12 ? hours - 12 : hours;
        
        return `${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
      }
    }
    
    // If no timestamp, try to use date string
    if (transaction.date && typeof transaction.date === 'string' && transaction.date !== 'undefined' && transaction.date !== 'NaN') {
      const date = new Date(transaction.date);
      
      if (!isNaN(date.getTime())) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        
        const period = hours >= 12 ? 'م' : 'ص';
        const displayHours = hours > 12 ? hours - 12 : hours;
        
        return `${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
      }
    }
    
    return 'غير محدد';
  };

  const formatAmount = (amount, type) => {
    const isNegative = type === 'refund';
    const color = isNegative ? 'text-red-600' : 'text-green-600';
    
    return (
      <div className={`text-lg font-bold ${color} flex items-center gap-1`}>
        <span>{isNegative ? '-' : ''}</span>
        <FormatWithCurrency 
          amount={amount} 
          showSymbol={true}
          className=""
          symbolClass="w-4 h-4"
          symbolFill={isNegative ? "#E21B1B" : "#2E7D32"}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] w-[90%] mx-auto max-w-md mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <button 
            onClick={downloadReceipt}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 transition-colors absolute left-4 top-4"
            aria-label="تحميل الإيصال"
          >
            {/* Upload/Share Icon */}
            <ExportReceipt />
          </button>
          
          <h2 className="text-lg font-bold text-center flex-1">ايصال</h2>
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full border-[0.5px] border-solid border-[#8c8c8c66] p-2"
                aria-label="إغلاق"
                >
                <X className="w-5 h-5 text-gray-600" />
            </button>
        </div>

        {/* Transaction Number */}
        <div className="px-6 border-b border-dashed border-gray-300 pb-4">
          <p className="text-sm text-gray-600 text-center">
            معاملة رقم {transaction.reference_id || transaction.id}
          </p>
        </div>

        {/* Transaction Details */}
        <div className="p-6 space-y-4">
          {/* Operation Details */}
          <div className="bg-gray-100 rounded-[12px] p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">نوع العملية</span>
                <span className="text-sm text-gray-900 font-semibold">{getOperationType(transaction.type)}</span>
              </div>
              
              {getPackageName(transaction) && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">اسم الباقة</span>
                  <span className="text-sm text-gray-900 font-semibold">{getPackageName(transaction)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">مقدم الخدمة</span>
                <span className="text-sm text-gray-900 font-semibold">{getServiceProvider()}</span>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-gray-100 rounded-[12px] p-4">
            <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium text-gray-700">التاريخ</span>
                 <span className="text-sm text-gray-900 font-semibold">{formatDate(transaction)}</span>
               </div>
               
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium text-gray-700">الوقت</span>
                 <span className="text-sm text-gray-900 font-semibold">{formatTime(transaction)}</span>
               </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">رقم المعاملة</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900 font-semibold">{transaction.reference_id || transaction.id}</span>
                  <button 
                    onClick={copyTransactionId}
                    className="flex items-center gap-1 text-orangedeep hover:text-btnClicked transition-colors"
                    aria-label="نسخ رقم المعاملة"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="text-xs">نسخ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-gray-100 rounded-[12px] p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">الحالة</span>
                <div className="flex items-center gap-2">
                  {transaction.status === 'completed' && (
                    // <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    //   <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.5 6.5L7 10l-2.5-2.5L3.5 9 7 12.5l6-6-1.5-1.5z" fill="#22C55E"/>
                    // </svg>
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span className={`text-sm font-semibold ${getStatusColor(transaction.status)}`}>
                    {getStatusText(transaction.status)}
                  </span>
                </div>
              </div>
              
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium text-gray-700">طريقة الدفع</span>
                 <span className="text-sm text-gray-900 font-semibold">{getPaymentMethod(transaction)}</span>
               </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">المبلغ</span>
                {formatAmount(transaction.amount, transaction.type)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
