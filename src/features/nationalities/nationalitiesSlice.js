import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { config } from "../../config/config";
import axios from "axios";

export const fetchNationalities = createAsyncThunk(
  "nationalities/fetchNationalities",
  async () => {
    const response = await axios.get(
      `${config.basePath}${config.fetchNationalities.route}`
    );
    return response.data;
  }
);

const nationalitiesSlice = createSlice({
  name: "nationalities",
  initialState: {
    nationalities: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNationalities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNationalities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.nationalities = action.payload;
      })
      .addCase(fetchNationalities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default nationalitiesSlice.reducer;
