import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

export const spinnerSlice = createSlice({
  name: "spinner",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { startLoading, stopLoading } = spinnerSlice.actions;

export default spinnerSlice.reducer;
