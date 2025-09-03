// src/features/groups/store/groupSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Reuse existing API until a dedicated groups repository is added
import { groupsRepository } from "../services/groups.services";

// Thunks
export const fetchGroupsByPackageId = createAsyncThunk(
  "groups/fetchByPackageId",
  async (packageId) => {

    const res = await groupsRepository.getByPackageId(packageId);
    return { packageId, groups: res.data };
  }
);

const groupSlice = createSlice({
  name: "groups",
  initialState: {
    items: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupsByPackageId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupsByPackageId.fulfilled, (state, action) => {
        state.loading = false;
        const { packageId, groups } = action.payload;
        state.items[packageId] = groups;
      })
      .addCase(fetchGroupsByPackageId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Selectors
export const selectGroupsState = (state) => state.groups;
export const selectGroupsByPackageId = (state, packageId) =>
  state.groups.items[packageId] || [];
export const selectGroupsLoading = (state) => state.groups.loading;
export const selectGroupsError = (state) => state.groups.error;

export default groupSlice.reducer;


