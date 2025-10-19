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
  try {
    const response = await api.get('/student/wallet/balance');
    
    return response.data;
  } catch (error) {
    // Wallet balance error
    // Re-throw the error so it can be handled by the calling code
    throw error;
  }
};

export default api;
  