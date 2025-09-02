// src/store/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: { type: null, props: {} },
  reducers: {
    openModal: (state, action) => {
      state.type = action.payload.type;
      state.props = action.payload.props || {};
    },
    closeModal: (state) => {
      state.type = null;
      state.props = {};
    },
    // Keep backward compatibility
    showModal: (state, action) => {
      state.type = action.payload.type;
      state.props = action.payload.props || {};
    },
    hideModal: (state) => {
      state.type = null;
      state.props = {};
    },
  },
});

export const { openModal, closeModal, showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
