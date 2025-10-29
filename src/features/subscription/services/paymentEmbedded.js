// services/paymentEmbedded.js
import api from '@/services/api';

// Initiate embedded session
export const initiateEmbeddedPayment = async (packageIds) => {
  const packages = Array.isArray(packageIds) ? packageIds : [packageIds];
  const response = await api.post('/student/embedded-payment/initiate', {
    packages,
  });
  return response.data;
};

// Execute payment with selected method
export const executeEmbeddedPayment = async (paymentData) => {
  const response = await api.post('/student/embedded-payment/execute', paymentData);
  return response.data;
};