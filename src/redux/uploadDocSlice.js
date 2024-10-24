import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uploadDocCategories: [],
  allUploadedDocs: [],
  patientUploadedDocs: [],
  isLoading: false,
};

const uploadDocSlice = createSlice({
  name: "uploadDoc",
  initialState,
  reducers: {
    resetUploadDocState: (state) => {
      state.allUploadedDocs = [];
    },
    setUploadDocCategories: (state, action) => {
      const categoriesOrder = [
        "Pathology",
        "Radiology",
        "Prescription",
        "Other",
      ];
      if (action?.payload?.length > 0) {
        const reorderedCategories = categoriesOrder.map((name) =>
          action.payload.find((category) => category.category_name === name)
        );
        state.uploadDocCategories = reorderedCategories;
      }
    },
    setPatientUploadedDocs: (state, action) => {
      state.patientUploadedDocs = action.payload;
    },
    setLoadingStatus: (state, action) => {
      state.isLoading = action.payload;
    },
    setAllUploadedDocs: (state, action) => {
      state.allUploadedDocs = action.payload;
    },
  },
});

export const {
  resetUploadDocState,
  setUploadDocCategories,
  setPatientUploadedDocs,
  setLoadingStatus,
  setAllUploadedDocs,
} = uploadDocSlice.actions;
export default uploadDocSlice.reducer;
