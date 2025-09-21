import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lessonsRepository } from "../services/lessons.services";
import { getNextDateForDay } from "@/utils/dateHelpers";

// ----------------- Thunks -----------------
export const fetchLessons = createAsyncThunk(
  "lessons/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await lessonsRepository.getAll();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPackageLessons = createAsyncThunk(
  "lessons/getPackageLessons",
  async (packageId, { rejectWithValue }) => {
    try {
      const { data } = await lessonsRepository.getPackageLessons(packageId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getSessionLink = createAsyncThunk(
  "lessons/getSessionLink",
  async (roomUId, { rejectWithValue }) => {
    try {
      const { data } = await lessonsRepository.getSessionLink(roomUId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ----------------- Slice -----------------
const lessonsSlice = createSlice({
  name: "lessons",
  initialState: {
    items: [],
    link: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearLessonsError: (state) => {
      state.error = null;
    },
    clearSessionLink: (state) => {
      state.link = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error?.message || "Unknown error";
    };

    builder
      // fetch lessons
      .addCase(fetchLessons.pending, handlePending)
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.loading = false;
        let sessions = action.payload;

        const delayedSessions = sessions
          .filter((s) => s.delay)
          .map((s) => ({
            ...s,
            day_of_week: s.delay.day_of_week,
            start_time: s.delay.start_time,
            session_date: getNextDateForDay(s.delay.day_of_week),
            delay: null,
          }));

        state.items = [...sessions, ...delayedSessions];
      })
      .addCase(fetchLessons.rejected, handleRejected)

      // get session link
      .addCase(getSessionLink.pending, handlePending)
      .addCase(getSessionLink.fulfilled, (state, action) => {
        state.loading = false;
        state.link = action.payload;
      })
      .addCase(getSessionLink.rejected, handleRejected)

      // get package lessons
      .addCase(getPackageLessons.pending, handlePending)
      .addCase(getPackageLessons.fulfilled, (state) => {
        state.loading = false;
        // state.items = action.payload; // use `items` for consistency
      })
      .addCase(getPackageLessons.rejected, handleRejected);
  },
});

export const { clearLessonsError, clearSessionLink } = lessonsSlice.actions;
export default lessonsSlice.reducer;
