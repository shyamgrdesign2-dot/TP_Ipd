import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  records: [],
  loading: false,
  error: null,
};

export const createNewRecord = createAsyncThunk('records/createNewRecord', async (data) => {
  // Simulates a long running operation like an API call here
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const uuid = uuidv4();
  const newRecord = {
    uuid,
  };

  // API call success
  if(newRecord.uuid) {
    console.log('returning record', newRecord.uuid);
    return newRecord;
  } else {
    // API failed, return some meaningful error
    return {
      errMsg: 'Network error'
    };
  }
  
  
});

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
  extraReducers: builder => {
    builder
        .addCase(createNewRecord.pending, state => {
            state.loading = true
        })
        .addCase(createNewRecord.fulfilled, (state, action) => {
            state.loading = false
            state.records.push(action.payload);
        })
        .addCase(createNewRecord.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
  }
});

export const { addRecord, updateRecord, deleteRecord } = recordsSlice.actions;
export default recordsSlice.reducer;
