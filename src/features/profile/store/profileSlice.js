import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProfile } from "../services/profileService";

export const getProfile = createAsyncThunk("profile/getProfile", async () => {
  return await fetchProfile();
});

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
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
