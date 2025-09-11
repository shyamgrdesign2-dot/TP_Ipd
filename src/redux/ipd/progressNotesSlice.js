import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiProgressNotes from "../../api/services/ipd/ApiProgressNotes";

const initialState = {
  progressNotesData: {},
  loading: false,
};

export const getProgressNotesData = createAsyncThunk(
  "progressNotes/getProgressNotesData",
  async (data) => {
    try {
      let result = {};
      result = await ApiProgressNotes.getProgressNotesData(data);
      if (result?.progressNotes) {
        return result?.progressNotes;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);
export const addProgressNotesData = createAsyncThunk(
  "progressNotes/addProgressNotesData",
  async (data) => {
    try {
      let result = {};
      result = await ApiProgressNotes.addProgressNotesData(data);
      if (result.data?.length) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);
export const updateProgressNotesData = createAsyncThunk(
  "progressNotes/updateProgressNotesData",
  async (data) => {
    try {
      let result = {};
      result = await ApiProgressNotes.updateProgressNotesData(data);
      if (result.data?.length) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      throw Error(error);
    }
  }
);

const progressNotesSlice = createSlice({
  name: "progressNotes",
  initialState,
  reducers: {
    setProgressNotesData: (state, action) => {
      state.progressNotesData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProgressNotesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProgressNotesData.fulfilled, (state, action) => {
        state.loading = false;
        state.progressNotesData = action.payload;
      })
      .addCase(getProgressNotesData.rejected, (state, action) => {
        state.progressNotesData = {};
        state.loading = false;
      })
      .addCase(addProgressNotesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProgressNotesData.fulfilled, (state, action) => {
        state.loading = false;
        state.progressNotesData = action.payload;
      })
      .addCase(addProgressNotesData.rejected, (state, action) => {
        state.progressNotesData = [];
        state.loading = false;
      })
      .addCase(updateProgressNotesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProgressNotesData.fulfilled, (state, action) => {
        state.loading = false;
        state.progressNotesData = action.payload;
      })
      .addCase(updateProgressNotesData.rejected, (state, action) => {
        state.progressNotesData = [];
        state.loading = false;
      });
  },
});

export const {
  setProgressNotesData,
} = progressNotesSlice.actions;
export default progressNotesSlice.reducer;
