import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import packagesReducer from "@/features/packages/store/packagesSlice";
import lessonsReducer from "@/features/lessons/store/lessonsSlice";
import modalSlice from "./modalSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    packages: packagesReducer,
    lessons: lessonsReducer,
    modal : modalSlice ,
  },
});
export default store;