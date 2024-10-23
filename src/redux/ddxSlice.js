import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isApexAISelected: false,
};

const ddxSlice = createSlice({
  name: "ddx",
  initialState,
  reducers: {
    resetDDxState: () => initialState,
    setIsApexAISelected: (state, action) => {
      state.isApexAISelected = action.payload;
    },
  },
});

export const { resetDDxState, setIsApexAISelected } = ddxSlice.actions;
export default ddxSlice.reducer;
