import { createSlice } from "@reduxjs/toolkit";

const doctorModalSlice = createSlice({
  name: "doctorModal",
  initialState: {
    isVisible: false,
  },
  reducers: {
    openModal: (state, action) => {
      state.isVisible = true;
    },
    closeModal: (state) => {
      state.isVisible = false;
    },
  },
});

export const { openModal, closeModal } = doctorModalSlice.actions;
export default doctorModalSlice.reducer;
