import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeader, handleLogout } from "../../utils/auth"; // Import handleLogout
import { config } from "../../config/config";
import { startLoading, stopLoading } from "../spinner/spinnerSlice";

export const fetchAgenzie = createAsyncThunk(
  "ricercaAgenzia/fetchAgenzie",
  async ({ page, size, name, sort }, { dispatch }) => {
    dispatch(startLoading());
    try {
      const response = await axios.get(
        `${config.basePath}${
          config.fetchAgenzie.route
        }?page=${page}&size=${size}&name=${name || ""}&sort=${sort || ""}`,
        { headers: getAuthHeader() }
      );
      dispatch(stopLoading());
      return {
        data: response.data,
        totalCount: response.headers["x-total-count"],
        nameAgency: response.data.name_agency, // Added line
      };
    } catch (error) {
      dispatch(stopLoading());
      if (error.response && error.response.status === 401) {
        handleLogout();
        window.location.href = "/login"; // Redirect to login
      }
      throw error;
    }
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
    name: "",
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
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
        state.nameAgency = action.payload.nameAgency; // Added line
      })
      .addCase(fetchAgenzie.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setPage, setSize, setName } = ricercaAgenziaSlice.actions;

export default ricercaAgenziaSlice.reducer;
