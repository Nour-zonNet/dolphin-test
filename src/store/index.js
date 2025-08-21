import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import packagesReducer from "@/features/packages/store/packagesSlice";
import lessonsReducer from "@/features/lessons/store/lessonsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    packages: packagesReducer,
    lessons: lessonsReducer,
  },
});
export default store;