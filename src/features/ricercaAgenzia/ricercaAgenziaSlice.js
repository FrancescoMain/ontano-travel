import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeader } from "../../utils/auth";
import { config } from "../../config/config";
import { startLoading, stopLoading } from "../spinner/spinnerSlice";

export const fetchAgenzie = createAsyncThunk(
  "ricercaAgenzia/fetchAgenzie",
  async ({ page, size }, { dispatch }) => {
    dispatch(startLoading());
    const response = await axios.get(
      `${config.basePath}${config.fetchAgenzie.route}?page=${page}&size=${size}`,
      { headers: getAuthHeader() }
    );
    dispatch(stopLoading());
    return {
      data: response.data,
      totalCount: response.headers["x-total-count"],
    };
  }
);

const ricercaAgenziaSlice = createSlice({
  name: "ricercaAgenzia",
  initialState: {
    agenzie: [],
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
      .addCase(fetchAgenzie.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAgenzie.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.agenzie = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchAgenzie.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setPage, setSize } = ricercaAgenziaSlice.actions;

export default ricercaAgenziaSlice.reducer;
