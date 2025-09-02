import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lessonsRepository } from "../services/lessons.services";

export const fetchLessons = createAsyncThunk("lessons/fetch", async () => {
  const res = await lessonsRepository.getAll();

  return res.data;
});


const lessonsSlice = createSlice({
  name: "lessons",
  initialState: {
    items: [ ],
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
      });
  },
});

export default lessonsSlice.reducer;
