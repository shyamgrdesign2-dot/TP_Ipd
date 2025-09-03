import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiAssessment from "../../api/services/ipd/ApiAssessment";

const initialState = {
  assessmentsData: [],
};

export const getAssessmentsData = createAsyncThunk(
  "assessment/getAssessmentsData",
  async (data) => {
    try {
      let result = {};
      result = await ApiAssessment.getAssessmentsData(data);
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
const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    setAssessmentsData: (state, action) => {
      state.assessmentsData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssessmentsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAssessmentsData.fulfilled, (state, action) => {
        state.loading = false;
        state.assessmentsData = action.payload;
      })
      .addCase(getAssessmentsData.rejected, (state, action) => {
        state.assessmentsData = [];
        state.loading = false;
      });
  },
});

export const { setAssessmentsData } = assessmentSlice.actions;
export default assessmentSlice.reducer;
