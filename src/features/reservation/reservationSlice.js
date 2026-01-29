import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchReservation, fetchReservationByCode, sendRefundRequest } from "../../_api/bookingApi";

export const fetchReservationThunk = createAsyncThunk(
  "reservation/fetchReservation",
  async ({ bookingCode, email }, { rejectWithValue }) => {
    try {
      const response = await fetchReservation(bookingCode, email);
      return { data: response, email }; // Return both data and email
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

export const requestRefund = createAsyncThunk(
  "reservation/requestRefund",
  async ({ routeId, amount, executeRefund, reservationCode }, { dispatch, rejectWithValue }) => {
    try {
      const response = await sendRefundRequest(routeId, {
        amount,
        executeRefund,
      });
      // Dispatch fetchReservationByCodeThunk to refresh the reservation data
      dispatch(fetchReservationByCodeThunk(reservationCode));
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
    guestEmail: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetReservation: (state) => {
      state.data = null;
      state.guestEmail = null;
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
        state.data = action.payload.data;
        state.guestEmail = action.payload.email;
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
      })
      .addCase(requestRefund.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestRefund.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(requestRefund.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetReservation } = reservationSlice.actions; // Export the reset action
export default reservationSlice.reducer;
