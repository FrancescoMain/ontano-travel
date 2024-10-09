import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trattaAndata: "",
  trattaRitorno: "",
  dataAndata: "",
  dataRitorno: "",
  adulti: 1,
  bambini: 0,
  etaBambini: [],
  soloAndata: false,
  animali: 0,
  bagagli: 0,
};

export const viaggioSlice = createSlice({
  name: "viaggio",
  initialState,
  reducers: {
    setTrattaAndata: (state, action) => {
      state.trattaAndata = action.payload;
    },
    setTrattaRitorno: (state, action) => {
      state.trattaRitorno = action.payload;
    },
    setDataAndata: (state, action) => {
      state.dataAndata = action.payload;
    },
    setDataRitorno: (state, action) => {
      state.dataRitorno = action.payload;
    },
    setAdulti: (state, action) => {
      state.adulti = action.payload;
    },
    setBambini: (state, action) => {
      state.bambini = action.payload;
    },
    setEtaBambini: (state, action) => {
      state.etaBambini = action.payload;
    },
    setSoloAndata: (state, action) => {
      state.soloAndata = action.payload;
    },
    resetFormViaggio: (state) => {
      state.trattaAndata = "";
      state.trattaRitorno = "";
      state.dataAndata = "";
      state.dataRitorno = "";
      state.adulti = 1;
      state.bambini = 0;
      state.etaBambini = [];
      state.soloAndata = false;
      state.animali = 0;
      state.bagagli = 0;
    },
    setAnimali: (state, action) => {
      state.animali = action.payload;
    },
    setBagagli: (state, action) => {
      state.bagagli = action.payload;
    },
  },
});

export const {
  setSoloAndata,
  resetFormViaggio,
  setTrattaAndata,
  setTrattaRitorno,
  setDataAndata,
  setDataRitorno,
  setAdulti,
  setBambini,
  setEtaBambini,
  setAnimali,
  setBagagli,
} = viaggioSlice.actions;

export default viaggioSlice.reducer;
