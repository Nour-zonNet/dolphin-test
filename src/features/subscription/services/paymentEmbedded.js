// services/paymentEmbedded.js
import api from '@/services/api';

// Initiate embedded session (query param style based on your example)
export const initiateEmbeddedPayment = async (packageIds) => {
  // packageIds can be array or single id — adapt to your backend query format
  const qs = packageIds.join ? `?packages=${packageIds.join(',')}` : `?packages=${packageIds}`;
  const res = await api.get(`/student/embedded-payment/initiate${qs}`);
  return res.data; 
};

// Execute payment (server will return the MF URL + invoice_id)
export const executeEmbeddedPayment = async ({ packages, SessionId, PaymentMethodId }) => {
  const res = await api.post('/student/embedded-payment/execute', {
    packages,
    SessionId,
    PaymentMethodId,
  });
  return res.data;
};

// Get invoice status for polling
export const getEmbeddedInvoiceStatus = async (invoiceId) => {
  const res = await api.get(`/student/embedded-payment/status/${invoiceId}`);
  return res.data;
};
