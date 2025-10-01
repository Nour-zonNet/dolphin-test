import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lessonsRepository } from "../services/lessons.services";

// ----------------- Thunks -----------------
export const fetchLessons = createAsyncThunk(
  "lessons/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await lessonsRepository.getAll();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Fetch lessons failed"
      );
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
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Fetch package lessons failed"
      );
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
      return rejectWithValue(
        error?.response?.data || error?.message || "Fetch session link failed"
      );
    }
  }
);

export const getContentsBySessionId = createAsyncThunk(
  "lessons/getContentsBySessionId",
  async (sessionId, { rejectWithValue }) => {
    try {
      const { data } = await lessonsRepository.getContentsBySessionId(
        sessionId
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Fetch contents by session id failed"
      );
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
    clearSessionLinkError: (state) => {
      state.error = null;
    },
    clearSessionLink: (state) => {
      state.link = null;
    },
    clearContentsBySessionIdError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ---- fetchLessons ----
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.loading = false;
        let sessions = Array.isArray(action.payload) ? action.payload : [];

        // Expand delayed sessions into dated instances (keep originals if you intend to show both)

        state.items = [...sessions];
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.lessonsError =
          action.payload || action.error?.message || "Unknown error";
      });

    // ---- getContentsBySessionId ----
    builder
      .addCase(getContentsBySessionId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContentsBySessionId.fulfilled, (state, action) => {
        console.log(action);
        state.loading = false;
      })
      .addCase(getContentsBySessionId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload.error ||
          action.error?.message ||
          "خطا فى جلب محتويات الجلسة";
      });

    // ---- getSessionLink ----
    builder
      .addCase(getSessionLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSessionLink.fulfilled, (state, action) => {
        state.loading = false;
        state.link = action.payload ?? null;
      })
      .addCase(getSessionLink.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload.error ||
          action.error?.message ||
          "خطا فى جلب رابط الجلسة";
      });

    // ---- getPackageLessons ----
    builder
      .addCase(getPackageLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPackageLessons.fulfilled, (state /*, action*/) => {
        state.loading = false;
        // If you need to store package lessons separately, add a field (e.g., state.packageItems)
      })
      .addCase(getPackageLessons.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Unknown error";
      });
  },
});
export default lessonsSlice.reducer;
