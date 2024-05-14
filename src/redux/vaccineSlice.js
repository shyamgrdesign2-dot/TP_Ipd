import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  givenVaccines: [],
  updatedDueVaccines: [],
  status: null,
};

const vaccineSlice = createSlice({
  name: "vaccines",
  initialState,
  reducers: {
    addGivenVaccines: (state, action) => {
      state.givenVaccines.push(action.payload);
    },
    addDueVaccines: (state, action) => {
      state.updatedDueVaccines.push(action.payload);
    },
  },
});

export const { addGivenVaccines, addDueVaccines } = vaccineSlice.actions;
export default vaccineSlice.reducer;
