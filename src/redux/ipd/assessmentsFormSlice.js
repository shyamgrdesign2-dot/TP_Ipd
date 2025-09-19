import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiAssessment from "../../api/services/ipd/ApiAssessment";

const initialState = {
  assessmentsData: {},
  assessmentsFilledByData: {},
  lastPrescriptionDate: null,
  lastPrescriptionDataForAssessment: {},
  loading: false,
  chiefComplaint: [],
  historyOfPresentIllness: [],
  labResults: [],
  physicalExaminationOthersData: [],
  physicalExaminationProvisionalDiagnosisData: [],
  physicalExaminationBasicData: {},
  functionalAssessmentData: {},
  treatmentPlanData: {},
  additionalNotesData: {},
  vitalsData: {},
  gynecHistoryData: {},
  referredDocForReview: null,
  gyneacHistoryBackup : {},
};

export const getAssessmentsData = createAsyncThunk(
  "assessment/getAssessmentsData",
  async (data) => {
    try {
      let result = {};
      result = await ApiAssessment.getAssessmentsData(data);
      if (!result.error) {
        return result;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);
export const addAssessmentsData = createAsyncThunk(
  "assessment/addAssessmentsData",
  async (data) => {
    try {
      let result = {};
      result = await ApiAssessment.addAssessmentsData(data);
      if (result.data?.length) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);
export const updateAssessmentsData = createAsyncThunk(
  "assessment/updateAssessmentsData",
  async (data) => {
    try {
      let result = {};
      result = await ApiAssessment.updateAssessmentsData(data);
      console.log('intel update',result)
      if (!!result.data) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      throw Error(error);
    }
  }
);
export const getLastPrescriptionDate = createAsyncThunk(
  "assessment/getLastPrescriptionDate",
  async (data) => {
    try {
      let result = {};
      result = await ApiAssessment.lastPrescriptionDate(data);
      return result;
      if (result.prescription) {
        return result.prescription;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);
export const lastPrescriptionData = createAsyncThunk(
  "assessment/lastPrescriptionData",
  async (data) => {
    try {
      let result = {};
      result = await ApiAssessment.lastPrescriptionData(data);
      if (result.prescription) {
        return result.prescription;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);
const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    resetAssessmentForm: () => initialState,
    setAssessmentsData: (state, action) => {
      state.assessmentsData = action.payload;
    },
    setChiefComplaint: (state, action) => {
      state.chiefComplaint = action.payload;
    },
    setHistoryOfPresentIllness: (state, action) => {
      state.historyOfPresentIllness = action.payload;
    },
    setLabResults: (state, action) => {
      state.labResults = action.payload;
    },
    setPhysicalExaminationOthersData: (state, action) => {
      state.physicalExaminationOthersData = action.payload;
    },
    setPhysicalExaminationProvisionalDiagnosisData: (state, action) => {
      state.physicalExaminationProvisionalDiagnosisData = action.payload;
    },
    setPhysicalExaminationBasicData: (state, action) => {
      state.physicalExaminationBasicData = action.payload;
    },
    setReferredDocForReview: (state, action) => {
      state.referredDocForReview = action.payload;
    },
    setFunctionalAssessmentData: (state, action) => {
      state.functionalAssessmentData = action.payload;
    },
    setTreatmentPlanData: (state, action) => {
      state.treatmentPlanData = action.payload;
    },
    setAdditionalNotesData: (state, action) => {
      state.additionalNotesData = action.payload;
    },
    setVitalsData: (state, action) => {
      state.vitalsData = action.payload;
    },
    setGynecHistoryData: (state, action) => {
      state.gynecHistoryData = action.payload;
    },
    setGyneacHistoryBackup: (state, action) => {
      state.gyneacHistoryBackup = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssessmentsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAssessmentsData.fulfilled, (state, action) => {
        state.loading = false;
        state.assessmentsData = action.payload.assessment;
        state.assessmentsFilledByData = {
          ...action.payload,
          assessment: undefined
        };
      })
      .addCase(getAssessmentsData.rejected, (state, action) => {
        state.assessmentsData = {};
        state.assessmentsFilledByData = {};
        state.loading = false;
      })
      .addCase(addAssessmentsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAssessmentsData.fulfilled, (state, action) => {
        state.loading = false;
        state.assessmentsData = action.payload;
      })
      .addCase(addAssessmentsData.rejected, (state, action) => {
        state.assessmentsData = [];
        state.loading = false;
      })
      .addCase(updateAssessmentsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAssessmentsData.fulfilled, (state, action) => {
        state.loading = false;
        state.assessmentsData = action.payload;
      })
      .addCase(updateAssessmentsData.rejected, (state, action) => {
        state.assessmentsData = [];
        state.loading = false;
      })
      .addCase(getLastPrescriptionDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLastPrescriptionDate.fulfilled, (state, action) => {
        state.loading = false;
        state.lastPrescriptionDate = action.payload;
      })
      .addCase(getLastPrescriptionDate.rejected, (state, action) => {
        state.lastPrescriptionDate = {};
        state.loading = false;
      })
      .addCase(lastPrescriptionData.pending, (state) => {
        state.loading = true;
      })
      .addCase(lastPrescriptionData.fulfilled, (state, action) => {
        state.loading = false;
        state.lastPrescriptionDataForAssessment = action.payload;
      })
      .addCase(lastPrescriptionData.rejected, (state, action) => {
        state.lastPrescriptionDataForAssessment = {};
        state.loading = false;
      });
  },
});

export const {
  setAssessmentsData,
  setChiefComplaint,
  setHistoryOfPresentIllness,
  setLabResults,
  setPhysicalExaminationOthersData,
  setPhysicalExaminationProvisionalDiagnosisData,
  setFunctionalAssessmentData,
  setTreatmentPlanData,
  setAdditionalNotesData,
  setVitalsData,
  setGynecHistoryData,
  setReferredDocForReview,
  setPhysicalExaminationBasicData,
  resetAssessmentForm,
  setGyneacHistoryBackup
} = assessmentSlice.actions;
export default assessmentSlice.reducer;
