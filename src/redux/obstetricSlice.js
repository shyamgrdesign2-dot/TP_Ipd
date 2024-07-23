import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  obstetricDetails: {},
  isObstetricDetailsFetched: false,
  isPatientDiagnosisUpdated: false,
};

const obstetricSlice = createSlice({
  name: "obstetric",
  initialState,
  reducers: {
    resetObstetricState: () => initialState,
    addObstetricDetails: (state, action) => {
      state.obstetricDetails = action.payload;
      state.isObstetricDetailsFetched = true;
      state.isPatientDiagnosisUpdated = false;
    },
    patientDiagnosisUpdated: (state, isPatientDiagnosisUpdated) => {
      state.isPatientDiagnosisUpdated = isPatientDiagnosisUpdated;
    },
  },
});

export const {
  resetObstetricState,
  addObstetricDetails,
  patientDiagnosisUpdated,
} = obstetricSlice.actions;
export default obstetricSlice.reducer;
