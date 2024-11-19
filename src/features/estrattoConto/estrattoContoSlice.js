import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthHeader } from '../../utils/auth';
import { config } from '../../config/config'; // Import config

export const fetchEstrattoConto = createAsyncThunk(
  'estrattoConto/fetchEstrattoConto',
  async () => {
    const response = await axios.get(`${config.basePath}${config.fetchEstrattoConto.route}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
);

const estrattoContoSlice = createSlice({
  name: 'estrattoConto',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstrattoConto.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEstrattoConto.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchEstrattoConto.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default estrattoContoSlice.reducer;
