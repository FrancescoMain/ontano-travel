import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  results: [
    { id: 0, data: [] },
    { id: 1, data: [] },
  ],
  selected: [
    { id: 0, data: [] },
    { id: 1, data: [] },
  ],
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
    addSelected: (state, action) => {
      state.selected.push(action.payload);
    },
    removeSelected: (state, action) => {
      state.selected = state.selected.filter(
        (selected) => selected.id !== action.payload
      );
    },
    updateSelected: (state, action) => {
      state.selected = state.selected.map((selected) =>
        selected.id === action.payload.id ? action.payload : selected
      );
    },
    upsertSelected: (state, action) => {
      const index = state.selected.findIndex(
        (selected) => selected.id === action.payload.id
      );
      if (index !== -1) {
        // Se l'id è presente, aggiorna il valore
        state.selected[index] = action.payload;
      } else {
        // Se l'id non è presente, aggiungi un nuovo elemento
        state.selected.push(action.payload);
      }
    },
    resetSelected: (state, action) => {
      const index = state.selected.findIndex(
        (selected) => selected.id === action.payload.id
      );
      if (index !== -1) {
        // Se l'id è presente, resetta il valore
        state.selected[index] = { id: action.payload.id, data: [] };
      }
    },
    resetResults: (state) => {
      state.results = initialState.results;
    },
  },
});

export const {
  addResult,
  removeResult,
  updateResult,
  upsertResult,
  addSelected,
  removeSelected,
  updateSelected,
  upsertSelected,
  resetSelected,
  resetResults, // Export the new action
} = resultTrattaSlice.actions;

export default resultTrattaSlice.reducer;
