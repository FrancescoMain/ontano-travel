import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { config } from '../../config/config';

export const fetchRoute = createAsyncThunk('route/fetchRoute', async () => {
  const response = await fetch(`${config.basePath}${config.getRoute.route}`, {
    method: config.getRoute.method,
  });
  const data = await response.json();
  const uniqueRoutes = [];
  const seen = new Set();

  data.forEach(route => {
    const key = `${route.from}-${route.codeFrom}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRoutes.push({
        from: route.from,
        codeFrom: route.codeFrom,
      });
    }
  });

  return uniqueRoutes;
});

const routeSlice = createSlice({
  name: 'route',
  initialState: {
    route: null,
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoute.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoute.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.route = action.payload;
      })
      .addCase(fetchRoute.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default routeSlice.reducer;
