import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subscriptionRepository } from "../services/subscription.services";

// ===== Helper for error extraction =====
const handleError = async (error, thunkAPI) => {
  if (error.response && error.response.data) {
    return thunkAPI.rejectWithValue(
      error.response.data.error || "Server error"
    );
  }
  return thunkAPI.rejectWithValue(error.message || "Unknown error");
};

// =================== Thunks ===================
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
  async (subscriptionId, thunkAPI) => {
    try {
      const res = await subscriptionRepository.cancel(subscriptionId);
      return { ...res.data, id: subscriptionId };
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

export const reactivateSubscription = createAsyncThunk(
  "subscriptions/reactivate",
  async (subscriptionId, thunkAPI) => {
    try {
      const res = await subscriptionRepository.reactivate(subscriptionId);
      return { ...res.data, id: subscriptionId };
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
      return res.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

export const fetchGroupsByPackageId = createAsyncThunk(
  "groups/fetchByPackageId",
  async (packageId, thunkAPI) => {
    try {
      const res = await subscriptionRepository.getByGroupsPackageId(packageId);
      return { packageId, groups: res.data };
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

export const createTrialSubscription = createAsyncThunk(
  "subscriptions/createTrial",
  async (ids, thunkAPI) => {
    try {
      const res = await subscriptionRepository.createTrialSubscription(ids);
      return res.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

// =================== Slice ===================
const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState: {
    items: [],
    groups: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
    addTrialSubscriptions: (state, action) => {
      const newSubscriptions = action.payload;

      if (Array.isArray(newSubscriptions)) {
        state.items = [...state.items, ...newSubscriptions];
      } else if (newSubscriptions?.id) {
        state.items = [...state.items, newSubscriptions];
      }
    },
    cancelSubscriptionSuccess: (state, action) => {
      const updated = action.payload ?? null;
      if (updated?.id) {
        state.items = state.items.map((s) =>
          s.id === updated.id ? { ...s, status: "cancelled" } : s
        );
      }
    },
    updateGroupInSubscription: (state, action) => {
      const updatedSubscription = action.payload;
      if (updatedSubscription && updatedSubscription.id) {
        state.items = state.items.map((s) =>
          s.id === updatedSubscription.id ? { ...s, ...updatedSubscription } : s
        );
      }
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
        subscriptionSlice.caseReducers.cancelSubscriptionSuccess(state, action);
      })
      .addCase(cancelSubscription.rejected, handleRejected)

      // ===== Reactivate =====
      .addCase(reactivateSubscription.pending, handlePending)
      .addCase(reactivateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action?.payload ?? null;
        if (updated?.id) {
          state.items = state.items.map((s) =>
            s.id === updated.id ? { ...s, status: updated.status } : s
          );
        }
      })
      .addCase(reactivateSubscription.rejected, handleRejected)

      // ===== Renew =====
      .addCase(renewSubscription.pending, handlePending)
      .addCase(renewSubscription.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action?.payload ?? null;
        if (updated?.id) {
          state.items = state.items.map((s) =>
            s.id === updated.id ? updated : s
          );
        }
      })
      .addCase(renewSubscription.rejected, handleRejected)

      // ===== Change Group =====
      .addCase(changeGroupSubscription.pending, handlePending)
      .addCase(changeGroupSubscription.fulfilled, (state, action) => {
        state.loading = false;
        subscriptionSlice.caseReducers.updateGroupInSubscription(state, action);
      })
      .addCase(changeGroupSubscription.rejected, handleRejected)

      // ===== GET Groups =====
      .addCase(getGroupsByPackageId.pending, handlePending)
      .addCase(getGroupsByPackageId.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(getGroupsByPackageId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.error || action.error.message;
      })

      // =====  Create Trial =====
      .addCase(createTrialSubscription.pending, handlePending)
      .addCase(createTrialSubscription.fulfilled, (state, action) => {
        state.loading = false;
        subscriptionSlice.caseReducers.addTrialSubscriptions(state, action);
      })
      .addCase(createTrialSubscription.rejected, handleRejected)
      .addCase(fetchGroupsByPackageId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchGroupsByPackageId.fulfilled, (state, action) => {
        state.loading = false;
        const { packageId, groups } = action.payload;
        state.groups[packageId] = groups;
      })
      .addCase(fetchGroupsByPackageId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  clearSubscriptionError,
  updateGroupInSubscription,
  addTrialSubscriptions,
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
