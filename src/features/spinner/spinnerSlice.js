import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loadingIds: [],
};

export const spinnerSlice = createSlice({
  name: "spinner",
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.loadingIds.push(action.payload);
    },
    stopLoading: (state, action) => {
      state.loadingIds = state.loadingIds.filter(id => id !== action.payload);
    },
  },
});

export const { startLoading, stopLoading } = spinnerSlice.actions;

export default spinnerSlice.reducer;
