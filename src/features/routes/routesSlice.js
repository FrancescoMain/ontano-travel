import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  routes: [],
  fetch: false,
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setRoutes: (state, action) => {
      state.routes = action.payload;
    },
    setFetch: (state, action) => {
      state.fetch = action.payload;
    },
  },
});

export const { setRoutes, setFetch } = routesSlice.actions;

export default routesSlice.reducer;
