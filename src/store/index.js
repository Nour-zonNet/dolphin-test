import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import packagesReducer from "@/features/packages/store/packagesSlice";
import lessonsReducer from "@/features/lessons/store/lessonsSlice";
import subscriptionsReducer from "@/features/subscription/store/subscriptionSlice";
import contentReducer from "@/features/lessons/store/contentSlice";
import groupsReducer from "@/features/groups/store/groupSlice";
import modalSlice from "./modalSlice";
import profileReducer from "@/features/profile/store/profileSlice";
import classesReducer from "./classesSlice";
import complaintsReducer from "@/features/complaints/store/complaintsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    packages: packagesReducer,
    lessons: lessonsReducer,
    modal: modalSlice,
    subscriptions: subscriptionsReducer,
    content: contentReducer,
    groups: groupsReducer,
    profile: profileReducer,
    classes: classesReducer,
    complaints: complaintsReducer,
  },
});
export default store;
