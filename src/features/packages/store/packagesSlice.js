import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { packagesRepository } from "../services/packages.services";

export const fetchPackages = createAsyncThunk("packages/fetch", async () => {
  const res = await packagesRepository.getAll();
  return res.data;
});

const packagesSlice = createSlice({
  name: "packages",
  initialState: {
    items: [
      [
        {
          title: "باقة الصحة العامة",
          description: "",
          color: "border-r-16 border-r-health",
          group: "المجموعة الأولي",
          teacher: "أ. حنان",
        },
        {
          title: "باقة ركن المسلم",
          description: "",
          color: "border-r-16 border-r-quran",
          group: "المجموعة الأولي",
          teacher: "أ. حنان",
        },
      ],
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
