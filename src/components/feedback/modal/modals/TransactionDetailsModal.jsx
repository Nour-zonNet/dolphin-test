import React, { useRef } from 'react';
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
  const receiptRef = useRef(null);
  
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

  const downloadReceipt = async () => {
    // Dynamically load html2canvas if not already loaded
    const ensureHtml2Canvas = () =>
      new Promise((resolve, reject) => {
        if (window.html2canvas) return resolve(window.html2canvas);
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.async = true;
        script.onload = () => resolve(window.html2canvas);
        script.onerror = () => reject(new Error('Failed to load html2canvas'));
        document.body.appendChild(script);
      });

    try {
      const html2canvas = await ensureHtml2Canvas();
      const target = receiptRef.current;
      if (!target) {
        console.error('Receipt element not found');
        return;
      }

      // Wait a bit to ensure the modal is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      // Force a reflow to ensure all styles are applied
      target.offsetHeight;

      // Get the actual dimensions
      const rect = target.getBoundingClientRect();
      console.log('Target dimensions:', rect);
      console.log('Target element:', target);

      // Capture the receipt as canvas with high quality settings
      const canvas = await html2canvas(target, {
        backgroundColor: '#ffffff',
        scale: 2, // Fixed scale for consistency
        useCORS: true,
        logging: true, // Enable logging to debug
        allowTaint: true,
        foreignObjectRendering: true,
        width: rect.width,
        height: rect.height,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        // Ensure we capture the visible content
        ignoreElements: (element) => {
          // Skip elements that might cause issues
          return element.classList.contains('modal-backdrop') || 
                 element.classList.contains('modal-overlay') ||
                 element.tagName === 'BUTTON'; // Skip buttons
        }
      });

      // Check if canvas has content
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas is empty');
      }

      // Check if canvas has actual content (not just white/transparent)
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let hasContent = false;
      
      // Check if there's any non-white content
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // If pixel is not white/transparent, we have content
        if (a > 0 && (r < 250 || g < 250 || b < 250)) {
          hasContent = true;
          break;
        }
      }
      
      if (!hasContent) {
        throw new Error('Canvas appears to be blank or white');
      }

      console.log('Canvas captured successfully:', canvas.width, 'x', canvas.height);

      // Convert canvas to PNG data URL
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `ايصال_${transaction.reference_id || transaction.id}_${new Date().toISOString().split('T')[0]}.png`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      canvas.remove();
      
    } catch (error) {
      console.error('Failed to download receipt:', error);
      alert(`فشل في تحميل الإيصال: ${error.message}`);
    }
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
      <div ref={receiptRef} className="bg-white rounded-[24px] w-[90%] mx-auto max-w-md mx-auto relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          {/* <button 
            onClick={downloadReceipt}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-2 transition-colors absolute left-4 top-4"
            aria-label="تحميل الإيصال"
          >
            <ExportReceipt />
          </button> */}
          
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
