import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lessonsRepository } from "../services/lessons.services";

export const fetchLessons = createAsyncThunk("lessons/fetch", async () => {
  const res = await lessonsRepository.getAll();
  return res.data;
});

const lessonsSlice = createSlice({
  name: "lessons",
  initialState: {
    items: [   {
            "day_of_week": "saturday",
            "start_time": "07:00 مساء",
            "subject": "القرأن",
            "group": "المجموعة 2",
            "class": "الصف الاول ابتدائي",
            "session_link": "https://online.learnatdolphin.com/lea-vza-wm2-yse",
            "teacher_status": "active",
            "status": false
        },
        {
            "day_of_week": "tuesday",
            "start_time": "07:00 مساء",
            "subject": "القرأن",
            "group": "المجموعة 2",
            "class": "الصف الاول ابتدائي",
            "session_link": "https://online.learnatdolphin.com/lea-vza-wm2-yse",
            "teacher_status": "active",
            "status": false
        }],
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
        state.list = action.payload;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default lessonsSlice.reducer;
