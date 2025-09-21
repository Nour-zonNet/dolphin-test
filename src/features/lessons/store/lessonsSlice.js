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
import { getNextDateForDay } from "@/utils/dateHelpers";
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

export const getPackageLessons = createAsyncThunk(
  "session/getPackageLessons",
  async (packageId, { rejectWithValue }) => {
    try {
      const { data } = await lessonsRepository.getPackageLessons(packageId);
      return data; // بيرجع الـ payload
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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

        // نبدأ بالـ sessions اللي جاية من الـ API
        let sessions = action.payload;

        // array لتجميع الـ sessions الجديدة اللي هتتولد من delays
        const delayedSessions = [];

        sessions.forEach((session) => {
          if (session.delay) {
            // نعمل نسخة جديدة من الـ session
            const delayedSession = {
              ...session,
              day_of_week: session.delay.day_of_week,
              start_time: session.delay.start_time,
              session_date: getNextDateForDay(session.delay.day_of_week),
              delay: null, // علشان الجلسة الجديدة مايبقاش ليها delay تاني
            };
            delayedSessions.push(delayedSession);
          }
        });

        // نجمع الـ sessions القديمة + الجديدة
        state.items = [...sessions, ...delayedSessions];
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getSessionLink.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessons.rejected, handleRejected)

      // get session link
      .addCase(getSessionLink.pending, handlePending)
      .addCase(getSessionLink.fulfilled, (state, action) => {
        state.loading = false;
        state.link = action.payload;
      })
      .addCase(getSessionLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPackageLessons.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(getPackageLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(getPackageLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLessonsError, clearSessionLink } = lessonsSlice.actions;
export default lessonsSlice.reducer;
