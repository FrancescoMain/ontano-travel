import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeader } from "../../utils/auth";
import { config } from "../../config/config";
import { startLoading, stopLoading } from "../spinner/spinnerSlice";

export const fetchDettaglioAgenzia = createAsyncThunk(
  "dettaglioAgenzia/fetchDettaglioAgenzia",
  async (id, { dispatch }) => {
    dispatch(startLoading());
    const url = id
      ? `${config.basePath}${config.fetchDettaglioAgenzia.route.replace(":id", id)}`
      : `${config.basePath}/api/booking/agency/get`;
    const response = await axios.get(url, { headers: getAuthHeader() });
    dispatch(stopLoading());
    return response.data;
  }
);

export const updateDettaglioAgenzia = createAsyncThunk(
  "dettaglioAgenzia/updateDettaglioAgenzia",
  async ({ id, data }, { dispatch }) => {
    dispatch(startLoading());
    const response = await axios.post(
      `${config.basePath}/api/booking/agency/${id}/update`,
      data,
      { headers: getAuthHeader() }
    );
    dispatch(stopLoading());
    return response.data;
  }
);

const dettaglioAgenziaSlice = createSlice({
  name: "dettaglioAgenzia",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDettaglioAgenzia.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDettaglioAgenzia.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDettaglioAgenzia.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateDettaglioAgenzia.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDettaglioAgenzia.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateDettaglioAgenzia.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default dettaglioAgenziaSlice.reducer;
