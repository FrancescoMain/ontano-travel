import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  loadingId: -1,
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
    setLoadingId: (state, action) => {
      state.loadingId = action.payload;
    },
  },
});

export const { startLoading, stopLoading, setLoadingId } = spinnerSlice.actions;

export default spinnerSlice.reducer;
