import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  measurements: [],
};

const growthChartSlice = createSlice({
  name: "growthChart",
  initialState,
  reducers: {
    resetGrowthChartState: () => initialState,
    addMeasurements: (state, action) => {
      state.measurements.push(action.payload);
    },
  },
});

export const { resetGrowthChartState, addMeasurements } =
  growthChartSlice.actions;
export default growthChartSlice.reducer;
