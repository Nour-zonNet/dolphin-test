import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileRepository } from "../services/profileService";

// Get profile
export const getProfile = createAsyncThunk("profile/getProfile", async () => {
  return await profileRepository.getProfile();
});

// Add sibling
export const addSibling = createAsyncThunk(
  "profile/addSibling",
  async (siblingData, { dispatch }) => {
    const result = await profileRepository.addBrother(siblingData);
    dispatch(getProfile()); // refresh profile
    return result;
  }
);

// Get classes
export const getClasses = createAsyncThunk("profile/getClasses", async () => {
  return await profileRepository.getClasses();
});

// Get brothers
export const getBrothers = createAsyncThunk("profile/getBrothers", async () => {
  return await profileRepository.getBrothers();
});

// Switch account
export const switchUserAccount = createAsyncThunk(
  "profile/switchUserAccount",
  async (studentId, { rejectWithValue }) => {
    try {
      const userData = await profileRepository.switchAccount(studentId);
      const brothers = await profileRepository.getBrothers();
      return { user: userData, brothers };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update image
export const updateUserImage = createAsyncThunk(
  "profile/updateUserImage",
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      return await profileRepository.updateUserImage(userId, file);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update grade
export const updateUserGrade = createAsyncThunk(
  "profile/updateUserGrade",
  async ({ userId, gradeId }, { rejectWithValue }) => {
    try {
      return await profileRepository.updateUserGrade(userId, gradeId);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Logout
export const logout = createAsyncThunk("profile/logout", async () => {
  await profileRepository.logout();
  return true;
});

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    brothers: [],
    classes: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.user = null;
      state.error = null;
    },
    addBrotherLocal: (state, action) => {
      state.brothers.push(action.payload);
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
        state.loading = true;
        state.error = null;
      })
      .addCase(getClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(getClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getBrothers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrothers.fulfilled, (state, action) => {
        state.loading = false;
        state.brothers = action.payload;
      })
      .addCase(getBrothers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(switchUserAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(switchUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          const timestamp = new Date().getTime();
          state.user = {
            ...action.payload.user,
            profilePicture: `${action.payload.user.profilePicture}?t=${timestamp}`,
          };
        }
        if (action.payload.brothers) {
          state.brothers = action.payload.brothers.map((bro) => ({
            ...bro,
            profilePicture: bro.profilePicture
              ? `${bro.profilePicture}?t=${new Date().getTime()}`
              : bro.profilePicture,
          }));
        }
      })
      .addCase(switchUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update grade
      .addCase(updateUserGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserGrade.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.gradeName = action.payload.gradeName;
        }
      })
      .addCase(updateUserGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile image
      .addCase(updateUserImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && action.payload) {
          const timestamp = new Date().getTime();
          // Update the user with new data from API
          state.user = {
            ...state.user,
            ...action.payload,
            profilePicture: `${action.payload.profilePicture}?t=${timestamp}`,
          };

          // Update brothers images
          state.brothers = state.brothers?.map((bro) => ({
            ...bro,
            profilePicture: bro.profilePicture
              ? `${bro.profilePicture}?t=${new Date().getTime()}`
              : bro.profilePicture,
          }));
        }
      })
      .addCase(updateUserImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.brothers = [];
        state.error = null;
        localStorage.removeItem("token");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile ,addBrotherLocal} = profileSlice.actions;

export default profileSlice.reducer;