import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  measurements: [],
  isFetched: false,
};

const growthChartSlice = createSlice({
  name: "growthChart",
  initialState,
  reducers: {
    resetGrowthChartState: () => initialState,
    addMeasurements: (state, action) => {
      const existing = state.measurements.find(
        (m) => m.tcbc_id === action.payload.tcbc_id
      );
      if (existing) {
        action.payload = { ...existing, ...action.payload };
      }
      state.measurements = [...state.measurements, action.payload];
      state.isFetched = true;
    },
  },
});

export const { resetGrowthChartState, addMeasurements } =
  growthChartSlice.actions;
export default growthChartSlice.reducer;
