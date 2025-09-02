import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { packagesRepository } from "../services/packages.services";

// 1- الباقات المتاحة للجميع
export const fetchAllPackages = createAsyncThunk(
  "packages/fetchAll",
  async () => {
    const res = await packagesRepository.getAll();
    return res.data;
  }
);

// 2- الباقات المشترك فيها المستخدم الحالي
export const fetchMyPackages = createAsyncThunk(
  "packages/fetchMine",
  async () => {
    const res = await packagesRepository.getAllMine();
    return res.data;
  }
);

const packagesSlice = createSlice({
  name: "packages",
  initialState: {
    all: [],      // كل الباقات
    mine: [],     // باقاتي المشتركة
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // all packages
      .addCase(fetchAllPackages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // my packages
      .addCase(fetchMyPackages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.mine = action.payload;
      })
      .addCase(fetchMyPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default packagesSlice.reducer;
