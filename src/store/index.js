import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import packagesReducer from "@/features/packages/store/packagesSlice";
import lessonsReducer from "@/features/lessons/store/lessonsSlice";
import subscriptionsReducer from "@/features/subscription/store/subscriptionSlice";
import groupsReducer from "@/features/groups/store/groupSlice";
import modalSlice from "./modalSlice";
import profileReducer from "@/features/profile/store/profileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    packages: packagesReducer,
    lessons: lessonsReducer,
    modal: modalSlice,
    subscriptions: subscriptionsReducer,
    groups: groupsReducer,
    profile: profileReducer,
  },
});
export default store;
