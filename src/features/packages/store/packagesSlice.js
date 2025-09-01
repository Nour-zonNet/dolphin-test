import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { packagesRepository } from "../services/packages.services";

export const fetchPackages = createAsyncThunk("packages/fetch", async () => {
  const res = await packagesRepository.getAllMine();
  return res.data;
});

const packagesSlice = createSlice({
  name: "packages",
  initialState: {
    items: [
    
    ],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default packagesSlice.reducer;
