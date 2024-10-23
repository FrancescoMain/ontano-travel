import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  results: [],
};

export const resultTrattaSlice = createSlice({
  name: "resultTratta",
  initialState,
  reducers: {
    addResult: (state, action) => {
      state.results.push(action.payload);
    },
    removeResult: (state, action) => {
      state.results = state.results.filter(
        (result) => result.id !== action.payload
      );
    },
    updateResult: (state, action) => {
      state.results = state.results.map((result) =>
        result.id === action.payload.id ? action.payload : result
      );
    },
    upsertResult: (state, action) => {
      const index = state.results.findIndex(
        (result) => result.id === action.payload.id
      );
      if (index !== -1) {
        // Se l'id è presente, aggiorna il valore
        state.results[index] = action.payload;
      } else {
        // Se l'id non è presente, aggiungi un nuovo elemento
        state.results.push(action.payload);
      }
    },
  },
});

export const { addResult, removeResult, updateResult, upsertResult } =
  resultTrattaSlice.actions;

export default resultTrattaSlice.reducer;
