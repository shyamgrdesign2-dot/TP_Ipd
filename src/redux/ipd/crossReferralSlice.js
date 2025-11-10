import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import ApiCrossReferral from "../../api/services/ipd/ApiCrossReferral";

export const initialState = {
  crossReferralData: {},
  loading: false,
  currentCrossReferralId: null, //"68d26742d5f86080a3a6383a",
  currentCrossReferralFilledByDetails: null,
  crossReferralFormDetails: {
    referralInformation: {
      referringDepartment: "",
      referringTo: null,
      referralDate: "",
      reasonForReferral: [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ],
      relativesInformed: {
        informedByDoctor: null,
        informedTo: "",
        informedOnDate: "",
        informedOnTime: "",
      },
    },
    consultantNotesData: [],
  },
  selectedConsultantNoteId: 0,
};

export const getCrossReferralData = createAsyncThunk(
  "crossReferral/getCrossReferralData",
  async (data, { rejectWithValue }) => {
    try {
      let result = {};
      result = await ApiCrossReferral.getCrossReferral(data);
      if (Array.isArray(result)) {
        return result;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message: error.response.data.message,
      });
    }
  }
);
export const addCrossReferralData = createAsyncThunk(
  "crossReferral/addCrossReferralData",
  async (data) => {
    try {
      let result = {};
      result = await ApiCrossReferral.addCrossReferral(data);
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
export const updateCrossReferralData = createAsyncThunk(
  "crossReferral/updateCrossReferralData",
  async (data) => {
    let result = {};
    result = await ApiCrossReferral.updateCrossReferral(data);
    if (
      result.message === "cross referral created successfully." ||
      result.message === "cross referral updated successfully."
    ) {
      return result.data;
    } else {
      return result.data;
    }
  }
);

const crossReferralSlice = createSlice({
  name: "crossReferral",
  initialState,
  reducers: {
    setCrossReferralData: (state, action) => {
      state.crossReferralData = action.payload;
    },
    setCrossReferralFormDetails: (state, action) => {
      state.crossReferralFormDetails = action.payload || {};
    },
    setCrossReferralInformationDetails: (state, action) => {
      state.crossReferralFormDetails.referralInformation = action.payload || {};
    },
    setCrossReferralConsultantNoteDetails: (state, action) => {
      if (!state.crossReferralFormDetails.consultantNotesData) {
        state.crossReferralFormDetails.consultantNotesData = [];
      }

      while (
        state.crossReferralFormDetails.consultantNotesData.length <=
        state.selectedConsultantNoteId
      ) {
        state.crossReferralFormDetails.consultantNotesData.push({});
      }

      state.crossReferralFormDetails.consultantNotesData[
        state.selectedConsultantNoteId
      ] = {
        ...state.crossReferralFormDetails.consultantNotesData[
          state.selectedConsultantNoteId
        ],
        ...(action.payload || {}),
      };
    },
    setCurrentCrossReferralFilledByDetails: (state, action) => {
      state.currentCrossReferralFilledByDetails = action.payload || null;
    },
    setSingleCrossReferralData: (state, action) => {
      const crossReferralArray = Array.isArray(state.crossReferralData)
        ? state.crossReferralData
        : [];
      const { _id } = action.payload;
      const foundCrossReferral = crossReferralArray.find(
        (referral) => referral._id === _id
      );

      if (foundCrossReferral) {
        state.currentCrossReferralFilledByDetails = {
          ...foundCrossReferral.filledByDetails,
          ...foundCrossReferral,
        };
      }

      const selectedCrossReferral = crossReferralArray.find(
        (referral) => referral._id === _id
      )?.crossReferral;

      if (!selectedCrossReferral) {
        console.warn(`Cross Referral with _id ${_id} not found`);
        return;
      }
      if (selectedCrossReferral.referralInformation) {
        const consultantNotesData = selectedCrossReferral.consultantNotes || [];
        state.crossReferralFormDetails = {
          ...selectedCrossReferral,
          consultantNotesData: consultantNotesData,
        };
      }
    },
    setCurrentCrossReferralId: (state, action) => {
      state.currentCrossReferralId = action.payload || null;
    },
    setSelectedConsultantNoteId: (state, action) => {
      state.selectedConsultantNoteId = action.payload || 0;
    },
    resetCrossReferralForm: (state) => {
      state.crossReferralFormDetails = {
        referralInformation: {
          referringDepartment: "",
          referringTo: null,
          referralDate: "",
          reasonForReferral: [
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
          ],
          relativesInformed: {
            informedByDoctor: null,
            informedTo: "",
            informedOnDate: "",
            informedOnTime: "",
          },
        },
        consultantNotesData: [],
      };
      state.currentCrossReferralId = null;
      state.selectedConsultantNoteId = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCrossReferralData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCrossReferralData.fulfilled, (state, action) => {
        state.loading = false;
        state.crossReferralData = action.payload;
      })
      .addCase(getCrossReferralData.rejected, (state, action) => {
        state.crossReferralData = {};
        state.loading = false;
      })
      .addCase(addCrossReferralData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCrossReferralData.fulfilled, (state, action) => {
        state.loading = false;
        state.crossReferralData = action.payload;
      })
      .addCase(addCrossReferralData.rejected, (state, action) => {
        state.crossReferralData = [];
        state.loading = false;
      })
      .addCase(updateCrossReferralData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCrossReferralData.fulfilled, (state, action) => {
        state.loading = false;
        state.crossReferralData = action.payload;
      })
      .addCase(updateCrossReferralData.rejected, (state, action) => {
        state.crossReferralData = [];
        state.loading = false;
      });
  },
});

export const {
  setCrossReferralData,
  setCrossReferralFormDetails,
  setCrossReferralInformationDetails,
  setCrossReferralConsultantNoteDetails,
  setCurrentCrossReferralFilledByDetails,
  setSingleCrossReferralData,
  setCurrentCrossReferralId,
  resetCrossReferralForm,
  setSelectedConsultantNoteId,
} = crossReferralSlice.actions;
export default crossReferralSlice.reducer;
