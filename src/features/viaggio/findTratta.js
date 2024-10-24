import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tratte: [
    {
      id: 0,
      tratta: {},
      trattaFormatted: [],
    },
  ],
  date: [{ id: 0, date: "", dateFormatted: "" }],
  dettagli: [
    {
      id: 0,
      adulti: 1,
      etaBambini: [],
      bambini: 0,
      animali: 0,
      bagagli: 0,
    },
    {
      id: 1,
      adulti: 1,
      etaBambini: [],
      bambini: 0,
      animali: 0,
      bagagli: 0,
    },
    // fino a 10
    {
      id: 2,
      adulti: 1,
      etaBambini: [],
      bambini: 0,
      animali: 0,
      bagagli: 0,
    },
    {
      id: 3,
      adulti: 1,
      etaBambini: [],
      bambini: 0,
      animali: 0,
      bagagli: 0,
    },
    {
      id: 4,
      adulti: 1,
      etaBambini: [],
      bambini: 0,
      animali: 0,
      bagagli: 0,
    },
    {
      id: 5,
      adulti: 1,
      etaBambini: [],
      bambini: 0,
      animali: 0,
      bagagli: 0,
    },
    // fino a 10
    {
      id: 6,
      adulti: 1,
      etaBambini: [],
      bambini: 0,
      animali: 0,
      bagagli: 0,
    },
    {
      id: 7,
      adulti: 1,
      etaBambini: [],
      bambini: 0,
      animali: 0,
      bagagli: 0,
    },
    {
      id: 8,
      adulti: 1,
      etaBambini: [],
      bambini: 0,
      animali: 0,
      bagagli: 0,
    },
    {
      id: 9,
      adulti: 1,
      etaBambini: [],
      bambini: 0,
      animali: 0,
      bagagli: 0,
    },
  ],
  multitratta: true,
};

export const viaggioSlice = createSlice({
  name: "viaggio",
  initialState,
  reducers: {
    addTratta: (state, action) => {
      state.tratte.push(action.payload);
    },
    removeTratta: (state, action) => {
      state.tratte = state.tratte.filter(
        (tratta) => tratta.id !== action.payload
      );
    },
    updateTratta: (state, action) => {
      state.tratte = state.tratte.map((tratta) =>
        tratta.id === action.payload.id ? action.payload : tratta
      );
    },
    upsertTratta: (state, action) => {
      const index = state.tratte.findIndex(
        (tratta) => tratta.id === action.payload.id
      );
      if (index !== -1) {
        // Se l'id è presente, aggiorna il valore
        state.tratte[index] = action.payload;
      } else {
        // Se l'id non è presente, aggiungi un nuovo elemento
        state.tratte.push(action.payload);
      }
    },

    addDate: (state, action) => {
      state.date.push(action.payload);
    },
    removeDate: (state, action) => {
      state.date = state.date.filter((date) => date.id !== action.payload);
    },
    updateDate: (state, action) => {
      state.date = state.date.map((date) =>
        date.id === action.payload.id ? action.payload : date
      );
    },
    upsertDate: (state, action) => {
      const index = state.date.findIndex(
        (date) => date.id === action.payload.id
      );
      if (index !== -1) {
        // Se l'id è presente, aggiorna il valore
        state.date[index] = action.payload;
      } else {
        // Se l'id non è presente, aggiungi un nuovo elemento
        state.date.push(action.payload);
      }
    },

    addDettagli: (state, action) => {
      state.dettagli.push(action.payload);
    },
    updateDettagli: (state, action) => {
      state.dettagli = state.dettagli.map((dettagli) =>
        dettagli.id === action.payload.id ? action.payload : dettagli
      );
    },
    removeDettagli: (state, action) => {
      state.dettagli = state.dettagli.filter(
        (dettagli) => dettagli.id !== action.payload
      );
    },
    upsertDettagli: (state, action) => {
      const index = state.dettagli.findIndex(
        (dettagli) => dettagli.id === action.payload.id
      );
      if (index !== -1) {
        // Se l'id è presente, aggiorna solo i campi specificati mantenendo gli altri invariati
        state.dettagli[index] = { ...state.dettagli[index], ...action.payload };
      } else {
        // Se l'id non è presente, aggiungi un nuovo elemento
        state.dettagli.push(action.payload);
      }
    },
    setMultitratta: (state, action) => {
      state.multitratta = action.payload;
    },
  },
});

export const {
  addTratta,
  removeTratta,
  upsertTratta,
  addDate,
  removeDate,
  updateDate,
  upsertDate,
  addDettagli,
  updateDettagli,
  removeDettagli,
  upsertDettagli,
  setMultitratta,
} = viaggioSlice.actions;

export default viaggioSlice.reducer;
