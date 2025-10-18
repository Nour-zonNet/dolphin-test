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
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Wallet charge API function
export const chargeWallet = async (amount) => {
  try {
    console.log('Making wallet charge request:', { amount, baseURL: api.defaults.baseURL });
    
    const response = await api.post('/student/wallet/charge', {
      amount: amount
    });
    
    console.log('Wallet charge response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Wallet charge error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    
    throw new Error(error.response?.data?.message || error.message || 'فشل في شحن المحفظة');
  }
};

// Get wallet balance API function
export const getWalletBalance = async () => {
  try {
    console.log('Fetching wallet balance:', { baseURL: api.defaults.baseURL });
    
    const response = await api.get('/student/wallet/balance');
    
    console.log('Wallet balance response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Wallet balance error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    throw new Error(error.response?.data?.message || error.message || 'فشل في جلب رصيد المحفظة');
  }
};

export default api;
  