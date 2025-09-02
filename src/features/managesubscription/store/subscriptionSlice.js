// src/features/managesubscription/store/subscriptionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subscriptionRepository } from "../services/subscription.services";

// Thunks
export const fetchSubscriptions = createAsyncThunk(
  "subscriptions/fetch",
  async () => {
    const res = await subscriptionRepository.getAll();
    return res.data; // assuming backend returns { data: [...] }
  }
);

export const cancelSubscription = createAsyncThunk(
  "subscriptions/cancel",
  async (id) => {
    const res = await subscriptionRepository.cancel(id);
    return res.data;
  }
);

export const getGroupsByPackageId = createAsyncThunk(
  "subscriptions/groups",
  async (id) => {
    const res = await subscriptionRepository.getGroupsByPackageId(id);
    return res.data;
  }
);

export const renewSubscription = createAsyncThunk(
  "subscriptions/renew",
  async (id) => {
    const res = await subscriptionRepository.renew(id);
    return res.data;
  }
);

export const  changeGroupSubscription = createAsyncThunk(
  "subscriptions/changeGroup",
  async ({ id, groupId }) => {
    const res = await subscriptionRepository.changeGroup(id, groupId);
    return res.data;
  }
);

// Slice
const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // cancel
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.items = state.items.map((s) =>
          s.id === action.payload.id ? action.payload : s
        );
      })

      // renew
      .addCase(renewSubscription.fulfilled, (state, action) => {
        state.items = state.items.map((s) =>
          s.id === action.payload.id ? action.payload : s
        );
      })

      // change group
      .addCase(changeGroupSubscription.fulfilled, (state, action) => {
        state.items = state.items.map((s) =>
          s.id === action.payload.id ? action.payload : s
        );
      });
  },
});

export default subscriptionSlice.reducer;
