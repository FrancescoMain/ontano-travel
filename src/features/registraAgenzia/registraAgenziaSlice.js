import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { config } from "../../config/config";
import { startLoading, stopLoading } from "../spinner/spinnerSlice";

export const postAgency = createAsyncThunk(
  "registraAgenzia/postAgency",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());

      // Clean the payload: remove confirmPassword and termsAccepted (frontend-only fields)
      // Keep referente even if empty (backend requires it)
      const { confirmPassword, termsAccepted, ...payload } = formData;

      const response = await axios.post(
        `${config.basePath}${config.postAgency.route}`,
        payload
      );
      dispatch(stopLoading());
      return response.data;
    } catch (error) {
      dispatch(stopLoading());
      return rejectWithValue(error.response.data);
    }
  }
);

const registraAgenziaSlice = createSlice({
  name: "registraAgenzia",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postAgency.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(postAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = registraAgenziaSlice.actions;
export default registraAgenziaSlice.reducer;
