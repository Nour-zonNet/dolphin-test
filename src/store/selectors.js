import { createSelector } from "@reduxjs/toolkit";

export const selectAuthLoading = (state) => state.auth.loading;
export const selectPackagesLoading = (state) => state.packages.loading;
export const selectLessonsLoading = (state) => state.lessons.loading;
export const selectGroupsLoading = (state) => state.groups.loading;
export const selectSubscriptionsLoading = (state) =>
  state.subscriptions.loading;

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
