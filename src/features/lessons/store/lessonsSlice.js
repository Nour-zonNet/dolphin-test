// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { lessonsRepository } from "../services/lessons.services";

// export const fetchLessons = createAsyncThunk(
//   "lessons/fetch",
//   async (_, { rejectWithValue }) => {
//     const res = await lessonsRepository.getAll();
//     try {
//       return res.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const getSessionLink = createAsyncThunk(
//   "session/getSessionLink",
//   async (roomUId, { rejectWithValue }) => {
//     try {
//       const { data } = await lessonsRepository.getSessionLink(roomUId);
//       return data; // بيرجع الـ payload
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const lessonsSlice = createSlice({
//   name: "lessons",
//   initialState: {
//     items: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchLessons.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchLessons.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchLessons.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       .addCase(getSessionLink.pending, (state) => {
//         // state.loading = true;
//         state.error = null;
//       })
//       .addCase(getSessionLink.fulfilled, (state, action) => {
//         state.loading = false;
//         state.link = action.payload;
//       })
//       .addCase(getSessionLink.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default lessonsSlice.reducer;

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
