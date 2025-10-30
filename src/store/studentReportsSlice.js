// slices/studentReportsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentReportsService } from '../services/studentReportsService';

// Async thunk for fetching student reports
export const fetchStudentReports = createAsyncThunk(
  'studentReports/fetchStudentReports',
  async (filter = 'monthly', { rejectWithValue }) => {
    try {
      const response = await studentReportsService.getStudentReports(filter);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const studentReportsSlice = createSlice({
  name: 'studentReports',
  initialState: {
    data: null,
    loading: false,
    error: null,
    filter: 'monthly'
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearReports: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch student reports
      .addCase(fetchStudentReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentReports.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        // Persist the requested filter from the thunk argument, not Array.prototype.filter on data
        state.filter = action.meta?.arg ?? state.filter;
      })
      .addCase(fetchStudentReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilter, clearError, clearReports } = studentReportsSlice.actions;
export default studentReportsSlice.reducer;