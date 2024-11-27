import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { config } from '../../config/config';
import { startLoading, stopLoading } from '../spinner/spinnerSlice';

export const fetchDepartures = createAsyncThunk('tabellonePartenze/fetchDepartures', async ({ departureDate, departurePort }, { dispatch }) => {
  dispatch(startLoading('fetchDepartures'));
  const response = await fetch(`${config.basePath}/api/booking/route/departure?departure_data=${departureDate}&departure_port=${departurePort}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });
  const data = await response.json();
  dispatch(stopLoading('fetchDepartures'));
  return data;
});

const tabellonePartenzeSlice = createSlice({
  name: 'tabellonePartenze',
  initialState: {
    departures: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartures.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartures.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departures = action.payload;
      })
      .addCase(fetchDepartures.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default tabellonePartenzeSlice.reducer;