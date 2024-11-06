import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  port: { code: "", name: "" },
  date: null,
  tour: "",
  tours: [],
  dettagli: {
    0: { adulti: 1 },
  },
};

const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {
    setPort: (state, action) => {
      state.port = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setTour: (state, action) => {
      state.tour = action.payload;
    },
    setTours: (state, action) => {
      state.tours = action.payload;
    },
    setDettagli: (state, action) => {
      state.dettagli[action.payload.id] = action.payload.dettagli;
    },
    resetTour: () => initialState,
    resetTourDetails: (state) => {
      state.port = initialState.port;
      state.date = initialState.date;
      state.tour = initialState.tour;
      state.dettagli = initialState.dettagli;
    },
  },
});

export const {
  setPort,
  setDate,
  setTour,
  setTours,
  setDettagli,
  resetTour,
  resetTourDetails,
} = tourSlice.actions;
export default tourSlice.reducer;
