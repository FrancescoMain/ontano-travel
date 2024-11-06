import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchReservation } from "../../_api/bookingApi";

export const fetchReservationThunk = createAsyncThunk(
  "reservation/fetchReservation",
  async ({ bookingCode, email }, { rejectWithValue }) => {
    try {
      const response = await fetchReservation(bookingCode, email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reservationSlice = createSlice({
  name: "reservation",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservationThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReservationThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchReservationThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default reservationSlice.reducer;
