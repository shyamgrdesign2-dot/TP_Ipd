import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiDischargeSummary from "../../api/services/ipd/ApiDischargeSummary";

export const initialState = {
  //   dischargeSummaryData: {},
  dischargeSummaryData: {
    patientInformation: {
      dateOfDischarge: "",
      patientName: "Seema Rao",
      age: 49,
      gender: "Male",
      contactNumber: "+91-9870537392",
      wardBedNo: "Orthopedics",
      patientId: "P024",
      admissionId: "AID-5698",
      admissionDate: "2025-07-12T17:09:00.000Z",
      primaryConsultant: {
        id: 524,
        name: "Dr. Vivek Prasad",
        speciality: "Surgeon",
      },
      address: "Random Address 21",
    },
  },
  mockValues: {},
  loading: false,
  currentDischargeSummaryId: null,
  dischargeSummaryFormDetails: {},
};

export const getDischargeSummaryData = createAsyncThunk(
  "dischargeSummary/getDischargeSummaryData",
  async (data, { rejectWithValue }) => {
    try {
      const result = await ApiDischargeSummary.getDischargeSummary(data);
      if (Array.isArray(result)) {
        return result;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message: error.response?.data?.message,
      });
    }
  }
);

export const addDischargeSummaryData = createAsyncThunk(
  "dischargeSummary/addDischargeSummaryData",
  async (data) => {
    try {
      const result = await ApiDischargeSummary.addDischargeSummary(data);
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

export const updateDischargeSummaryData = createAsyncThunk(
  "dischargeSummary/updateDischargeSummaryData",
  async (data) => {
    try {
      const result = await ApiDischargeSummary.updateDischargeSummary(data);
      if (result.message === "discharge summary created successfully.") {
        return result;
      } else {
        return result?.data;
      }
    } catch (error) {
      throw Error(error);
    }
  }
);

export const getMockValues = createAsyncThunk(
  "dischargeSummary/getMockValues",
  async (_, { rejectWithValue }) => {
    try {
      const result = await ApiDischargeSummary.getMockValues();
      if (result.data) {
        return result.data;
      } else {
        throw Error(result.error || "Failed to fetch mock values");
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message: error.response?.data?.message || "Failed to fetch mock values",
      });
    }
  }
);

const dischargeSummarySlice = createSlice({
  name: "dischargeSummary",
  initialState,
  reducers: {
    setDischargeSummaryData: (state, action) => {
      state.dischargeSummaryData = action.payload;
    },
    setDischargeSummaryFormDetails: (state, action) => {
      state.dischargeSummaryFormDetails = action.payload || {};
    },
    setCourseInHospital: (state, action) => {
      state.dischargeSummaryData.courseInHospital = action.payload;
    },
    setVitalsData: (state, action) => {
        state.dischargeSummaryData.vitalsData = action.payload;
    },
    setCurrentDischargeSummaryId: (state, action) => {
      state.currentDischargeSummaryId = action.payload || null;
    },
    resetDischargeSummaryForm: (state) => {
      state.dischargeSummaryFormDetails =
        initialState.dischargeSummaryFormDetails;
      state.currentDischargeSummaryId = null;
    },
    setDischargeDate: (state, action) => {
      if (!state.dischargeSummaryData.patientInformation) {
        state.dischargeSummaryData.patientInformation = {};
      }
      state.dischargeSummaryData.patientInformation.dateOfDischarge =
        action.payload;
    },
    setProvisionalDiagnosis: (state, action) => {
      if (!state.dischargeSummaryData.diagnosisAndSurgery) {
        state.dischargeSummaryData.diagnosisAndSurgery = {};
      }
      state.dischargeSummaryData.diagnosisAndSurgery.provisionalDiagnosis =
        action.payload;
    },
    setDiet: (state, action) => {
      state.dischargeSummaryData.diet = action.payload;
    },
    setPhysicalActivities: (state, action) => {
      state.dischargeSummaryData.physicalActivities = action.payload;
    },
    setFollowUpDate: (state, action) => {
      state.dischargeSummaryData.followUpDate = action.payload;
    },
    setFollowUpDoctor: (state, action) => {
      state.dischargeSummaryData.followUpDoctor = action.payload;
    },
    setAdditionalNotes: (state, action) => {
      state.dischargeSummaryData.additionalNotes = action.payload;
    },
    setPreparedBy: (state, action) => {
      state.dischargeSummaryData.preparedBy = Array.isArray(action.payload) ? action.payload : [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDischargeSummaryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDischargeSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.dischargeSummaryData = action.payload;
      })
      .addCase(getDischargeSummaryData.rejected, (state) => {
        state.dischargeSummaryData = [];
        state.loading = false;
      })
      .addCase(addDischargeSummaryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDischargeSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.dischargeSummaryData = action.payload;
      })
      .addCase(addDischargeSummaryData.rejected, (state) => {
        state.dischargeSummaryData = [];
        state.loading = false;
      })
      .addCase(updateDischargeSummaryData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDischargeSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        state.dischargeSummaryData = action.payload;
      })
      .addCase(updateDischargeSummaryData.rejected, (state) => {
        state.dischargeSummaryData = [];
        state.loading = false;
      })
      .addCase(getMockValues.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMockValues.fulfilled, (state, action) => {
        state.loading = false;
        state.mockValues = action.payload;
      })
      .addCase(getMockValues.rejected, (state) => {
        state.mockValues = {};
        state.loading = false;
      });
  },
});

export const {
  setDischargeSummaryData,
  setDischargeSummaryFormDetails,
  setCurrentDischargeSummaryId,
  resetDischargeSummaryForm,
  setDischargeDate,
  setProvisionalDiagnosis,
  setCourseInHospital,
  setVitalsData,
  setDiet,
  setPhysicalActivities,
  setFollowUpDate,
  setFollowUpDoctor,
  setAdditionalNotes,
  setPreparedBy,
} = dischargeSummarySlice.actions;

export default dischargeSummarySlice.reducer;
