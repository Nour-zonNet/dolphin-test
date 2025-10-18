import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWalletBalance } from "@/services/api";

// Async thunk to fetch wallet balance
export const fetchWalletBalance = createAsyncThunk(
  'balance/fetchWalletBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWalletBalance();
      return response.balance || response.amount || 0;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    currentBalance: parseInt(localStorage.getItem('walletBalance') || '0'), // Current balance in Riyal
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
        state.currentBalance = action.payload;
        localStorage.setItem('walletBalance', action.payload.toString());
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
