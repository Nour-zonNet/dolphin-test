import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import packagesReducer from "@/features/packages/store/packagesSlice";
import lessonsReducer from "@/features/lessons/store/lessonsSlice";
import subscriptionsReducer from "@/features/managesubscription/store/subscriptionSlice";
import modalSlice from "./modalSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    packages: packagesReducer,
    lessons: lessonsReducer,
    modal : modalSlice ,
    subscriptions: subscriptionsReducer,
  },
});
export default store;