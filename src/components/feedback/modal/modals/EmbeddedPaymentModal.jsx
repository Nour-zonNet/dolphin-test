// components/feedback/modal/modals/EmbeddedPaymentModal.jsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { executeEmbeddedPayment } from '@/features/subscription/services/paymentEmbedded';

const EmbeddedPaymentModal = ({
  open,
  onClose,
  sessionData,
  packageIds,
  packageName = "الباقة"
}) => {
  const iframeRef = useRef(null);
  const checkUrlIntervalRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const containerId = "myfatoorah-container"; // Fixed ID for MyFatoorah init

  useEffect(() => {
    if (open && sessionData?.session_id && !paymentInitialized) {
      setLoading(true);
      setError(null);
      setPaymentInitialized(true);
      
      // Load MyFatoorah session.js and initialize payment
      loadMyFatoorahScript();
    }
  }, [open, sessionData, paymentInitialized]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setPaymentInitialized(false);
      setLoading(false);
      setError(null);
      // Cleanup interval if exists
      if (checkUrlIntervalRef.current) {
        clearInterval(checkUrlIntervalRef.current);
        checkUrlIntervalRef.current = null;
      }
      // Cleanup custom styles
      const existingStyles = document.getElementById('myfatoorah-input-fix');
      if (existingStyles) {
        existingStyles.remove();
      }
    }
  }, [open]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (checkUrlIntervalRef.current) {
        clearInterval(checkUrlIntervalRef.current);
      }
    };
  }, []);

  // Failsafe: stop loading after 30s if nothing happened
  useEffect(() => {
    if (!loading) return;
    const id = setTimeout(() => {
      setError('تعذر الاتصال بخادم الدفع الآن. يرجى المحاولة لاحقًا.');
      setLoading(false);
    }, 30000);
    return () => clearTimeout(id);
  }, [loading]);

  const loadMyFatoorahScript = () => {
    // Check if script already loaded
    if (window.myfatoorah) {
      console.log('MyFatoorah already loaded');
      initializePayment();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="session.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        console.log('MyFatoorah script loaded from existing');
        initializePayment();
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://demo.myfatoorah.com/payment/v1/session.js';
    script.async = true;
    script.onload = () => {
      console.log('MyFatoorah script loaded successfully');
      // Small delay to ensure the script is fully initialized
      setTimeout(() => {
        initializePayment();
      }, 100);
    };
    script.onerror = (error) => {
      console.error('Failed to load MyFatoorah script:', error);
      setError('فشل في تحميل صفحة الدفع. تحقق من اتصال الإنترنت.');
      setLoading(false);
    };
    document.head.appendChild(script);
  };

  const initializePayment = () => {
    console.log('Initializing payment with sessionData:', sessionData);
    console.log('MyFatoorah available:', !!window.myfatoorah);
    
    if (!window.myfatoorah) {
      setError('نظام الدفع غير متاح. يرجى إعادة تحميل الصفحة.');
      setLoading(false);
      return;
    }

    if (!sessionData?.session_id) {
      setError('بيانات الدفع غير متوفرة');
      setLoading(false);
      return;
    }

    try {
      // Ensure container exists before proceeding
      let container = document.getElementById(containerId);
      if (!container) {
        console.warn('Container not found, creating it:', containerId);
        // Create container if it doesn't exist
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'w-full h-full';
        // Find the modal content area and append the container
        const modalContent = document.querySelector('.bg-white.rounded-lg');
        if (modalContent) {
          const contentArea = modalContent.querySelector('.flex-1.relative') || modalContent;
          contentArea.appendChild(container);
        } else {
          setError('عنصر الدفع غير موجود. يرجى إعادة المحاولة.');
          setLoading(false);
          return;
        }
      }

      // Clear any existing content and ensure size
      container.innerHTML = '';
      try {
        container.style.minHeight = '560px';
        container.style.padding = '8px';
        container.style.pointerEvents = 'auto'; // Ensure inputs are clickable
        container.style.position = 'relative';
        container.style.zIndex = '1';
      } catch (_) {}

      const config = {
        sessionId: sessionData.session_id,
        countryCode: sessionData.country_code || 'KWT',
        currencyCode: sessionData.currency || 'SAR',
        amount: String(sessionData.amount ?? '0'),
        callback: (response) => {
          console.log('MyFatoorah payment callback received:', response);
          handlePaymentCallback(response);
        },
        containerId,
        paymentOptions: ["ApplePay", "GooglePay", "Card", "STCPay"],
        supportedNetworks: ["visa", "masterCard", "mada"],
        language: 'ar',
        settings: {
          card: {
            style: {
              cardHeight: '260px',
              backgroundColor: '#ffffff',
              labels: {
                color: '#08233F',
                fontSize: '14px',
                fontWeight: '600',
              },
              input: {
                color: '#08233F',
                fontSize: '16px',
                inputHeight: '44px',
                borderColor: '#C9D6E2',
                borderRadius: '10px',
                placeholderColor: '#8CA1B3',
                focus: {
                  borderColor: '#0ea5e9',
                  boxShadow: '0 0 0 3px rgba(14,165,233,0.15)'
                }
              },
              button: {
                backgroundColor: '#08233F', // navyteal
                color: '#ffffff',
                borderRadius: '10px',
                hover: {
                  backgroundColor: '#0a2d4f' // slightly lighter navyteal on hover
                }
              }
            }
          }
        }
      };

      console.log('Initializing MyFatoorah with config:', config);
      
      // Initialize MyFatoorah
      window.myfatoorah.init(config);
      
      // Add custom CSS to ensure all inputs are interactive
      // Wait a bit for MyFatoorah to render
      setTimeout(() => {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'myfatoorah-input-fix';
        styleSheet.textContent = `
          #${containerId} input,
          #${containerId} input[type="text"],
          #${containerId} input[type="tel"],
          #${containerId} input[type="email"],
          #${containerId} textarea {
            pointer-events: auto !important;
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
          }
          #${containerId} * {
            pointer-events: auto !important;
          }
          #${containerId} {
            pointer-events: auto !important;
            position: relative !important;
            z-index: 1 !important;
          }
        `;
        
        // Remove existing styles if present
        const existingStyles = document.getElementById('myfatoorah-input-fix');
        if (existingStyles) {
          existingStyles.remove();
        }
        
        document.head.appendChild(styleSheet);
      }, 500);

      // Stop loading only after widget mounts content
      const ensureMountedStart = Date.now();
      const checkMounted = () => {
        const el = document.getElementById(containerId);
        const hasContent = !!el && !!el.innerHTML && el.innerHTML.trim() !== '';
        if (hasContent) {
          setLoading(false);
          console.log('MyFatoorah initialized and mounted');
          return;
        }
        if (Date.now() - ensureMountedStart > 4000) { // 4s max wait
          setLoading(false);
          console.warn('MyFatoorah did not mount content within timeout');
          return;
        }
        requestAnimationFrame(checkMounted);
      };
      requestAnimationFrame(checkMounted);

      } catch (err) {
      console.error('Error initializing payment:', err);
      setError(`فشل في تهيئة نظام الدفع: ${err.message || 'خطأ غير معروف'}`);
      setLoading(false);
    }
  };

  const handlePaymentCallback = async (response) => {
    console.log('MyFatoorah payment callback received:', response);
    
    // According to the flow: callback provides { sessionId: "abc123" }
    // Extract sessionId from callback response
    const callbackSessionId = response?.sessionId || response?.session_id || sessionData?.session_id;
    
    if (!callbackSessionId) {
      console.error('No sessionId in callback:', response);
      setError('فشل في استلام معرف الجلسة من نظام الدفع');
      setLoading(false);
      return;
    }
    
    // Check if user cancelled
    if (response && (response.status === 'cancelled' || response.cancelled === true)) {
      console.log('Payment cancelled by user');
      onClose({ success: false, cancelled: true, sessionId: callbackSessionId });
      return;
    }
    
    // Call execute endpoint with SessionId
    console.log('Calling execute with SessionId:', callbackSessionId);
    try {
      setLoading(true);
      const executeResult = await executeEmbeddedPayment(packageIds, callbackSessionId);
      
      console.log('Execute payment response:', executeResult);
      
      // Extract payment_url and invoice_status from response
      const paymentUrl = executeResult?.data?.payment_url || 
                         executeResult?.data?.url || 
                         executeResult?.Data?.PaymentURL;
      
      const invoiceStatus = executeResult?.data?.invoice_status || 
                           executeResult?.data?.invoiceStatus ||
                           executeResult?.Data?.InvoiceStatus;
      
      console.log('Payment execute result:', { paymentUrl, invoiceStatus, fullResult: executeResult });
      
      // If payment_url is null, check invoice_status to verify payment
      if (!paymentUrl || paymentUrl === null || paymentUrl === 'null') {
        // Check if invoice is actually paid
        const isPaid = invoiceStatus === 'Paid' || 
                      invoiceStatus === 'paid' || 
                      invoiceStatus === 'PAID' ||
                      invoiceStatus === 2 || // MyFatoorah paid status code
                      executeResult?.success === true;
        
        if (isPaid) {
          console.log('Payment completed successfully - invoice is paid (payment_url is null)');
          // Add small delay to allow backend to process subscription update
          setTimeout(() => {
            onClose({ 
              success: true, 
              cancelled: false,
              sessionId: callbackSessionId,
              paymentData: executeResult,
              invoiceStatus: invoiceStatus,
              verified: true
            });
          }, 500);
        } else {
          console.warn('Payment execute succeeded but invoice status is not paid:', invoiceStatus);
          // Still show success but log warning - backend should handle verification
          setTimeout(() => {
            onClose({ 
              success: true, 
              cancelled: false,
              sessionId: callbackSessionId,
              paymentData: executeResult,
              invoiceStatus: invoiceStatus,
              verified: false
            });
          }, 1000); // Longer delay to allow backend processing
        }
        return;
      }
      
      // If payment_url is a URL, show OTP/3DS page in iframe
      if (paymentUrl && paymentUrl.startsWith('http')) {
        console.log('Payment URL received, showing OTP page:', paymentUrl);
        mountOtpIframe(paymentUrl);
        return;
      }
      
      // Unexpected response format
      console.error('Unexpected execute response format:', executeResult);
      setError(executeResult?.message || 'رد غير متوقع من خادم الدفع');
      setLoading(false);
      
    } catch (err) {
      console.error('ExecutePayment error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'فشل في تنفيذ الدفع';
      setError(errorMessage);
      setLoading(false);
    }
  };


  const mountOtpIframe = (paymentUrl) => {
    const host = document.getElementById(containerId);
    if (!host) {
      setError('تعذر عرض صفحة الدفع');
      setLoading(false);
      return;
    }
    
    // Clear embedded form and show OTP iframe
    host.innerHTML = '';
    
    const iframe = document.createElement('iframe');
    iframe.src = paymentUrl;
    iframe.title = 'MyFatoorah OTP';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.minHeight = '520px';
    iframe.style.border = '0';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.sandbox = 'allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation';
    host.appendChild(iframe);
    setLoading(false);

    // Listen for messages from MyFatoorah iframe
    const onMessage = (event) => {
      if (!event?.data) return;
      try {
        const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // Handle MyFatoorah 3DS redirect message
        if (msg && msg.sender === 'MF-3DSecure' && msg.url) {
          window.removeEventListener('message', onMessage);
          onClose({ 
            success: true, 
            cancelled: false, 
            sessionId: sessionData?.session_id, 
            redirectUrl: msg.url 
          });
        }
      } catch (_) { /* ignore parsing errors */ }
    };
    
    // Listen for iframe navigation to callback URL
    checkUrlIntervalRef.current = setInterval(() => {
      try {
        // Check if iframe navigated to callback URL
        if (iframe.contentWindow?.location?.href?.includes('/callback?paymentId=')) {
          if (checkUrlIntervalRef.current) {
            clearInterval(checkUrlIntervalRef.current);
            checkUrlIntervalRef.current = null;
          }
          window.removeEventListener('message', onMessage);
          try {
            const url = new URL(iframe.contentWindow.location.href);
            const paymentId = url.searchParams.get('paymentId');
            console.log('Callback URL detected with paymentId:', paymentId);
            // Add delay to allow backend to process the callback and update subscription
            setTimeout(() => {
              onClose({ 
                success: true, 
                cancelled: false, 
                sessionId: sessionData?.session_id,
                paymentId: paymentId,
                verified: true
              });
            }, 1500); // Delay to allow backend to verify and update subscription
          } catch (e) {
            console.error('Error parsing callback URL:', e);
            // Still close with success after delay
            setTimeout(() => {
              onClose({ 
                success: true, 
                cancelled: false, 
                sessionId: sessionData?.session_id,
                verified: false
              });
            }, 1500);
          }
        }
      } catch (e) {
        // Cross-origin check - ignore
      }
    }, 500);
    
    window.addEventListener('message', onMessage);
  };

  const handleClose = () => {
    // Cleanup custom styles
    const existingStyles = document.getElementById('myfatoorah-input-fix');
    if (existingStyles) {
      existingStyles.remove();
    }
    
    // Reset all state
    setPaymentInitialized(false);
    setLoading(false);
    setError(null);
    
    onClose({ 
      success: false, 
      cancelled: true,
      sessionId: sessionData?.session_id
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 bg-opacity-50">
      <div className="relative bg-white rounded-lg w-full max-w-5xl h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                إتمام عملية الدفع - {packageName}
              </h3>
              <p className="text-sm text-gray-600">
                المبلغ: {sessionData?.amount || 0} {sessionData?.currency || 'SAR'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="إغلاق"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center flex-col gap-4">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-600">جاري تحضير صفحة الدفع...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex-1 flex items-center justify-center flex-col gap-4 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* MyFatoorah Payment Container */}
        {!loading && !error && sessionData?.session_id && (
          <div className="flex-1 relative">
            <div 
              id={containerId} 
              className="w-full h-full"
              style={{ pointerEvents: 'auto' }}
            />
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center rounded-b-lg">
          <p className="text-xs text-gray-500">
            عملية الدفع تتم عبر بوابة MyFatoorah الآمنة
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedPaymentModal;