import { createSelector } from "@reduxjs/toolkit";

export const selectAuthLoading = (state) => state.auth.loading;
export const selectPackagesLoading = (state) => state.packages.loading;
export const selectGroupsLoading = (state) => state.groups.loading;
export const selectLessonsLoading = (state) => state.lessons.loading;
export const selectProfileLoading = (state) => state.profile.loading;
export const selectSubscriptionsLoading = (state) =>
  state.subscriptions.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectPackagesError = (state) => state.packages.error;
export const selectLessonsError = (state) => state.lessons.error;
export const selectGroupsError = (state) => state.groups.error;
export const selectProfileError = (state) => state.profile.error;
export const selectSubscriptionsError = (state) => state.subscriptions.error;


// Combine all slice loadings
export const selectGlobalLoading = createSelector(
  [
    selectAuthLoading,
    selectPackagesLoading,
    selectLessonsLoading,
    selectGroupsLoading,
    selectSubscriptionsLoading,
  ],
  (
    authLoading,
    packagesLoading,
    lessonsLoading,
    groupsLoading,
    subscriptionsLoading
  ) =>
    authLoading ||
    packagesLoading ||
    lessonsLoading ||
    groupsLoading ||
    subscriptionsLoading
);

export const selectGlobalError = createSelector(
  [
    selectAuthError,
    selectPackagesError,
    selectLessonsError,
    selectGroupsError,
    selectProfileError,
    selectSubscriptionsError,
  ],
  (
    authError,
    packagesError,
    lessonsError,
    groupsError,
    profileError,
    subscriptionsError
  ) =>
    authError ||
    packagesError ||
    lessonsError ||
    groupsError ||
    profileError ||
    subscriptionsError
);
