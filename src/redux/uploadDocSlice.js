import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uploadDocCategories: [],
  allUploadedDocs: [],
};

const uploadDocSlice = createSlice({
  name: "uploadDoc",
  initialState,
  reducers: {
    resetUploadDocState: () => initialState,
    setUploadDocCategories: (state, action) => {
      state.uploadDocCategories = action.payload;
    },
    setAllUploadedDocs: (state, action) => {
      state.allUploadedDocs = action.payload;
    },
  },
});

export const { resetUploadDocState, setUploadDocCategories, setAllUploadedDocs } =
  uploadDocSlice.actions;
export default uploadDocSlice.reducer;
