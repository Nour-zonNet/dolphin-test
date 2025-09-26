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
      return rejectWithValue(error?.response?.data || error?.message || "Fetch lessons failed");
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
      return rejectWithValue(error?.response?.data || error?.message || "Fetch package lessons failed");
    }
  }
);

export const getSessionLink = createAsyncThunk(
  "lessons/getSessionLink",
  async (sessionId, { rejectWithValue }) => {
    try {
      const { data } = await lessonsRepository.getSessionLink(sessionId);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message || "Fetch session link failed");
    }
  }
);

// ----------------- Slice -----------------
const lessonsSlice = createSlice({
  name: "lessons",
  initialState: {
    items: [],
    link: null,

    lessonsLoading: false,
    packageLoading: false,
    sessionLinkLoading: false,

    lessonsError: null,
    packageError: null,
    sessionLinkError: null,
  },
  reducers: {
    clearLessonsError: (state) => { state.lessonsError = null; },
    clearPackageError: (state) => { state.packageError = null; },
    clearSessionLinkError: (state) => { state.sessionLinkError = null; },
    clearSessionLink: (state) => { state.link = null; },
  },
  extraReducers: (builder) => {
    // ---- fetchLessons ----
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.lessonsLoading = true;
        state.lessonsError = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.lessonsLoading = false;
        let sessions = Array.isArray(action.payload) ? action.payload : [];

        // Expand delayed sessions into dated instances (keep originals if you intend to show both)
        const delayedSessions = sessions
          .filter((s) => !!s?.delay)
          .map((s) => ({
            ...s,
            day_of_week: s.delay.day_of_week,
            start_time: s.delay.start_time,
            session_date: getNextDateForDay(s.delay.day_of_week),
            delay: null,
          }));

        state.items = [...sessions, ...delayedSessions];
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.lessonsLoading = false;
        state.lessonsError = action.payload || action.error?.message || "Unknown error";
      });

    // ---- getSessionLink ----
    builder
      .addCase(getSessionLink.pending, (state) => {
        state.sessionLinkLoading = true;
        state.sessionLinkError = null;
      })
      .addCase(getSessionLink.fulfilled, (state, action) => {
        state.sessionLinkLoading = false;
        state.link = action.payload ?? null;
      })
      .addCase(getSessionLink.rejected, (state, action) => {
        state.sessionLinkLoading = false;
        state.sessionLinkError = action.payload || action.error?.message || "Unknown error";
      });

    // ---- getPackageLessons ----
    builder
      .addCase(getPackageLessons.pending, (state) => {
        state.packageLoading = true;
        state.packageError = null;
      })
      .addCase(getPackageLessons.fulfilled, (state /*, action*/) => {
        state.packageLoading = false;
        // If you need to store package lessons separately, add a field (e.g., state.packageItems)
      })
      .addCase(getPackageLessons.rejected, (state, action) => {
        state.packageLoading = false;
        state.packageError = action.payload || action.error?.message || "Unknown error";
      });
  },
});

export const {
  clearLessonsError,
  clearPackageError,
  clearSessionLinkError,
  clearSessionLink,
} = lessonsSlice.actions;

export default lessonsSlice.reducer;
