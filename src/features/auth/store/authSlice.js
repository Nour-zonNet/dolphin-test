import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authRepository } from "../services/auth.services";
import api from "@/services/api";
import { fetchAllPackages, fetchMyPackages } from "@/features/packages/store/packagesSlice";
import { fetchLessons } from "@/features/lessons/store/lessonsSlice";
import { fetchSubscriptions } from "@/features/subscription/store/subscriptionSlice";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authRepository.getProfile();
      return response.data;
    } catch (error) {
      console.log(error.response.data.errors[0]);
      return rejectWithValue(
        error.response?.data?.errors[0] || "Failed to fetch user"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await authRepository.login(credentials);

      // Persist token immediately so subsequent requests are authorized
      const token = response?.data?.data?.token || response?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      // Bootstrap data after login
      try {
        await Promise.all([
          dispatch(fetchAllPackages()),
          dispatch(fetchMyPackages()),
          dispatch(fetchLessons()),
          dispatch(fetchSubscriptions()),
        ]);
      } catch {
        // Ignore bootstrap errors here; individual slices handle their own errors
      }

      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.error || "Login failed. Please try again."
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authRepository.register(userData);

      return response.data; // هترجع بيانات المستخدم + token
    } catch (err) {
      console.log(err);
      console.log(err.response.data.error);
      return rejectWithValue(err.response.data.error || "Server error");
    }
  }
);

export const checkPhone = createAsyncThunk(
  "auth/checkPhone",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authRepository.checkPhone(credentials);

      return response;
    } catch (error) {
      console.log(error);
      error.response?.data?.errors[0];
      return rejectWithValue(error.response?.data?.errors[0] || "Server error");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authRepository.verifyOtp(data);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error || "Server error");
    }
  }
);
// --- Load token from localStorage when app starts
const savedToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: savedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token"); // remove token
      authRepository.logout(); // call backend logout if needed
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.userData; // البيانات كلها
        state.token = action.payload.data.token;
        localStorage.setItem("token", action.payload.data.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(checkPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPhone.fulfilled, (state) => {
        state.loading = false;
        state.phoneVerified = true;
      })
      .addCase(checkPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      }) // ✅ register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.userData;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.phoneVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      }) // ✅ fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // هنا بيرجع user من الـ API
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.user = null;
        state.token = null; // ممكن تمسح التوكن لو API رجع unauthorized
        localStorage.removeItem("token");
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
