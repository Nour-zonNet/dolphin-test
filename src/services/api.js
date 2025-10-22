import axios from "axios";

// Vite environment variable: must start with VITE_
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://admin.learnadolphin.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('API Request with token:', config.url, 'Token:', token.substring(0, 20) + '...');
  } else {
    console.log('API Request without token:', config.url);
  }
  return config;
});

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Response error:', error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Wallet charge API function
export const chargeWallet = async (amount) => {
  try {
    const response = await api.post('/student/wallet/charge', {
      amount: amount
    });
    
    return response.data;
  } catch (error) {
    // Wallet charge error
    throw new Error(error.response?.data?.message || error.message || 'فشل في شحن المحفظة');
  }
};

// Get wallet balance API function
export const getWalletBalance = async () => {
  const response = await api.get('/student/wallet/balance');
  
  return response.data;
};

export default api;
  