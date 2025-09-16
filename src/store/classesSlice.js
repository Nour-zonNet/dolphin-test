import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { classRepository } from "@/services/class.services";

export const getClasses = createAsyncThunk("classes/getClasses", async () => {
  return await classRepository.getClasses();
});

const classesSlice = createSlice({
  name: "classes",
  initialState:{
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// export const {  addBrotherLocal } = classesSlice.actions;
export default classesSlice.reducer;
