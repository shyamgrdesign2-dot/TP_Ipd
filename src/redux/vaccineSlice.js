import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { updateVaccine } from "../pages/vaccination/service";

const initialState = {
  givenVaccines: [],
  updatedDueVaccines: [],
  status: null,
};

export const addGivenVaccines = createAsyncThunk(
  "vaccines/addGivenVaccines",
  async (data) => {
    let result = {};
    result = await updateVaccine(data.payload);
    if (result.status) {
      return data;
    } else {
      throw Error(result.error);
    }
  }
);

const vaccineSlice = createSlice({
  name: "vaccines",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(addGivenVaccines.fulfilled, (state, action) => {
        state.givenVaccines.push({
          ...action?.payload?.payload,
          ...action?.payload?.vaccine,
        });
        // state.status = "success";
        return { status: 201 };
      })
      .addCase(addGivenVaccines.rejected, (state, action) => {
        // action.payload = false;
        state.status = "failure";
        return { status: "failure" };
      });
  },
});

export default vaccineSlice.reducer;

// const vaccineSlice = createSlice({
//   name: "vaccines",
//   initialState,
//   reducers: {
//     addGivenVaccines: (state, action) => {
//       state.vaccines.push(action.payload);
//     },
//     addDueVaccines: (state, action) => {
//       state.vaccines.push(action.payload);
//     }
//   },
// });

// export const { addGivenVaccines, addDueVaccines } = vaccineSlice.actions;
// export default vaccineSlice.reducer;
