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
  const [showOtpIframe, setShowOtpIframe] = useState(false); // Track when OTP iframe should be visible
  const [isProcessingExecute, setIsProcessingExecute] = useState(false); // Prevent duplicate execute calls
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
      setShowOtpIframe(false); // Reset OTP iframe flag
      setIsProcessingExecute(false); // Reset execute flag
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
        // callback: payment,
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
    
    // Prevent duplicate callback handling
    if (isProcessingExecute) {
      console.warn('⚠️ Execute already in progress, ignoring duplicate callback');
      return;
    }
    
    // STEP 2: MyFatoorah callback provides SessionId_B (different from SessionId_A)
    // According to flow spec:
    // - SessionId_A: from /initiate response (used to initialize form)
    // - SessionId_B: from MyFatoorah callback after user completes form (used for /execute)
    const callbackSessionId = response?.sessionId || response?.session_id;
    
    // Important: Prefer SessionId_B from callback, only fallback to SessionId_A if absolutely necessary
    const sessionIdB = callbackSessionId || sessionData?.session_id;
    
    if (!sessionIdB) {
      console.error('ERROR: No sessionId in callback response:', response);
      setError('فشل في استلام معرف الجلسة من نظام الدفع');
      setLoading(false);
      return;
    }
    
    // Log session ID comparison
    if (callbackSessionId && callbackSessionId !== sessionData?.session_id) {
      console.log('✓ SessionId_B received (different from SessionId_A):', callbackSessionId);
    } else if (callbackSessionId === sessionData?.session_id) {
      console.warn('⚠ SessionId_B matches SessionId_A - this may be unexpected');
    } else {
      console.warn('⚠ No SessionId_B in callback, using SessionId_A as fallback');
    }
    
    // Check if user cancelled
    if (response && (response.status === 'cancelled' || response.cancelled === true)) {
      console.log('Payment cancelled by user');
      onClose({ success: false, cancelled: true, sessionId: sessionIdB });
      return;
    }
    
    // Set flag to prevent duplicate calls
    setIsProcessingExecute(true);
    
    // Call execute endpoint with SessionId
    console.log('Calling execute with SessionId:', callbackSessionId);
    try {
      setLoading(true);
      const executeResult = await executeEmbeddedPayment(packageIds, sessionIdB);
      
      console.log('Execute payment response:', executeResult);
      console.log('Execute response structure:', {
        hasData: !!executeResult?.data,
        dataKeys: executeResult?.data ? Object.keys(executeResult.data) : [],
        fullResponse: executeResult
      });
      
      // Log full response for debugging
      console.log('🔍 Full execute response:', JSON.stringify(executeResult, null, 2));
      console.log('🔍 Execute result keys:', Object.keys(executeResult || {}));
      console.log('🔍 Execute result.data keys:', Object.keys(executeResult?.data || {}));
      
      // Extract payment_url from various possible locations in response
      // Try all possible locations (case-sensitive and case-insensitive)
      const paymentUrl = executeResult?.data?.payment_url || 
                         executeResult?.data?.url || 
                         executeResult?.data?.paymentUrl ||
                         executeResult?.data?.PaymentURL ||
                         executeResult?.data?.Payment_Url ||
                         executeResult?.Data?.PaymentURL ||
                         executeResult?.Data?.payment_url ||
                         executeResult?.payment_url ||
                         executeResult?.PaymentURL ||
                         executeResult?.url ||
                         null;
      
      console.log('🔍 Raw extraction attempts:', {
        'data.payment_url': executeResult?.data?.payment_url,
        'data.url': executeResult?.data?.url,
        'data.paymentUrl': executeResult?.data?.paymentUrl,
        'data.PaymentURL': executeResult?.data?.PaymentURL,
        'Data.PaymentURL': executeResult?.Data?.PaymentURL,
        'payment_url': executeResult?.payment_url,
        'finalPaymentUrl': paymentUrl
      });
      
      const invoiceStatus = executeResult?.data?.invoice_status || 
                           executeResult?.data?.invoiceStatus ||
                           executeResult?.Data?.InvoiceStatus ||
                           executeResult?.invoice_status ||
                           null;
      
      console.log('🔍 Payment execute extraction result:', { 
        paymentUrl, 
        invoiceStatus, 
        paymentUrlType: typeof paymentUrl,
        paymentUrlLength: paymentUrl?.length,
        paymentUrlStartsWithHttp: paymentUrl?.startsWith?.('http'),
        paymentUrlStartsWithHttps: paymentUrl?.startsWith?.('https'),
        paymentUrlFirst50Chars: paymentUrl?.substring?.(0, 50),
        rawPaymentUrl: executeResult?.data?.payment_url,
        allDataKeys: Object.keys(executeResult?.data || {})
      });
      
      // CRITICAL PRIORITY CHECK: If payment_url exists and is a valid URL, ALWAYS show OTP/3DS page
      // This MUST be checked FIRST before any invoice_status check
      // payment_url presence means 3DS/OTP verification is REQUIRED - payment is NOT complete yet
      
      // More robust URL validation - check for any valid URL format
      const isValidUrl = paymentUrl && 
          typeof paymentUrl === 'string' && 
          paymentUrl.trim() !== '' && 
          paymentUrl !== 'null' && 
          paymentUrl.toLowerCase() !== 'null' &&
          paymentUrl.toLowerCase() !== 'undefined' &&
          (paymentUrl.toLowerCase().startsWith('http://') || 
           paymentUrl.toLowerCase().startsWith('https://'));
      
      console.log('🔍 URL validation result:', {
        hasPaymentUrl: !!paymentUrl,
        isString: typeof paymentUrl === 'string',
        notEmpty: paymentUrl?.trim() !== '',
        notNullString: paymentUrl !== 'null',
        startsWithHttp: paymentUrl?.toLowerCase().startsWith('http'),
        isValidUrl: isValidUrl
      });
      
      if (isValidUrl) {
        console.log('✅✅✅ Payment URL detected - MUST show OTP/3DS verification page:', paymentUrl);
        console.log('✅ Setting showOtpIframe to true and mounting iframe');
        console.log('🚫 BLOCKING any success callbacks - OTP iframe will handle completion');
        
        // CRITICAL: Set flags to prevent any success modal
        setShowOtpIframe(true); // Set flag to show OTP iframe
        setLoading(false); // Stop loading state
        setError(null); // Clear any errors
        
        // CRITICAL: Mount iframe IMMEDIATELY - payment URLs have short-lived tokens
        // Any delay can cause "Invalid transaction" error
        // Use requestAnimationFrame for immediate mounting without blocking
        requestAnimationFrame(() => {
          console.log('✅ Mounting OTP iframe IMMEDIATELY with URL (token may expire quickly):', paymentUrl.substring(0, 100) + '...');
          mountOtpIframe(paymentUrl);
          // Keep isProcessingExecute true until OTP completes (callback URL detected)
          // This prevents any accidental success modal from showing
        });
        
        // CRITICAL: Return early - DO NOT proceed to success check
        // This return statement MUST execute to prevent showing success modal
        console.log('🛑 Returning early - OTP iframe mounted, no success modal should show');
        return; // CRITICAL: Return early to prevent showing success modal
      } else {
        console.error('❌❌❌ Payment URL validation FAILED - URL should have been detected!', {
          paymentUrl,
          type: typeof paymentUrl,
          length: paymentUrl?.length,
          trimmed: paymentUrl?.trim?.(),
          firstChars: paymentUrl?.substring?.(0, 100)
        });
      }
      
      // Only proceed to success check if payment_url is DEFINITELY null/empty
      // This handles direct payments that don't require 3DS/OTP verification
      // CRITICAL: If we reach here, it means isValidUrl was FALSE
      // So paymentUrl either doesn't exist, or exists but is not a valid URL
      console.log('🔍 Reached null/empty payment_url check - isValidUrl was false');
      console.log('🔍 paymentUrl value:', paymentUrl);
      console.log('🔍 paymentUrl type:', typeof paymentUrl);
      
      if (!paymentUrl || 
          paymentUrl === null || 
          paymentUrl === undefined ||
          paymentUrl === 'null' || 
          paymentUrl === 'undefined' ||
          (typeof paymentUrl === 'string' && paymentUrl.trim() === '')) {
        
        console.log('✅ No payment_url found - checking invoice_status for direct payment completion');
        console.log('🔍 invoice_status:', invoiceStatus);
        
        // Check if invoice is actually paid
        const isPaid = invoiceStatus === 'Paid' || 
                      invoiceStatus === 'paid' || 
                      invoiceStatus === 'PAID' ||
                      invoiceStatus === 2 || // MyFatoorah paid status code
                      invoiceStatus === 'Completed' ||
                      invoiceStatus === 'completed';
        
        console.log('🔍 isPaid check result:', isPaid);
        
        if (isPaid) {
          console.log('✅ Payment completed successfully - invoice is paid (payment_url is null)');
          // Add small delay to allow backend to process subscription update
          setTimeout(() => {
            onClose({ 
              success: true, 
              cancelled: false,
              sessionId: sessionIdB, // Use SessionId_B
              paymentData: executeResult,
              invoiceStatus: invoiceStatus,
              verified: true,
              paymentType: 'immediate' // No OTP needed
            });
          }, 500);
        } else {
          // CRITICAL: If invoice_status is null/not paid AND payment_url is null,
          // this means payment is NOT complete - don't show success!
          console.error('❌ Payment NOT complete - showing error:', { 
            invoiceStatus, 
            paymentUrl, 
            executeResultSuccess: executeResult?.success,
            message: 'Invoice status is not paid and no payment_url provided. Payment is incomplete.' 
          });
          
          setError('لم يتم إتمام عملية الدفع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.');
          setLoading(false);
          setIsProcessingExecute(false); // Reset flag
        }
        return;
      }
      
      // If we reach here, paymentUrl exists but is NOT a valid URL
      // This is an error condition - we have a payment_url but it's not usable
      console.error('❌❌❌ CRITICAL ERROR: payment_url exists but is not a valid URL!', {
        paymentUrl,
        type: typeof paymentUrl,
        length: paymentUrl?.length,
        firstChars: paymentUrl?.substring?.(0, 100),
        executeResult
      });
      setError('رابط الدفع غير صالح. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.');
      setLoading(false);
      setIsProcessingExecute(false); // Reset flag on error
      return; // Exit early - don't show success
      
    } catch (err) {
      console.error('ExecutePayment error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'فشل في تنفيذ الدفع';
      setError(errorMessage);
      setLoading(false);
      setIsProcessingExecute(false); // Reset flag on error
    }
  };


  const mountOtpIframe = (paymentUrl) => {
    console.log('🔄 mountOtpIframe called with paymentUrl:', paymentUrl);
    
    // Try to find the container - it should be in the modal content area
    let host = document.getElementById(containerId);
    
    // If container doesn't exist, find the modal content area and create it
    if (!host) {
      console.warn('Container not found, attempting to locate or create it');
      
      // Find the modal content area (flex-1 relative div)
      const modalContentArea = document.querySelector('.bg-white.rounded-lg .flex-1.relative') ||
                               document.querySelector('.bg-white.rounded-lg [class*="flex-1"]') ||
                               document.querySelector('#myfatoorah-container') ||
                               document.querySelector('[id*="fatoorah"]');
      
      if (modalContentArea) {
        console.log('Found modal content area, creating container');
        host = document.createElement('div');
        host.id = containerId;
        host.className = 'w-full h-full';
        host.style.pointerEvents = 'auto';
        host.style.position = 'relative';
        host.style.minHeight = '520px';
        modalContentArea.innerHTML = ''; // Clear any existing content
        modalContentArea.appendChild(host);
      } else {
        // Last resort: try to find any container or create in body (shouldn't happen)
        console.error('Could not find modal content area');
        const fallbackContainer = document.querySelector('.bg-white.rounded-lg');
        if (fallbackContainer) {
          host = document.createElement('div');
          host.id = containerId;
          host.className = 'w-full h-full';
          host.style.pointerEvents = 'auto';
          host.style.position = 'relative';
          host.style.minHeight = '520px';
          host.style.width = '100%';
          host.style.height = '100%';
          
          // Find or create the flex-1 div inside modal
          let contentArea = fallbackContainer.querySelector('.flex-1');
          if (!contentArea) {
            contentArea = document.createElement('div');
            contentArea.className = 'flex-1 relative';
            // Insert before footer if it exists
            const footer = fallbackContainer.querySelector('.border-t');
            if (footer) {
              fallbackContainer.insertBefore(contentArea, footer);
            } else {
              fallbackContainer.appendChild(contentArea);
            }
          }
          contentArea.innerHTML = '';
          contentArea.appendChild(host);
        }
      }
    }
    
    if (!host) {
      console.error('❌ Could not find or create container:', containerId);
      setError('تعذر عرض صفحة الدفع - لم يتم العثور على العنصر المطلوب');
      setLoading(false);
      return;
    }
    
    console.log('✅ Container found/created, clearing and preparing for OTP iframe');
    
    // CRITICAL: Force container and ALL parents to be visible
    // Use !important to override React inline styles that might hide it
    const forceVisibility = (element) => {
      if (!element) return;
      element.style.setProperty('display', 'block', 'important');
      element.style.setProperty('visibility', 'visible', 'important');
      element.style.setProperty('opacity', '1', 'important');
      element.style.setProperty('height', 'auto', 'important');
      element.style.setProperty('min-height', '520px', 'important');
      element.style.setProperty('width', '100%', 'important');
      element.style.setProperty('position', 'relative', 'important');
      element.style.setProperty('z-index', '1', 'important');
    };
    
    // Force visibility on container
    forceVisibility(host);
    
    // Force visibility on parent (flex-1 relative div)
    if (host.parentElement) {
      forceVisibility(host.parentElement);
    }
    
    // Force visibility on grandparent (modal content area)
    if (host.parentElement?.parentElement) {
      forceVisibility(host.parentElement.parentElement);
    }
    
    console.log('✅ Container and parents forced visible');
    
    // Clear embedded form and show OTP iframe
    // Clear any existing MyFatoorah widget content
    host.innerHTML = '';
    
    // Also clear any MyFatoorah initialization
    try {
      if (window.myfatoorah && typeof window.myfatoorah.destroy === 'function') {
        window.myfatoorah.destroy();
      }
    } catch (e) {
      console.warn('Could not destroy MyFatoorah widget:', e);
    }
    
    const iframe = document.createElement('iframe');
    iframe.src = paymentUrl;
    iframe.title = 'MyFatoorah OTP';
    
    // Store iframe reference for monitoring
    iframeRef.current = iframe;
    
    // Ensure iframe is fully visible with !important styles
    iframe.style.setProperty('width', '100%', 'important');
    iframe.style.setProperty('height', '100%', 'important');
    iframe.style.setProperty('min-height', '520px', 'important');
    iframe.style.setProperty('border', '0', 'important');
    iframe.style.setProperty('display', 'block', 'important');
    iframe.style.setProperty('visibility', 'visible', 'important');
    iframe.style.setProperty('opacity', '1', 'important');
    iframe.style.setProperty('position', 'relative', 'important');
    iframe.style.setProperty('z-index', '10', 'important');
    iframe.referrerPolicy = 'no-referrer-when-downgrade';

    // Handle iframe load errors (e.g., invalid transaction)
    // Note: Errors from MyFatoorah's JavaScript (jQuery, etc.) may appear but are usually non-fatal
    iframe.onerror = (error) => {
      console.error('Error loading payment iframe:', error);
      // Only show error if iframe actually failed to load, not just JS errors inside iframe
      // MyFatoorah's jQuery errors are expected and usually don't prevent OTP page from working
      setTimeout(() => {
        // Check if iframe actually loaded (wait a bit for errors to surface)
        if (!iframe.contentWindow) {
          setError('حدث خطأ في تحميل صفحة التحقق. يرجى المحاولة مرة أخرى.');
          setLoading(false);
        }
      }, 3000);
    };
    

    iframe.onload = () => {
      console.log('✅ OTP iframe onload event fired - page is loading');
      console.log('ℹ️ Note: Any jQuery errors from MyFatoorah site.js are expected and non-fatal');
      
      // Check URL immediately for invalid transaction errors
      setTimeout(() => {
        try {
          const iframeHref = iframe.contentWindow?.location?.href || '';
          console.log('🔍 Checking iframe URL after load:', iframeHref.substring(0, 200));
          
          // CRITICAL: Check if URL shows invalid transaction error
          if (iframeHref.toLowerCase().includes('invalid transaction') || 
              iframeHref.toLowerCase().includes('invalidtransaction')) {
            console.error('❌ Invalid transaction detected in iframe URL!');
            setError('انتهت صلاحية رابط الدفع أو المعاملة غير صالحة. يرجى المحاولة مرة أخرى.');
            setLoading(false);
            setIsProcessingExecute(false);
            return;
          }
          
          // Try to check iframe content (may fail due to cross-origin)
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const bodyText = iframeDoc.body?.innerText?.toLowerCase() || '';
            const titleText = iframeDoc.title?.toLowerCase() || '';
            
            // Check for error messages
            if (bodyText.includes('invalid transaction') || 
                bodyText.includes('invalid') || 
                bodyText.includes('expired') || 
                bodyText.includes('خطأ') ||
                titleText.includes('invalid')) {
              console.error('❌ Error page detected in iframe content:', { bodyText: bodyText.substring(0, 100), titleText });
              setError('انتهت صلاحية رابط الدفع أو المعاملة غير صالحة. يرجى المحاولة مرة أخرى.');
              setLoading(false);
              setIsProcessingExecute(false);
            } else {
              // Iframe loaded successfully and shows content
              console.log('✅ OTP iframe content loaded successfully - no errors detected');
            }
          }
        } catch (e) {
          // Cross-origin - can't access iframe content, which is expected
          // This is normal for MyFatoorah's payment pages
          // The OTP form should still be visible and functional
          console.log('Cannot access iframe content (cross-origin restriction) - this is expected');
          console.log('✅ OTP page should be visible in iframe (cross-origin prevents content inspection)');
          console.log('⚠️ Cannot verify if page shows "Invalid transaction" due to cross-origin - URL monitoring will detect it');
        }
      }, 1000); // Reduced from 2000ms to 1000ms for faster error detection
    };
    
    // Monitor for iframe being removed/unloaded (which would cancel requests)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((node) => {
            if (node === iframe || (node.nodeType === 1 && node.querySelector && node.querySelector('iframe') === iframe)) {
              console.error('⚠️ OTP iframe was removed from DOM! This will cancel ongoing requests.');
            }
          });
        }
      });
    });
    
    // Start observing the container for iframe removal
    if (host.parentElement) {
      observer.observe(host.parentElement, { childList: true, subtree: true });
    }
    
    // Cleanup observer when iframe is done
    setTimeout(() => {
      observer.disconnect();
    }, 60000); // Disconnect after 1 minute
    
    console.log('📦 Appending OTP iframe to container');
    host.appendChild(iframe);
    setLoading(false); // Hide loading spinner
    setError(null); // Clear any errors to ensure container is visible
    
      // Verify iframe was added and is visible
    setTimeout(() => {
      const addedIframe = host.querySelector('iframe');
      if (addedIframe) {
        console.log('✅ OTP iframe successfully added to DOM');
        console.log('Iframe src:', addedIframe.src);
        console.log('Iframe dimensions:', {
          width: addedIframe.offsetWidth,
          height: addedIframe.offsetHeight
        });
        console.log('Iframe computed styles:', {
          display: window.getComputedStyle(addedIframe).display,
          visibility: window.getComputedStyle(addedIframe).visibility,
          opacity: window.getComputedStyle(addedIframe).opacity,
          zIndex: window.getComputedStyle(addedIframe).zIndex
        });
        console.log('Container computed styles:', {
          display: window.getComputedStyle(host).display,
          visibility: window.getComputedStyle(host).visibility,
          opacity: window.getComputedStyle(host).opacity
        });
        
        // Force visibility one more time to be sure
        addedIframe.style.setProperty('display', 'block', 'important');
        addedIframe.style.setProperty('visibility', 'visible', 'important');
        host.style.setProperty('display', 'block', 'important');
        host.style.setProperty('visibility', 'visible', 'important');
      } else {
        console.error('❌ OTP iframe was not added to DOM!');
        setError('فشل في عرض صفحة التحقق. يرجى المحاولة مرة أخرى.');
      }
    }, 500);

    // Listen for messages from MyFatoorah iframe
    const onMessage = (event) => {
      if (!event?.data) return;
      try {
        const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // Handle MyFatoorah 3DS redirect message
        if (msg && msg.sender === 'MF-3DSecure' && msg.url) {
          console.log('MF-3DSecure message received with redirect URL');
          window.removeEventListener('message', onMessage);
          onClose({ 
            success: true, 
            cancelled: false, 
            sessionId: sessionIdB, // Use SessionId_B (not SessionId_A!)
            redirectUrl: msg.url,
            paymentType: '3ds_secure'
          });
        }
      } catch (_) { /* ignore parsing errors */ }
    };
    
    // Listen for iframe navigation to callback URL or error pages
    // Use the stored iframe reference or find it again
    checkUrlIntervalRef.current = setInterval(() => {
      try {
        // Get iframe - use ref first, then try to find it
        const currentIframe = iframeRef.current || host.querySelector('iframe');
        if (!currentIframe) {
          console.warn('⚠️ Iframe not found for URL monitoring');
          return;
        }
        
        const iframeHref = currentIframe.contentWindow?.location?.href || '';
        
        // CRITICAL: Check for "Invalid transaction" error first
        // This happens when the payment URL token expires (usually within seconds)
        if (iframeHref.includes('Invalid') || 
            iframeHref.includes('invalid') || 
            iframeHref.includes('Invalid transaction') ||
            iframeHref.toLowerCase().includes('invalid transaction')) {
          console.error('❌ Invalid transaction detected in iframe URL - token likely expired:', iframeHref.substring(0, 150));
          if (checkUrlIntervalRef.current) {
            clearInterval(checkUrlIntervalRef.current);
            checkUrlIntervalRef.current = null;
          }
          window.removeEventListener('message', onMessage);
          setIsProcessingExecute(false);
          setError('انتهت صلاحية رابط الدفع. الرجاء المحاولة مرة أخرى - قد يكون رابط الدفع منتهي الصلاحية.');
          setLoading(false);
          return;
        }
        
        // Check if iframe navigated to callback URL (success)
        // ONLY treat as success if URL contains callback AND paymentId (not cancelled)
        if (iframeHref.includes('/callback') && iframeHref.includes('paymentId=')) {
          // Double-check it's NOT a cancel callback
          if (iframeHref.includes('cancel') || iframeHref.includes('cancelled') || iframeHref.includes('canceled')) {
            console.warn('⚠️ Cancel callback detected - not treating as success');
            if (checkUrlIntervalRef.current) {
              clearInterval(checkUrlIntervalRef.current);
              checkUrlIntervalRef.current = null;
            }
            window.removeEventListener('message', onMessage);
            setIsProcessingExecute(false);
            onClose({ 
              success: false, 
              cancelled: true,
              sessionId: sessionData?.session_id,
              error: 'تم إلغاء عملية الدفع'
            });
            return;
          }
          
          if (checkUrlIntervalRef.current) {
            clearInterval(checkUrlIntervalRef.current);
            checkUrlIntervalRef.current = null;
          }
          window.removeEventListener('message', onMessage);
          
          try {
            const url = new URL(iframeHref);
            const paymentId = url.searchParams.get('paymentId');
            const status = url.searchParams.get('status');
            
            // Check status parameter if present
            if (status && (status.toLowerCase() === 'cancel' || status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'failed')) {
              console.warn('⚠️ Payment status indicates failure/cancel:', status);
              setIsProcessingExecute(false);
              onClose({ 
                success: false, 
                cancelled: status.toLowerCase().includes('cancel'),
                sessionId: sessionData?.session_id,
                error: `حالة الدفع: ${status}`
              });
              return;
            }
            
            console.log('✅ Valid callback URL detected with paymentId:', paymentId);
            // Add delay to allow backend to process the callback and update subscription
            setTimeout(() => {
              setIsProcessingExecute(false); // Reset flag on successful completion
              onClose({ 
                success: true, 
                cancelled: false, 
                sessionId: sessionIdB, // Use SessionId_B (not SessionId_A!)
                paymentId: paymentId,
                verified: true,
                paymentType: '3ds_secure'
              });
            }, 1500); // Delay to allow backend to verify and update subscription
          } catch (e) {
            console.error('Error parsing callback URL:', e);
            // If we can't parse the URL, don't assume success
            console.warn('⚠️ Could not parse callback URL - treating as uncertain');
            setIsProcessingExecute(false);
              onClose({ 
              success: false, 
                cancelled: false, 
                sessionId: sessionData?.session_id,
              verified: false,
              error: 'تعذر التحقق من حالة الدفع'
            });
          }
        }
        // Check for cancel/cancelled pages (user cancelled OTP/3DS)
        else if (iframeHref.includes('cancel') || 
                 iframeHref.includes('cancelled') ||
                 iframeHref.includes('canceled') ||
                 iframeHref.includes('إلغاء')) {
          console.warn('⚠️ Payment cancelled by user - cancel page detected:', iframeHref);
          if (checkUrlIntervalRef.current) {
            clearInterval(checkUrlIntervalRef.current);
            checkUrlIntervalRef.current = null;
          }
          window.removeEventListener('message', onMessage);
          setIsProcessingExecute(false); 
          onClose({ 
            success: false, 
            cancelled: true,
            sessionId: sessionData?.session_id,
            error: 'تم إلغاء عملية الدفع من قبل المستخدم'
          });
          return; // Exit early - don't show error, just close modal
        }
        // Check for error pages (invalid transaction, expired, etc.)
        else if (iframeHref.includes('error') || 
                 iframeHref.includes('invalid') || 
                 iframeHref.includes('expired') ||
                 iframeHref.includes('fail') ||
                 iframeHref.includes('failed') ||
                 iframeHref.includes('فشل')) {
          console.warn('❌ Error page detected in iframe:', iframeHref);
          if (checkUrlIntervalRef.current) {
            clearInterval(checkUrlIntervalRef.current);
            checkUrlIntervalRef.current = null;
          }
          window.removeEventListener('message', onMessage);
          setIsProcessingExecute(false); // Reset execute flag
          setError('فشلت عملية التحقق من الدفع. قد يكون رابط الدفع منتهي الصلاحية أو المعاملة غير صالحة. يرجى المحاولة مرة أخرى.');
          setLoading(false);
        }
      } catch (e) {
        // Cross-origin check - ignore (expected when iframe is cross-origin)
      }
    }, 500);
    
    window.addEventListener('message', onMessage);
  };

  const handleClose = () => {
    console.log('⚠️ User manually closed payment modal');
    
    // Cleanup custom styles
    const existingStyles = document.getElementById('myfatoorah-input-fix');
    if (existingStyles) {
      existingStyles.remove();
    }
    
    // Stop any URL checking
    if (checkUrlIntervalRef.current) {
      clearInterval(checkUrlIntervalRef.current);
      checkUrlIntervalRef.current = null;
    }
    
    // Reset all state
    setPaymentInitialized(false);
    setLoading(false);
    setError(null);
      setShowOtpIframe(false);
      setIsProcessingExecute(false);
      
      // Clear iframe reference
      iframeRef.current = null;
    
      // Close with cancelled = true to prevent success modal
    onClose({ 
      success: false, 
      cancelled: true,
        sessionId: sessionData?.session_id,
        error: 'تم إغلاق نافذة الدفع من قبل المستخدم'
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

        {/* Loading State - Hide when OTP iframe is showing */}
        {loading && !showOtpIframe && (
          <div className="flex-1 flex items-center justify-center flex-col gap-4">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-600">جاري تحضير صفحة الدفع...</p>
          </div>
        )}

        {/* Error State - Hide when OTP iframe is showing */}
        {error && !showOtpIframe && (
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
        {/* Always render container div to ensure it exists in DOM for OTP iframe mounting */}
        {/* Container will be used when payment form loads OR when OTP iframe needs to mount */}
        <div className="flex-1 relative" style={{ minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
          {/* Container div - ALWAYS render in DOM, show/hide based on loading/error/OTP state */}
            <div 
              id={containerId} 
              className="w-full h-full"
            style={{ 
              pointerEvents: 'auto', 
              minHeight: '520px', 
              position: 'relative',
              width: '100%',
              height: '100%',
              flex: '1 1 auto',
              // Show if: (not loading AND no error AND has session) OR OTP iframe is showing
              // CRITICAL: When showOtpIframe is true, ALWAYS show (override any other state)
              visibility: showOtpIframe ? 'visible' : ((!loading && !error && sessionData?.session_id) ? 'visible' : 'hidden'),
              display: 'block', // Always keep in DOM layout
              opacity: showOtpIframe ? 1 : ((!loading && !error && sessionData?.session_id) ? 1 : 0)
            }}
            />
          </div>

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