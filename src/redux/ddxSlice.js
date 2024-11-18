import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isApexAISelected: false,
  isSymptomsBox: false,
  isLabTestBox: null,
  isDiagnosisBox: null,
  isDDxReadyToGenerate: false,
};

const ddxSlice = createSlice({
  name: "ddx",
  initialState,
  reducers: {
    resetDDxState: () => initialState,
    setIsApexAISelected: (state, action) => {
      state.isApexAISelected = action.payload;
    },
    setIsSymptomsBox: (state, action) => {
      state.isSymptomsBox = action.payload;
    },
    setIsLabTestBox: (state, action) => {
      state.isLabTestBox = action.payload;
    },
    setIsDiagnosisBox: (state, action) => {
      state.isDiagnosisBox = action.payload;
    },
    setIsDDxReadyToGenerate: (state, action) => {
      state.isDDxReadyToGenerate = action.payload;
    },
  },
});

export const {
  resetDDxState,
  setIsApexAISelected,
  setIsSymptomsBox,
  setIsLabTestBox,
  setIsDiagnosisBox,
  setIsDDxReadyToGenerate,
} = ddxSlice.actions;
export default ddxSlice.reducer;
