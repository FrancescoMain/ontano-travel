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
} = viaggioSlice.actions;

export default viaggioSlice.reducer;
