import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authRepository } from "../services/auth.services";
import api from "@/services/api";

// 🔹 Generic handlers
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload || action.error?.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى";
};

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authRepository.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "فشل في تحميل بيانات المستخدم من الخادم"
      );
    }
  }
);

// Perform logout via API (best-effort), then clear client state/token regardless
export const performLogout = createAsyncThunk(
  "auth/performLogout",
  async (_, { dispatch }) => {
    try {
      await authRepository.logout();
    } catch {
      // ignore API errors on logout
    } finally {
      dispatch(logoutUser());
      // ensure related slices are reset
      // dispatch(clearProfile());
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authRepository.login(credentials);

      const token = response?.data?.data?.token || response?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "فشل في تسجيل الدخول. تحقق من البيانات المدخلة وحاول مرة أخرى"
      );
    }
  }
);

export const switchUserAccount = createAsyncThunk(
  "auth/switchUserAccount",
  async (studentId, { rejectWithValue }) => {
    try {
      const result = await authRepository.switchAccount(studentId); // { token, userData }

      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data || "فشل في تبديل الحساب. تأكد من صحة معرف الطالب");
    }
  }
);

export const updateUserImage = createAsyncThunk(
  "auth/updateUserImage",
  async (file, { rejectWithValue, dispatch }) => {
    try {
      const data = await authRepository.updateUserImage(file);
      await dispatch(fetchCurrentUser());
      return data;
    } catch (err) {
      console.error("Update user image error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "فشل في تحديث صورة المستخدم. تأكد من صحة الملف";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const result = await authRepository.updateUser(payload);
      await dispatch(fetchCurrentUser());
      return result;
    } catch (err) {
      return rejectWithValue(err.response?.data || "فشل في تحديث بيانات المستخدم. تحقق من البيانات المدخلة");
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
      return rejectWithValue(err.response.data.error || "فشل في إنشاء الحساب. تحقق من البيانات المدخلة");
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
      error.response?.data?.errors[0];
      return rejectWithValue(error.response?.data?.errors[0] || "فشل في التحقق من رقم الهاتف. تأكد من صحة الرقم");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authRepository.verifyOtp(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.error || "فشل في التحقق من رمز OTP. تأكد من صحة الرمز المدخل");
    }
  }
);

export const sendOtpResetPassword = createAsyncThunk(
  "auth/sendOtpResetPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authRepository.sendOtpResetPassword(credentials);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error || "فشل في إرسال رمز إعادة تعيين كلمة المرور");
    }
  }
);
export const verifyOtpResetPassword = createAsyncThunk(
  "auth/verifyOtpResetPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authRepository.verifyOtpResetPassword(credentials);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error || "فشل في التحقق من رمز إعادة تعيين كلمة المرور");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/ResetPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authRepository.resetPassword(credentials);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error || "فشل في إعادة تعيين كلمة المرور. تأكد من صحة البيانات");
    }
  }
);

export const addBrother = createAsyncThunk(
  "profile/addBrother",
  async (formData) => {
    const result = await authRepository.addBrother(formData);
    return result;
  }
);

export const disActiveAccount = createAsyncThunk(
  "profile/disActiveAccount",
  async (_, { rejectWithValue }) => {
    try {
      const result = await authRepository.disActiveAccount();
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.error || "فشل في إلغاء تفعيل الحساب. تأكد من صحة البيانات");
    }
  }
);
export const getBrothers = createAsyncThunk("profile/getBrothers", async () => {
  return await authRepository.getBrothers();
});

const savedToken = localStorage.getItem("token");
if (savedToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: savedToken || null,
    brothers: [],
    loading: false,
    error: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload); // ✅ persist token
      api.defaults.headers.common["Authorization"] = `Bearer ${action.payload}`;
    },
    logoutUser: () => {
      window.location.href = "/login";
    },
    addBrother: (state, action) => {
      state.brothers.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.userData; // البيانات كلها
        state.token = action.payload.data.token;
        localStorage.setItem("token", action.payload.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${action.payload.data.token}`;
      })
      .addCase(loginUser.rejected, handleRejected)

      .addCase(checkPhone.pending, handlePending)
      .addCase(checkPhone.fulfilled, (state) => {
        state.loading = false;
        state.phoneVerified = true;
      })
      .addCase(checkPhone.rejected, handleRejected)
      // ✅ register
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.userData;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${action.payload.token}`;
      })
      .addCase(registerUser.rejected, handleRejected)
      .addCase(verifyOtp.pending, handlePending)
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.phoneVerified = true;
      })
      .addCase(verifyOtp.rejected, handleRejected)
      // ✅ fetchCurrentUser
      .addCase(fetchCurrentUser.pending, handlePending)
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
        if (api?.defaults?.headers?.common?.Authorization) {
          delete api.defaults.headers.common["Authorization"];
        }
      })
      // switch account
      .addCase(switchUserAccount.pending, handlePending)
      .addCase(switchUserAccount.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.userData;
        state.brothers = payload.userData.brothers || [];
        state.token = payload.token;
        localStorage.setItem("token", payload.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${payload.token}`;
      })
      .addCase(switchUserAccount.rejected, handleRejected);
    // profile-related updates owned by auth (keep user in sync)
    builder
      .addCase(updateUserImage.pending, handlePending)
      .addCase(updateUserImage.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Updated user image:", action.payload);
      })
      .addCase(updateUserImage.rejected, handleRejected)

      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUser.rejected, handleRejected);
    // send OTP reset password
    builder
      .addCase(sendOtpResetPassword.pending, handlePending)
      .addCase(sendOtpResetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtpResetPassword.rejected, handleRejected);

    // verify OTP reset password
    builder
      .addCase(verifyOtpResetPassword.pending, handlePending)
      .addCase(verifyOtpResetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtpResetPassword.rejected, handleRejected);

    // reset password
    builder
      .addCase(resetPassword.pending, handlePending)
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, handleRejected);

    // perform logout
    builder
      .addCase(performLogout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        if (api?.defaults?.headers?.common?.Authorization) {
          delete api.defaults.headers.common["Authorization"];
        }
      })

      .addCase(getBrothers.pending, handlePending)
      .addCase(getBrothers.fulfilled, (state, action) => {
        state.loading = false;
        state.brothers = action.payload;
      })
      .addCase(getBrothers.rejected, handleRejected)

      .addCase(addBrother.pending, handlePending)
      .addCase(addBrother.fulfilled, (state, action) => {
        state.loading = false;
        state.brothers.push(action.payload.brother);
      })
      .addCase(addBrother.rejected, handleRejected)

      .addCase(disActiveAccount.pending, handlePending)
      .addCase(disActiveAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(disActiveAccount.rejected, handleRejected);
  },
});

export const { logoutUser, setToken } = authSlice.actions;
export default authSlice.reducer;
