import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiOtNotes from "../../api/services/ipd/ApiOtNotes";

const initialState = {
  otNotesData: {},
  loading: false,
};

export const getOtNotesData = createAsyncThunk(
  "otNotes/getOtNotesData",
  async (data) => {
    try {
      let result = {};
      result = await ApiOtNotes.getOtNotesData(data);
      if (result?.otNotes) {
        return result?.otNotes;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);
export const addOtNotesData = createAsyncThunk(
  "otNotes/addOtNotesData",
  async (data) => {
    try {
      let result = {};
      result = await ApiOtNotes.addOtNotesData(data);
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
export const updateOtNotesData = createAsyncThunk(
  "otNotes/updateOtNotesData",
  async (data) => {
    try {
      let result = {};
      result = await ApiOtNotes.updateOtNotesData(data);
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

const otNotesSlice = createSlice({
  name: "otNotes",
  initialState,
  reducers: {
    setOtNotesData: (state, action) => {
      state.otNotesData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOtNotesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOtNotesData.fulfilled, (state, action) => {
        state.loading = false;
        state.otNotesData = action.payload;
      })
      .addCase(getOtNotesData.rejected, (state, action) => {
        state.otNotesData = {};
        state.loading = false;
      })
      .addCase(addOtNotesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addOtNotesData.fulfilled, (state, action) => {
        state.loading = false;
        state.otNotesData = action.payload;
      })
      .addCase(addOtNotesData.rejected, (state, action) => {
        state.otNotesData = [];
        state.loading = false;
      })
      .addCase(updateOtNotesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOtNotesData.fulfilled, (state, action) => {
        state.loading = false;
        state.otNotesData = action.payload;
      })
      .addCase(updateOtNotesData.rejected, (state, action) => {
        state.otNotesData = [];
        state.loading = false;
      });
  },
});

export const {
  setOtNotesData,
} = otNotesSlice.actions;
export default otNotesSlice.reducer;
