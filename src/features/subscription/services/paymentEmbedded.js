// services/paymentEmbedded.js
import api from '@/services/api';

// Initiate embedded session
export const initiateEmbeddedPayment = async (packageIds) => {
  const packages = Array.isArray(packageIds) ? packageIds : [packageIds];
  const response = await api.post('/student/embedded-payment/initiate', {
    packages,
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
export const executeEmbeddedPayment = async (paymentData) => {
  const response = await api.post('/student/embedded-payment/execute', paymentData);
  
  // Handle both MyFatoorah format and custom format
  const data = response.data;
  
  // If backend returns MyFatoorah format, convert it
  if (data.IsSuccess && data.Data) {
    return {
      success: true,
      data: {
        url: data.Data.PaymentURL,
        invoice_id: data.Data.InvoiceId
      },
      message: data.Message
    };
  }
  
  // If backend returns custom format, return as is
  return data;
};