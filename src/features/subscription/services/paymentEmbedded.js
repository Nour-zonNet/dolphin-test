// services/paymentEmbedded.js
import api from '@/services/api';

// Initiate embedded session
export const initiateEmbeddedPayment = async (packageIds) => {
  const packages = Array.isArray(packageIds) ? packageIds : [packageIds];
  // Use POST with packages in body
  const response = await api.post('/student/embedded-payment/initiate', {
    packages: packages
  });
  
  // Handle both MyFatoorah format and custom format
  const data = response.data;
  
  // If backend returns MyFatoorah format, convert it
  if (data.IsSuccess && data.Data) {
    return {
      success: true,
      data: {
        session_id: data.Data.SessionId,
        country_code: data.Data.CountryCode,
        amount: data.Data.Amount || 0,
        currency: data.Data.Currency || 'SAR'
      },
      message: data.Message
    };
  }
  
  // If backend returns custom format, return as is
  return data;
};

// Execute payment with selected method
export const executeEmbeddedPayment = async (packageIds, sessionId) => {
  const packages = Array.isArray(packageIds) ? packageIds : [packageIds];
  const response = await api.post('/student/embedded-payment/execute', {
    packages: packages,
    SessionId: sessionId
  });
  
  // Handle both MyFatoorah format and custom format
  const data = response.data;
  
  // If backend returns MyFatoorah format, convert it
  if (data.IsSuccess && data.Data) {
    return {
      success: true,
      data: {
        payment_url: data.Data.PaymentURL,
        invoice_status: data.Data.InvoiceStatus,
        invoice_id: data.Data.InvoiceId
      },
      message: data.Message
    };
  }
  
  // If backend returns custom format, return as is
  return data;
};

// Verify payment status after callback
export const verifyPaymentStatus = async (packageIds, paymentId = null, invoiceId = null) => {
  try {
    const packages = Array.isArray(packageIds) ? packageIds : [packageIds];
    const response = await api.post('/student/embedded-payment/verify', {
      packages: packages,
      paymentId: paymentId,
      invoiceId: invoiceId
    });
    
    return response.data;
  } catch (error) {
    // If verify endpoint doesn't exist, return null and let backend handle it
    console.warn('Verify endpoint not available or error:', error);
    return null;
  }
};