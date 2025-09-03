import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  patientDetails: {
    details: {
      id: "123",
      name: "Abhishek Kunte",
      gender: "Male",
      age: 30,
      contact: "+91-9876543210",
    },
    ward: {
      id: 1,
      title: "General Ward",
    },
    room: {
      id: 101,
      title: "101",
    },
    doctor: {
      id: 524,
      name: "Dr. Ramesh Shah",
    },
    admittedOn: "2025-08-05T10:00:00.000Z",
    _id: "68ad7740ecbc6168f6270f9e",
    referral: false,
  },
};

const ipdSlice = createSlice({
  name: "ipd",
  initialState,
  reducers: {
    setPatientDetailsInOldFormat: (state, action) => {
      state.patientDetails = action.payload;
    },
  },
});

export const { setPatientDetailsInOldFormat } = ipdSlice.actions;
export default ipdSlice.reducer;
