import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { lessonsRepository } from "../services/lessons.services";

// ---------- helpers ----------
const handleError = (err, thunkAPI) => {
  const msg =
    err?.response?.data?.error ||
    err?.response?.data ||
    err?.message ||
    "Unknown error";
  return thunkAPI.rejectWithValue(msg);
};

// ---------- thunks ----------
export const fetchLessons = createAsyncThunk(
  "lessons/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await lessonsRepository.getAll();
      return res.data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

export const getSessionLink = createAsyncThunk(
  "lessons/getSessionLink",
  async (roomUId, thunkAPI) => {
    try {
      const { data } = await lessonsRepository.getSessionLink(roomUId);
      return data;
    } catch (err) {
      return handleError(err, thunkAPI);
    }
  }
);

// ---------- slice ----------
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
        state.items = action.payload || [];
      })
      .addCase(fetchLessons.rejected, handleRejected)

      // get session link
      .addCase(getSessionLink.pending, handlePending)
      .addCase(getSessionLink.fulfilled, (state, action) => {
        state.loading = false;
        state.link = action.payload;
      })
      .addCase(getSessionLink.rejected, handleRejected);
  },
});

export const { clearLessonsError, clearSessionLink } = lessonsSlice.actions;
export default lessonsSlice.reducer;
