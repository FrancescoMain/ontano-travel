import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { config } from "../../config/config";
import axios from "axios";

export const fetchDocumentTypes = createAsyncThunk(
  "documentTypes/fetchDocumentTypes",
  async () => {
    const response = await axios.get(
      `${config.basePath}${config.fetchDocumentTypes.route}`
    );
    return response.data;
  }
);

const documentTypesSlice = createSlice({
  name: "documentTypes",
  initialState: {
    documentTypes: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentTypes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDocumentTypes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.documentTypes = action.payload;
      })
      .addCase(fetchDocumentTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default documentTypesSlice.reducer;
