import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lessonsRepository } from "../services/lessons.services";

export const fetchLessons = createAsyncThunk(
  "lessons/fetch",
  async (_, { rejectWithValue }) => {
    const res = await lessonsRepository.getAll();
    try {
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getSessionLink = createAsyncThunk(
  "session/getSessionLink",
  async (roomUId, { rejectWithValue }) => {
    try {
      const { data } = await lessonsRepository.getSessionLink(roomUId);
      return data; // بيرجع الـ payload
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const lessonsSlice = createSlice({
  name: "lessons",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getSessionLink.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(getSessionLink.fulfilled, (state, action) => {
        state.loading = false;
        state.link = action.payload;
      })
      .addCase(getSessionLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default lessonsSlice.reducer;
