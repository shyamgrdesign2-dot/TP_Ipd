import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  obstetricDetails: {},
  isObstetricDetailsFetched: false,
  isPatientDiagnosisUpdated: false,
  isObstetricDetailsUpdated: false,
};

const obstetricSlice = createSlice({
  name: "obstetric",
  initialState,
  reducers: {
    resetObstetricState: () => initialState,
    addObstetricDetails: (state, action) => {
      if (action.payload?.examinationHistory?.length > 0) {
        let sortedData = [...action.payload.examinationHistory].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        action.payload.examinationHistory = sortedData;
      }
      state.obstetricDetails = action.payload;
      state.isObstetricDetailsFetched = true;
    },
    patientDiagnosisUpdated: (state) => {
      state.isPatientDiagnosisUpdated = true;
    },
    resetUpdatedPatientDiagnosis: (state) => {
      state.isPatientDiagnosisUpdated = false;
    },
    obstetricDetailsUpdated: (state) => {
      state.isObstetricDetailsUpdated = true;
    },
  },
});

export const {
  resetObstetricState,
  addObstetricDetails,
  patientDiagnosisUpdated,
  resetUpdatedPatientDiagnosis,
  obstetricDetailsUpdated,
} = obstetricSlice.actions;
export default obstetricSlice.reducer;
