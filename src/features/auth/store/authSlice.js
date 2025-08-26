import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authRepository } from "../services/auth.services";

export const fetchCurrentUser = createAsyncThunk(
  "auth/currentUser",
  async () => {
    const response = await authRepository.getProfile();
    return response.data;
  }
);

export const loginUser = createAsyncThunk("auth/login", async (credentials) => {
  return await authRepository.login(credentials);
});

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authRepository.register(userData);

      if (response.success) {
        return response.data; // هترجع بيانات المستخدم + token
      } else {
        return rejectWithValue(response.message);
      }
    } catch (err) {
      console.log(err.response.data.errors[0])
      return rejectWithValue(err.response.data.errors[0]|| "Server error");
    }
  }
);

export const checkPhone = createAsyncThunk(
  "auth/checkPhone",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authRepository.checkPhone(credentials);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Server error");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authRepository.verifyOtp( data );
      if (response.success) {
        return response;
      } else {
        console.log(response);
        return rejectWithValue(response.message);
      }
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data?.message || "Server error");
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
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
