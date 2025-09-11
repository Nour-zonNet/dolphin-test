
import api from "@/services/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProfile, addBrother, fetchClasses, fetchBrothers, switchAccount, updateUserGradeApi, updateUserImageApi, logoutApi, updateProfileApi } from "../services/profileService";

export const getProfile = createAsyncThunk("profile/getProfile", async () => {
  return await fetchProfile();
});

export const addSibling = createAsyncThunk(
  "profile/addSibling",
  async (formData, { dispatch }) => {
    const result = await addBrother(formData);
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

export const switchUserAccount = createAsyncThunk(
  "profile/switchUserAccount",
  async (studentId, { rejectWithValue }) => {
    try {
      const userData = await switchAccount(studentId); // returns userData + token

      const brothers = await fetchBrothers();

      return { user: userData, brothers };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateUserImage = createAsyncThunk(
  "profile/updateUserImage",
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      const data = await updateUserImageApi(userId, file);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateUserGrade = createAsyncThunk(
  "profile/updateUserGrade",
  async ({ userId, gradeId }, { rejectWithValue }) => {
    try {
      const response = await updateUserGradeApi(userId, gradeId);
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const logout = createAsyncThunk(
  "profile/logout",
  async () => {
    try {
      await logoutApi(); 
    } catch (err) {
      console.warn("Logout API failed, continuing local logout:", err?.response?.data || err);
    }

    // Always clear locally
    localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      return true;
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      return await updateProfileApi(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
)
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
        state.classes = [];
        state.error = null;
        localStorage.removeItem("token");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       // update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile, addBrotherLocal } = profileSlice.actions;
export default profileSlice.reducer;