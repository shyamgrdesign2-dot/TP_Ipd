import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  obstetricDetails: {},
  isObstetricDetailsFetched: false,
};

const obstetricSlice = createSlice({
  name: "obstetric",
  initialState,
  reducers: {
    resetObstetricState: () => initialState,
    addObstetricDetails: (state, action) => {
      state.obstetricDetails = action.payload;
      state.isObstetricDetailsFetched = true;
    },
  },
});

export const { resetObstetricState, addObstetricDetails } =
  obstetricSlice.actions;
export default obstetricSlice.reducer;