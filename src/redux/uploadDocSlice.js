import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uploadDocCategories: [],
  allUploadedDocs: [],
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
        "Prescription",
        "Pathology",
        "Radiology",
        "Other",
      ];
      if (action?.payload?.length > 0) {
        const reorderedCategories = categoriesOrder.map((name) =>
          action.payload.find((category) => category.category_name === name)
        );
        state.uploadDocCategories = reorderedCategories;
      }
    },
    setAllUploadedDocs: (state, action) => {
      state.allUploadedDocs = action.payload;
    },
  },
});

export const {
  resetUploadDocState,
  setUploadDocCategories,
  setAllUploadedDocs,
} = uploadDocSlice.actions;
export default uploadDocSlice.reducer;
