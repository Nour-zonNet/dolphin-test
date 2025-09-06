import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProfile, addBrother, fetchClasses, fetchBrothers, switchAccount } from "../services/profileService";

export const getProfile = createAsyncThunk("profile/getProfile", async () => {
  return await fetchProfile();
});

export const addSibling = createAsyncThunk(
  "profile/addSibling",
  async (siblingData, { dispatch }) => {
    const result = await addBrother(siblingData);
    // After adding, refresh profile
    dispatch(getProfile());
    return result;
  }
);

export const getClasses = createAsyncThunk("profile/getClasses", async () => {
  return await fetchClasses();
});

export const getBrothers = createAsyncThunk("profile/getBrothers", async () => {
  return await fetchBrothers();
});

// export const switchUserAccount = createAsyncThunk(
//   "profile/switchUserAccount",
//   async (studentId, { rejectWithValue }) => {
//     try {
//       const userData = await switchAccount(studentId); // returns userData
//       return userData;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

export const switchUserAccount = createAsyncThunk(
  "profile/switchUserAccount",
  async (studentId, { rejectWithValue }) => {
    try {
      const userData = await switchAccount(studentId); // returns userData + token

      const brothers = await fetchBrothers();

      return { ...userData, brothers };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addSibling.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getClasses.pending, (state) => {
        state.loadingClasses = true;
        state.classesError = null;
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.loadingClasses = false;
        state.classes = action.payload;
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.loadingClasses = false;
        state.classesError = action.error.message;
      })
      .addCase(getBrothers.pending, (state) => {
        state.loadingBrothers = true;
        state.brothersError = null;
      })
      .addCase(getBrothers.fulfilled, (state, action) => {
        state.loadingBrothers = false;
        state.brothers = action.payload;
      })
      .addCase(getBrothers.rejected, (state, action) => {
        state.loadingBrothers = false;
        state.brothersError = action.error.message;
      })
      .addCase(switchUserAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(switchUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
      })
      .addCase(switchUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
;
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
