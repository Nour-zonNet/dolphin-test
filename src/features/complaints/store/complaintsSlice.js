import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { complaintsRepository } from "../services/complaints.services";

// ----------------- Thunks -----------------
export const submitComplaint = createAsyncThunk(
  "complaints/submit",
  async (complaintData, { rejectWithValue }) => {
    try {
      const res = await complaintsRepository.submitComplaint(complaintData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Submit complaint failed"
      );
    }
  }
);

export const fetchComplaints = createAsyncThunk(
  "complaints/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await complaintsRepository.getComplaints();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Fetch complaints failed"
      );
    }
  }
);

// ----------------- Slice -----------------
const complaintsSlice = createSlice({
  name: "complaints",
  initialState: {
    items: [],
    loading: false,
    error: null,
    submitLoading: false,
    submitError: null,
  },
  reducers: {
    clearComplaintsError: (state) => {
      state.error = null;
    },
    clearSubmitError: (state) => {
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    // ---- submitComplaint ----
    builder
      .addCase(submitComplaint.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
      })
      .addCase(submitComplaint.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(submitComplaint.rejected, (state, action) => {
        state.submitLoading = false;
        console.log(action);
        state.submitError =
          action.payload.error || action.error?.message || "خطأ في إرسال الشكوى";
      });

    // ---- fetchComplaints ----
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "خطأ في جلب الشكاوى";
      });
  },
});

export default complaintsSlice.reducer;
