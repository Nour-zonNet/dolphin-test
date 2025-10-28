import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getEmbeddedInvoiceStatus } from '@/features/subscription/services/paymentEmbedded';

const POLL_INTERVAL = 3000; // ms

export default function EmbeddedPaymentModal({
  open,
  onClose, // called with ({ success, invoiceId, data }) when done / closed
  paymentUrl,
  invoiceId, // optional
  polling = true, // enable polling fallback
  packageName = "الباقة", // for display
}) {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);
  const [paymentStatus, setPaymentStatus] = useState('loading'); // loading, processing, success, failed

  // Listen to postMessage from the iframe if MF supports it
  const handleMessage = useCallback((event) => {
    // Security: check origin if you know MF host, e.g. https://demo.MyFatoorah.com
    // if (event.origin !== 'https://demo.MyFatoorah.com') return;
    try {
      const payload = event.data;
      // Example payloads depend on MyFatoorah. Adjust as needed.
      if (!payload) return;
      if (payload.type === 'payment_success' || payload.status === 'success') {
        setPaymentStatus('success');
        onClose({ success: true, invoiceId, data: payload });
      } else if (payload.type === 'payment_failed' || payload.status === 'failed') {
        setPaymentStatus('failed');
        onClose({ success: false, invoiceId, data: payload });
      }
    } catch (e) {
      // ignore
    }
  }, [invoiceId, onClose]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [open, handleMessage]);

  // Polling fallback: check invoice status periodically
  useEffect(() => {
    if (!open || !invoiceId || !polling) return;

    const poll = async () => {
      try {
        const result = await getEmbeddedInvoiceStatus(invoiceId);
        // expected result.data.status: 'Paid'|'Failed'|'Pending'
        const status = result?.data?.status?.toLowerCase();
        if (status === 'paid' || status === 'completed' || status === 'success') {
          clearInterval(pollRef.current);
          setPaymentStatus('success');
          onClose({ success: true, invoiceId, data: result.data });
        } else if (status === 'failed' || status === 'cancelled') {
          clearInterval(pollRef.current);
          setPaymentStatus('failed');
          onClose({ success: false, invoiceId, data: result.data });
        }
        // otherwise keep polling
      } catch (err) {
        // optionally stop polling after N attempts
      }
    };

    pollRef.current = setInterval(poll, POLL_INTERVAL);
    // start immediately
    poll();

    return () => {
      clearInterval(pollRef.current);
    };
  }, [open, invoiceId, polling, onClose]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      setPaymentStatus('loading');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => onClose({ success: false, cancelled: true })} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full h-[85vh] overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">إتمام الدفع - {packageName}</h3>
          </div>
          <button
            onClick={() => onClose({ success: false, cancelled: true })}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="إغلاق"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Payment Status Indicator */}
        {paymentStatus === 'loading' && (
          <div className="px-4 py-2 bg-blue-50 border-b">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-sm">جاري تحضير صفحة الدفع...</span>
            </div>
          </div>
        )}

        {paymentStatus === 'processing' && (
          <div className="px-4 py-2 bg-yellow-50 border-b">
            <div className="flex items-center gap-2 text-yellow-700">
              <div className="animate-pulse w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">جاري معالجة الدفع...</span>
            </div>
          </div>
        )}

        {/* Iframe Container */}
        <div className="relative h-full">
          <iframe
            ref={iframeRef}
            title="MyFatoorah Payment"
            src={paymentUrl}
            onLoad={() => {
              setLoading(false);
              setPaymentStatus('processing');
            }}
            className="w-full h-full border-0"
            allow="payment"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
          />

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">جارٍ تحميل صفحة الدفع...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            سيتم توجيهك إلى صفحة آمنة لإتمام عملية الدفع
          </p>
        </div>
      </div>
    </div>
  );
}
