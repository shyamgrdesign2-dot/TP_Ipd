import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  records: [],
};

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    addRecord: (state, action) => {
      const uuid = uuidv4();
      const values = {
        ...action.payload,
        uuid,
      };
      state.records.push(values);
    },
    updateRecord: (state, action) => {
      const index = state.records.findIndex((record) => record.uuid === action.payload.uuid);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    deleteRecord: (state, action) => {
      state.records = state.records.filter((record) => record.uuid !== action.payload);
    },
  },
});

export const { addRecord, updateRecord, deleteRecord } = recordsSlice.actions;
export default recordsSlice.reducer;
