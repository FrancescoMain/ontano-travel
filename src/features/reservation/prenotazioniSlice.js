import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeader } from "../../utils/auth";
import { config } from "../../config/config";
import { startLoading, stopLoading } from "../spinner/spinnerSlice";

export const searchReservations = createAsyncThunk(
  "prenotazioni/searchReservations",
  async (queryParams, { dispatch }) => {
    dispatch(startLoading());
    const response = await axios.get(
      `${config.basePath}${config.searchReservations.route}`,
      {
        params: queryParams,
        headers: {
          ...getAuthHeader(),
          accept: "application/json",
        },
      }
    );
    dispatch(stopLoading());
    return {
      data: response.data,
      totalCount: response.headers["x-total-count"],
    };
  }
);

const prenotazioniSlice = createSlice({
  name: "prenotazioni",
  initialState: {
    reservations: [],
    status: "idle",
    error: null,
    totalCount: 0,
    page: 0,
    size: 20,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchReservations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchReservations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reservations = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(searchReservations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setPage, setSize } = prenotazioniSlice.actions;

export default prenotazioniSlice.reducer;
