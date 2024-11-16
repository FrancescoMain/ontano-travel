import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchReservation, fetchReservationByCode } from "../../_api/bookingApi";

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

export const fetchReservationByCodeThunk = createAsyncThunk(
  "reservation/fetchReservationByCode",
  async (reservationCode, { rejectWithValue }) => {
    try {
      const response = await fetchReservationByCode(reservationCode);
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
  reducers: {
    resetReservation: (state) => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
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
      })
      .addCase(fetchReservationByCodeThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReservationByCodeThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchReservationByCodeThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetReservation } = reservationSlice.actions; // Export the reset action
export default reservationSlice.reducer;
