import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { packagesRepository } from "../services/packages.services";
const handleError = async (error, thunkAPI) => {
  if (error.response && error.response.data) {
    return thunkAPI.rejectWithValue(
      error.response.data.error || "Server error"
    );
  }
  return thunkAPI.rejectWithValue(error.message || "Unknown error");
};
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

// 3- جدول الباقة
export const fetchScheduleById = createAsyncThunk(
  "packages/fetchScheduleById",
  async (groupId, thunkAPI) => {
    try {
      const res = await packagesRepository.getScheduleById(groupId);
      return { groupId, schedule: res.data };
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

const packagesSlice = createSlice({
  name: "packages",
  initialState: {
    all: [], // كل الباقات
    mine: [], // باقات المستخدم
    schedules: {}, // جدول الباقات (groupId -> schedule)
    loading: false,
    error: null,
  },
  reducers: {
    updatePackageGroup: (state, action) => {
      const { id, group_id, group_name } = action.payload;
      const pkgIndexMine = state.mine.findIndex((pkg) => pkg.package_id === id);
      if (pkgIndexMine !== -1) {
        state.mine[pkgIndexMine].group_id = group_id;
        state.mine[pkgIndexMine].group_name = group_name;
      }

      const pkgIndexAll = state.all.findIndex((pkg) => pkg.id === id);
      if (pkgIndexAll !== -1) {
        state.all[pkgIndexAll].group_id = group_id;
        state.all[pkgIndexAll].group_name = group_name;
      }
    },
  },
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
        state.mine = action.payload.packages;
        state.telegram = action.payload.telegram;
      })
      .addCase(fetchMyPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // schedule by groupId
      .addCase(fetchScheduleById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.loading = false;
        const { groupId, schedule } = action.payload;

        state.schedules[String(groupId)] = schedule;
      })
      .addCase(fetchScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { updatePackageGroup } = packagesSlice.actions;
export default packagesSlice.reducer;
