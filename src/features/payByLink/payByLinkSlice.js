import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  link: null,
  expiration: null,
  reservationId: null,
};

const payByLinkSlice = createSlice({
  name: "payByLink",
  initialState,
  reducers: {
    setPayByLink(state, action) {
      state.link = action.payload.link;
      state.expiration = action.payload.expiration;
      state.reservationId = action.payload.reservationId;
    },
    clearPayByLink(state) {
      state.link = null;
      state.expiration = null;
      state.reservationId = null;
    },
  },
});

export const { setPayByLink, clearPayByLink } = payByLinkSlice.actions;
export default payByLinkSlice.reducer;
