import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  routes: [],
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setRoutes: (state, action) => {
      state.routes = action.payload;
    },
  },
});

export const { setRoutes } = routesSlice.actions;

export default routesSlice.reducer;
