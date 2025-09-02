import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subscriptionRepository } from "../services/subscription.services";

// ===== Helper for error extraction =====
const handleError = async (error, thunkAPI) => {
  // If backend sends a proper error response
  if (error.response && error.response.data) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Server error");
  }
  return thunkAPI.rejectWithValue(error.message || "Unknown error");
};

// Thunks
export const fetchSubscriptions = createAsyncThunk(
  "subscriptions/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await subscriptionRepository.getAll();
      return res.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  "subscriptions/cancel",
  async (id, thunkAPI) => {
    try {
      const res = await subscriptionRepository.cancel(id);
      return res.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

export const getGroupsByPackageId = createAsyncThunk(
  "subscriptions/groups",
  async (id, thunkAPI) => {
    try {
      const res = await subscriptionRepository.getGroupsByPackageId(id);
      return res.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

export const renewSubscription = createAsyncThunk(
  "subscriptions/renew",
  async (id, thunkAPI) => {
    try {
      const res = await subscriptionRepository.renew(id);
      return res.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

export const changeGroupSubscription = createAsyncThunk(
  "subscriptions/changeGroup",
  async ({ id, groupId }, thunkAPI) => {
    try {
      const res = await subscriptionRepository.changeGroup(id, groupId);
      return res;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

// Slice
const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState: {
    items: [],
    groups: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    };

    builder
      // ===== Fetch =====
      .addCase(fetchSubscriptions.pending, handlePending)
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, handleRejected)

      // ===== Cancel =====
      .addCase(cancelSubscription.pending, handlePending)
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((s) =>
          s.id === action.payload.id ? action.payload : s
        );
      })
      .addCase(cancelSubscription.rejected, handleRejected)

      // ===== Renew =====
      .addCase(renewSubscription.pending, handlePending)
      .addCase(renewSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((s) =>
          s.id === action.payload.id ? action.payload : s
        );
      })
      .addCase(renewSubscription.rejected, handleRejected)

      // ===== Change Group =====
      .addCase(changeGroupSubscription.pending, handlePending)
      .addCase(changeGroupSubscription.fulfilled, (state) => {
        state.loading = false;
        // console.log(state.items)
        // console.log(action.payload)
        // // state.items = state.items.map((s) =>
        // //   s.id === action.payload.id ? action.payload : s
        // );
      })
      .addCase(changeGroupSubscription.rejected, handleRejected)

      // ===== Get Groups =====
      .addCase(getGroupsByPackageId.pending, handlePending)
      .addCase(getGroupsByPackageId.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(getGroupsByPackageId.rejected, handleRejected);
  },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
