import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiPrescription from "../api/services/ApiPrescription";
import { getGynecDetails } from "../api/services/ApiGynec";

const initialState = {
  medicationData: [],
  pillupSwitch: true,
  labParamsData:
    [
      {
        date: "2025-06-23",
        createdAt: "2025-06-23",
        inputs: [
          {
            reportName: "Urine Routine - UA",
            testName: "Colour",
            value: "RED",
            arrowDirection: "",
            units: null,
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "",
                  value: "",
                  min: "",
                  max: "",
                  unit: "",
                },
              ],
            },
          },
          {
            reportName: "Urine Routine - UA",
            testName: "Remarks",
            value: "kjhgfghjk",
            arrowDirection: "",
            units: "",
            refRange: {},
          },
          {
            reportName: "Complete Blood Count - CBC",
            testName: "Total Red Cell Count (RBC)",
            value: "10",
            arrowDirection: "",
            units: "M cells/mm³",
            refRange: {
              isConditional: true,
              ranges: [
                {
                  gender: "FEMALE",
                  value: "",
                  min: "3.8",
                  max: "4.8",
                  unit: "M cells/mm³",
                },
                {
                  gender: "MALE",
                  value: "",
                  min: "3.5",
                  max: "4.5",
                  unit: "M cells/mm³",
                },
              ],
            },
          },
          {
            reportName: "Complete Blood Count - CBC",
            testName: "Mean Corpuscular Haemoglobin (MCH)",
            value: "30",
            arrowDirection: "",
            units: "pg",
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "ALL",
                  value: "",
                  min: "26",
                  max: "32",
                  unit: "pg",
                },
              ],
            },
          },
          {
            reportName: "Complete Blood Count - CBC",
            testName: "Mean Corpuscular Haemoglobin Concentration (MCHC)",
            value: "40",
            arrowDirection: "",
            units: "%",
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "ALL",
                  value: "",
                  min: "31",
                  max: "35",
                  unit: "%",
                },
              ],
            },
          },
          {
            reportName: "Complete Blood Picture - CBP",
            testName: "Total Red Cell Count (RBC)",
            value: "10",
            arrowDirection: "",
            units: "M cells/mm³",
            refRange: {
              isConditional: true,
              ranges: [
                {
                  gender: "FEMALE",
                  value: "",
                  min: "3.8",
                  max: "4.8",
                  unit: "M cells/mm³",
                },
                {
                  gender: "MALE",
                  value: "",
                  min: "3.5",
                  max: "4.5",
                  unit: "M cells/mm³",
                },
              ],
            },
          },
          {
            reportName: "Complete Blood Picture - CBP",
            testName: "WBCs",
            value: "66",
            arrowDirection: "",
            units: "K cells/µL",
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "ALL",
                  value: "",
                  min: "4",
                  max: "11",
                  unit: "K cells/µL",
                },
              ],
            },
          },
          {
            reportName: "Urine Culture and Sensitivity",
            testName: "Colony Count",
            value: "10",
            arrowDirection: "",
            units: "CFU/mL",
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "ALL",
                  value: "",
                  min: "0",
                  max: "10000",
                  unit: "CFU/mL",
                },
              ],
            },
          },
          {
            reportName: "Complete Urine Evaluation - CUE",
            testName: "RBCs",
            value: "20",
            arrowDirection: "",
            units: "/HPF",
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "ALL",
                  value: "",
                  min: "0",
                  max: "2",
                  unit: "/HPF",
                },
              ],
            },
          },
          {
            reportName: "Stool Colour",
            testName: "Stool Colour",
            value: "Yellow",
            arrowDirection: "",
            units: null,
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "",
                  value: "",
                  min: "",
                  max: "",
                  unit: "",
                },
              ],
            },
          },
          {
            reportName: "Common tests",
            testName: "RBCs",
            value: "11",
            arrowDirection: "",
            units: "M cells/mm³",
            refRange: {
              isConditional: true,
              ranges: [
                {
                  gender: "MALE",
                  value: "",
                  min: "4.7",
                  max: "6.1",
                  unit: "M cells/mm³",
                },
                {
                  gender: "FEMALE",
                  value: "",
                  min: "4.2",
                  max: "5.4",
                  unit: "M cells/mm³",
                },
              ],
            },
          },
          {
            reportName: "Common tests",
            testName: "RBC  Red Blood Cells",
            value: "22",
            arrowDirection: "",
            units: "M cells/mm³",
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "ALL",
                  value: "",
                  min: "4.5",
                  max: "5.5",
                  unit: "M /mm³",
                },
              ],
            },
          },
          {
            reportName: "Common tests",
            testName: "WBCs",
            value: "44",
            arrowDirection: "",
            units: "K cells/µL",
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "ALL",
                  value: "",
                  min: "4",
                  max: "11",
                  unit: "K cells/µL",
                },
              ],
            },
          },
          {
            reportName: "Common tests",
            testName: "Total WBC Count",
            value: "55",
            arrowDirection: "",
            units: "cells/mm³",
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "ALL",
                  value: "",
                  min: "4000",
                  max: "11000",
                  unit: "cells/mm³",
                },
              ],
            },
          },
          {
            reportName: "Semen RBCs",
            testName: "Semen RBCs",
            value: "33",
            arrowDirection: "",
            units: null,
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "",
                  value: "",
                  min: "",
                  max: "",
                  unit: "",
                },
              ],
            },
          },
        ],
      },
      {
        date: "2025-06-11",
        createdAt: "2025-06-23",
        inputs: [
          {
            reportName: "Urine Routine - UA",
            testName: "Colour",
            value: "Yellow",
            arrowDirection: "",
            units: null,
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "",
                  value: "",
                  min: "",
                  max: "",
                  unit: "",
                },
              ],
            },
          },
          {
            reportName: "Complete Blood Count - CBC",
            testName: "Total Red Cell Count (RBC)",
            value: "20",
            arrowDirection: "",
            units: "M cells/mm³",
            refRange: {
              isConditional: true,
              ranges: [
                {
                  gender: "FEMALE",
                  value: "",
                  min: "3.8",
                  max: "4.8",
                  unit: "M cells/mm³",
                },
                {
                  gender: "MALE",
                  value: "",
                  min: "3.5",
                  max: "4.5",
                  unit: "M cells/mm³",
                },
              ],
            },
          },
          {
            reportName: "Complete Blood Count - CBC",
            testName: "Mean Corpuscular Haemoglobin (MCH)",
            value: "10",
            arrowDirection: "",
            units: "pg",
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "ALL",
                  value: "",
                  min: "26",
                  max: "32",
                  unit: "pg",
                },
              ],
            },
          },
          {
            reportName: "Complete Blood Count - CBC",
            testName: "Mean Corpuscular Haemoglobin Concentration (MCHC)",
            value: "11",
            arrowDirection: "",
            units: "%",
            refRange: {
              isConditional: false,
              ranges: [
                {
                  gender: "ALL",
                  value: "",
                  min: "31",
                  max: "35",
                  unit: "%",
                },
              ],
            },
          },
        ],
      },
      {
        date: "2025-06-24",
        createdAt: "2025-06-24",
        inputs: [
          {
            reportName: "Complete Blood Count - CBC",
            testName: "Remarks",
            value: ",kjhgvcfvbnm",
            arrowDirection: "",
            units: "",
            refRange: {},
          },
        ],
      },
    ] || [],
  medicalHistoryData:
    [
      {
        title: "Medical Condition ",
        notes: "",
        tags: [
          {
            title: "Hypertension",
            enable: "Y",
            medication: "",
            monthYear: "",
            newSince: "",
            notes: "2-3 ಲೀಟರ್ ನೀರು ಕುಡಿಯಬೇಕು",
            since: "",
            status: "Active",
          },
          {
            title: "Prediabetes",
            enable: "Y",
            medication: "",
            monthYear: "",
            newSince: "",
            notes: "",
            since: "",
            status: "",
          },
        ],
      },
      {
        title: "Allergies",
        notes: "",
        tags: [],
      },
      {
        title: "Family History",
        notes: "",
        tags: [],
      },
      {
        title: "Lifestyle",
        notes: "",
        tags: [],
      },
    ] || [],
  gynecHistoryData: null,
};

export const getLabParamsData = createAsyncThunk(
  "prescription/getLabParamsData",
  async (data) => {
    try {
      let result = {};
      result = await ApiPrescription.getLabParamsData(data);
      if (result.data?.results?.length) {
        return result.data?.results;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const fetchGynecHistory = createAsyncThunk(
  "prescription/fetchGynecHistory",
  async ({ patientId, userId }) => {
    try {
      let result = {};
      result = await getGynecDetails(patientId, userId);
      const { createdAt, createdBy, ...updatedData } = result;
      if (updatedData) {
        return updatedData;
      } else {
        throw Error(result.error);
      }
    } catch (err) {
      console.log("error: ", err);
      throw Error(err);
    }
  }
);

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState,
  reducers: {
    setMedicationData: (state, action) => {
      if (typeof action.payload === "function") {
        state.medicationData = action.payload(state.medicationData);
      } else {
        state.medicationData = action.payload;
      }
    },
    setPillupSwitch: (state, action) => {
      if (typeof action.payload === "function") {
        state.pillupSwitch = action.payload(state.pillupSwitch);
      } else {
        state.pillupSwitch = action.payload;
      }
    },
    setMedicalHistoryData: (state, action) => {
      if (typeof action.payload === "function") {
        state.medicalHistoryData = action.payload(state.medicalHistoryData);
      } else {
        state.medicalHistoryData = action.payload;
      }
    },
    setGynecHistoryData: (state, action) => {
      if (typeof action.payload === "function") {
        state.gynecHistoryData = action.payload(state.gynecHistoryData);
      } else {
        state.gynecHistoryData = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLabParamsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLabParamsData.fulfilled, (state, action) => {
        state.loading = false;
        state.labParamsData = action.payload;
      })
      .addCase(getLabParamsData.rejected, (state, action) => {
        state.labParamsData = [];
        state.loading = false;
      })
      .addCase(fetchGynecHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGynecHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.gynecHistoryData = action.payload;
      })
      .addCase(fetchGynecHistory.rejected, (state, action) => {
        state.gynecHistoryData = [];
        state.loading = false;
      });
  },
});

export const {
  setMedicationData,
  setPillupSwitch,
  setMedicalHistoryData,
  setGynecHistoryData,
} = prescriptionSlice.actions;
export default prescriptionSlice.reducer;
