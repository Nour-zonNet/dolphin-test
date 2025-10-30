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
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    
    // Handle 403 Forbidden errors
    if (status === 403) {
      // Store the error in localStorage to trigger 403 error screen
      localStorage.setItem('403_error', 'true');
      // Optionally navigate to 403 page
      // window.location.href = '/403';
    }
    
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

// Wallet recharge packages API function
export const rechargePackagesFromWallet = async (packageIds) => {
  const response = await api.post('/student/wallet/recharge-packages', {
    packageIds: packageIds,
    subscription_type: "monthly"
  });
  
  return response.data;
};

export default api;
  