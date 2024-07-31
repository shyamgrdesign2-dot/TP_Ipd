import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  obstetricDetails: {},
  isObstetricDetailsFetched: false,
  isPatientDiagnosisUpdated: false,
  isObstetricDetailsUpdated: false,
  isNavigateToObstetric: false,
};

const obstetricSlice = createSlice({
  name: "obstetric",
  initialState,
  reducers: {
    resetObstetricState: () => initialState,
    addObstetricDetails: (state, action) => {
      if (action.payload?.examinationHistory?.length > 0) {
        let sortedData = [...action.payload.examinationHistory]
          .map((item, index) => ({
            ...item,
            originalIndex: index,
          }))
          .sort((a, b) => {
            const dateComparison = new Date(b.date) - new Date(a.date);
            if (dateComparison !== 0) {
              return dateComparison;
            }

            return b.originalIndex - a.originalIndex;
          })
          .map(({ originalIndex, ...item }) => item);

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
    navigateToObstetric: (state) => {
      state.isNavigateToObstetric = !state.isNavigateToObstetric;
    },
  },
});

export const {
  resetObstetricState,
  addObstetricDetails,
  patientDiagnosisUpdated,
  resetUpdatedPatientDiagnosis,
  obstetricDetailsUpdated,
  navigateToObstetric,
} = obstetricSlice.actions;
export default obstetricSlice.reducer;
