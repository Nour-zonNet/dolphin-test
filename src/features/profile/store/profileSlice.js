import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileRepository } from "../services/profileService";


export const getClasses = createAsyncThunk("profile/getClasses", async () => {
  return await profileRepository.getClasses();
});


const profileSlice = createSlice({
  name: "profile",
  initialState: {
    brothers: [],
    classes: [],
    loading: false,
    error: null,
  },
  reducers: {
 
    addBrotherLocal: (state, action) => {
      state.brothers.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Reusable handle
    builder

     
    // When switchUserAccount fulfills, refresh brothers list here if needed
    // updates moved to auth slice
  },
});

export const {  addBrotherLocal } = profileSlice.actions;
export default profileSlice.reducer;
