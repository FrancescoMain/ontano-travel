import { createSlice } from "@reduxjs/toolkit";

const accountSlice = createSlice({
  name: "account",
  initialState: {
    data: null,
  },
  reducers: {
    setAccountData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setAccountData } = accountSlice.actions;
export default accountSlice.reducer;
