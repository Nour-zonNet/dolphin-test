import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWalletBalance } from "@/services/api";

// Utility function to get cached balance
const getCachedBalance = () => {
  return parseInt(localStorage.getItem('walletBalance') || '0');
};

// Async thunk to fetch wallet balance
// Note: This handles the case where the backend API endpoint /student/wallet/balance
// is not yet implemented (404 error). In such cases, it falls back to using
// the cached balance from localStorage instead of failing the entire app initialization.
export const fetchWalletBalance = createAsyncThunk(
  'balance/fetchWalletBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWalletBalance();
      // Handle the new API response structure
      if (response.success && response.data && response.data.wallet) {
        return {
          balance: response.data.wallet.available_balance,
          transactions: response.data.transactions || []
        };
      }
      return { balance: response.balance || response.amount || 0, transactions: [] };
    } catch (error) {
      // Handle 404 error gracefully - endpoint might not be implemented yet
      if (error.response?.status === 404) {
        console.warn('Wallet balance endpoint not available yet, using cached balance');
        return { balance: getCachedBalance(), transactions: [] }; // Return cached balance instead of rejecting
      }
      return rejectWithValue(error.message);
    }
  }
);

const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    currentBalance: getCachedBalance(), // Current balance in Riyal
    transactions: [], // Array of transactions
    isLoading: false,
    error: null,
    paymentInProgress: false,
    lastTransaction: null,
  },
  reducers: {
    setBalance: (state, action) => {
      state.currentBalance = action.payload;
      localStorage.setItem('walletBalance', action.payload.toString());
    },
    addToBalance: (state, action) => {
      state.currentBalance += action.payload;
      localStorage.setItem('walletBalance', state.currentBalance.toString());
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPaymentInProgress: (state, action) => {
      state.paymentInProgress = action.payload;
    },
    setLastTransaction: (state, action) => {
      state.lastTransaction = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle both old and new response formats
        if (typeof action.payload === 'object' && action.payload.balance !== undefined) {
          state.currentBalance = action.payload.balance;
          state.transactions = action.payload.transactions || [];
        } else {
          state.currentBalance = action.payload;
        }
        localStorage.setItem('walletBalance', state.currentBalance.toString());
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setBalance,
  addToBalance,
  setLoading,
  setError,
  setPaymentInProgress,
  setLastTransaction,
  clearError,
} = balanceSlice.actions;

export default balanceSlice.reducer;
