import { createSelector } from "@reduxjs/toolkit";

export const selectAuthLoading = (state) => state.auth.loading;
export const selectUsersLoading = (state) => state.packages.loading;
export const selectPostsLoading = (state) => state.lessons.loading;

// Combine all slice loadings
export const selectGlobalLoading = createSelector(
  [selectAuthLoading, selectUsersLoading, selectPostsLoading],
  (authLoading, usersLoading, postsLoading) =>
    authLoading || usersLoading || postsLoading
);
