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

// 3- جدول الباقة
export const fetchScheduleById = createAsyncThunk(
  "packages/fetchScheduleById",
  async (groupId) => {
    const res = await packagesRepository.getScheduleById(groupId);
    return { groupId, schedule: res.data }; 
  }
);

const packagesSlice = createSlice({
  name: "packages",
  initialState: {
    all: [],      // كل الباقات
    mine: [], 
    schedules: {},    
    loadingAll: false,
    loadingMine: false,
    loadingSchedule: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // all packages
      .addCase(fetchAllPackages.pending, (state) => {
        state.loadingAll = true;
      })
      .addCase(fetchAllPackages.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.all = action.payload;
      })
      .addCase(fetchAllPackages.rejected, (state, action) => {
        state.loadingAll = false;
        state.error = action.error.message;
      })
      // my packages
      .addCase(fetchMyPackages.pending, (state) => {
        state.loadingMine = true;
      })
      .addCase(fetchMyPackages.fulfilled, (state, action) => {
        state.loadingMine = false;
        state.mine = action.payload;
      })
      .addCase(fetchMyPackages.rejected, (state, action) => {
        state.loadingMine = false;
        state.error = action.error.message;
      }).
      addCase(fetchScheduleById.pending, (state) => {
        state.loadingSchedule = true;
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.loadingSchedule = false;
        const { groupId, schedule } = action.payload;

        const items = Array.isArray(schedule) ? schedule : [];

        const grouped = items.reduce((acc, item) => {
          const day = item.day_of_week?.toLowerCase?.();
          if (!day) return acc;
          if (!acc[day]) acc[day] = [];
          acc[day].push({
            time: item.start_time,
            teacher_name: item.teacher_name,
            raw: item,
          });
          return acc;
        }, {});

        state.schedules[String(groupId)] = grouped;
      })
      .addCase(fetchScheduleById.rejected, (state, action) => {
        state.loadingSchedule = false;
        state.error = action.error.message;
      });
  },
});

export default packagesSlice.reducer;
