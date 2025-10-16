import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import ApiOtNotes from "../../api/services/ipd/ApiOtNotes";
import ApiSurgical from "../../api/services/ApiSurgical";

export const initialState = {
  otNotesData: {},
  loading: false,
  currentOtNoteId: null, //"68d26742d5f86080a3a6383a",
  currentOtNoteFilledByDetails: null,
  surgeryDetails: {
    procedureName: "",
    anaesthesiaType: "",
    surgeryDate: "",
    surgeryStartTime: "",
    surgeryEndTime: "",
    diagnosis: null,
  },
  surgeryTeam: {
    primarySurgeon: [],
    secondarySurgeon: [],
    assistant: [],
    anaesthesiologist: [],
    scrubNurse: [],
    floorCirculatingNurse: [],
  },
  operativeNotes: {},
  intraOperativeNotes: {},
  postOperativeNotes: {},
  surgeryProcedureOptions: [],
  surgeryProcedureOptionsLoading: false,
};

export const searchSurgeryProcedures = createAsyncThunk(
  "otNotes/searchSurgeryProcedures",
  async (query) => {
    try {
      const result = await ApiSurgical.searchExamination(query || "");

      return Array.isArray(result) ? result : [];
    } catch (error) {
      throw Error(error);
    }
  }
);

export const getOtNotesData = createAsyncThunk(
  "otNotes/getOtNotesData",
  async (data, { rejectWithValue }) => {
    try {
      let result = {};
      result = await ApiOtNotes.getOtNotes(data);
      if (Array.isArray(result)) {
        return result;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      return rejectWithValue({
        visible: false,
        message: error.response.data.message,
      });
    }
  }
);
export const addOtNotesData = createAsyncThunk(
  "otNotes/addOtNotesData",
  async (data) => {
    try {
      let result = {};
      result = await ApiOtNotes.addOtNotes(data);
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
  async (data, { rejectWithValue }) => {
    try {
      let result = {};
      result = await ApiOtNotes.updateOtNotes(data);
      if (result.message === "ot notes updated successfully.") {
        return result;
      } else {
        return result?.data;
      }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add/update OT Notes");
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
    setSurgeryProcedureName: (state, action) => {
      state.surgeryDetails.procedureName = action.payload || "";
    },
    setAnaesthesiaType: (state, action) => {
      state.surgeryDetails.anaesthesiaType = action.payload || "";
    },
    setSurgeryDate: (state, action) => {
      state.surgeryDetails.surgeryDate = action.payload || "";
    },
    setSurgeryStartTime: (state, action) => {
      state.surgeryDetails.surgeryStartTime = action.payload || "";
    },
    setSurgeryEndTime: (state, action) => {
      state.surgeryDetails.surgeryEndTime = action.payload || "";
    },
    setDiagnosis: (state, action) => {
      state.surgeryDetails.diagnosis = action.payload || null;
    },
    setSurgeryTeam: (state, action) => {
      state.surgeryTeam[action.payload.roleId] = action.payload.value || [];
    },
    setOperativeNotes: (state, action) => {
      state.operativeNotes[action.payload.key] = {
        ...state.operativeNotes[action.payload.key],
        value: action.payload.value || "",
      };
    },
    setIntraOperativeNotes: (state, action) => {
      if (action.payload?.parentId) {
        if (!state.intraOperativeNotes[action.payload.parentId]) {
          state.intraOperativeNotes[action.payload.parentId] = {};
        }
        state.intraOperativeNotes[action.payload.parentId][action.payload.key] =
          action.payload.value || "";
      } else {
        state.intraOperativeNotes[action.payload.key] = {
          ...state.intraOperativeNotes[action.payload.key],
          value: action.payload.value || "",
        };
      }
    },
    setPostOperativeNotes: (state, action) => {
      state.postOperativeNotes[action.payload.key] = {
        ...state.postOperativeNotes[action.payload.key],
        value: action.payload.value || "",
      };
    },
    setCurrentOtNoteId: (state, action) => {
      state.currentOtNoteId = action.payload;
    },
    setCurrentOtNoteFilledByDetails: (state, action) => {
      state.currentOtNoteFilledByDetails = action.payload;
    },
    setSingleOtNotesData: (state, action) => {
      const otNotesArray = Array.isArray(state.otNotesData)
        ? state.otNotesData
        : [];
      const { _id } = action.payload;
      const foundNote = otNotesArray.find((note) => note._id === _id);

      if (foundNote) {
        state.currentOtNoteFilledByDetails = {
          ...foundNote.filledByDetails,
          ...foundNote,
        };
      }
      const selectedOtNote = otNotesArray.find(
        (note) => note._id === _id
      )?.otNotes;

      if (!selectedOtNote) {
        console.warn(`OT Note with _id ${_id} not found`);
        return;
      }

      // Surgery Details
      if (selectedOtNote.surgeryDetails) {
        state.surgeryDetails = {
          procedureName: selectedOtNote.surgeryDetails.procedureName || "",
          anaesthesiaType: selectedOtNote.surgeryDetails.anaesthesiaType || "",
          surgeryDate: selectedOtNote.surgeryDetails.surgeryDate || "",
          surgeryStartTime:
            selectedOtNote.surgeryDetails.surgeryStartTime || "",
          surgeryEndTime: selectedOtNote.surgeryDetails.surgeryEndTime || "",
          diagnosis: selectedOtNote.surgeryDetails.diagnosis || null,
        };
      }

      // Surgery Team
      if (selectedOtNote.surgeryTeam) {
        state.surgeryTeam = {
          primarySurgeon: selectedOtNote.surgeryTeam.primarySurgeon || [],
          secondarySurgeon: selectedOtNote.surgeryTeam.secondarySurgeon || [],
          assistant: selectedOtNote.surgeryTeam.assistant || [],
          anaesthesiologist: selectedOtNote.surgeryTeam.anaesthesiologist || [],
          scrubNurse: selectedOtNote.surgeryTeam.scrubNurse || [],
          floorCirculatingNurse:
            selectedOtNote.surgeryTeam.floorCirculatingNurse || [],
        };
      }

      // Operative Notes - convert back to value structure
      if (selectedOtNote.operativeNotes) {
        state.operativeNotes = {};
        Object.entries(selectedOtNote.operativeNotes).forEach(
          ([key, value]) => {
            state.operativeNotes[key] = { value: value };
          }
        );
      }

      // Intra Operative Notes - reverse mapping from flat structure to nested
      if (selectedOtNote.intraOperativeNotes) {
        const intraOp = selectedOtNote.intraOperativeNotes;
        state.intraOperativeNotes = {
          complicationsSeverity: { value: intraOp.complicationsSeverity || [] },
          specimensSent: { value: intraOp.specimensSent || [] },
          implantsUsed: { value: intraOp.implantsUsed || [] },
          additionalUnits: {
            estimatedBloodLoss: (intraOp.estimatedBloodLoss || 0).toString(),
            swabCount: (intraOp.swabCount || 0).toString(),
            fluidCount: (intraOp.fluidCount || 0).toString(),
            sutureType: (intraOp.sutureType || 0).toString(),
          },
        };
      }

      // Post Operative Notes - reverse mapping
      if (selectedOtNote.postOperativeNotes) {
        const postOp = selectedOtNote.postOperativeNotes;
        state.postOperativeNotes = {};

        // Handle special fields
        if (postOp.postOpDestination !== undefined) {
          state.postOperativeNotes.postOpDestination = {
            value: postOp.postOpDestination,
          };
        }
        if (postOp.additionalInstructions !== undefined) {
          state.postOperativeNotes.additionalInstructions = {
            value: postOp.additionalInstructions,
          };
        }

        // Handle other fields
        Object.entries(postOp).forEach(([key, value]) => {
          const excludedKeys = ["postOpDestination", "additionalInstructions"];
          if (!excludedKeys.includes(key)) {
            state.postOperativeNotes[key] = { value: value };
          }
        });
      }
    },
    resetOtNotesForm: (state) => {
      state.surgeryDetails = {
        procedureName: "",
        anaesthesiaType: "",
        surgeryDate: "",
        surgeryStartTime: "",
        surgeryEndTime: "",
        diagnosis: null,
      };
      state.surgeryTeam = {
        primarySurgeon: [],
        secondarySurgeon: [],
        assistant: [],
        anaesthesiologist: [],
        scrubNurse: [],
        floorCirculatingNurse: [],
      };
      state.operativeNotes = {};
      state.intraOperativeNotes = {};
      state.postOperativeNotes = {};
      state.currentOtNoteId = null;
      state.currentOtNoteFilledByDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(searchSurgeryProcedures.pending, (state) => {
        state.surgeryProcedureOptionsLoading = true;
      })
      .addCase(searchSurgeryProcedures.fulfilled, (state, action) => {
        state.surgeryProcedureOptionsLoading = false;
        state.surgeryProcedureOptions = action.payload || [];
      })
      .addCase(searchSurgeryProcedures.rejected, (state) => {
        state.surgeryProcedureOptionsLoading = false;
        state.surgeryProcedureOptions = [];
      })
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
  setSurgeryProcedureName,
  setAnaesthesiaType,
  setSurgeryDate,
  setSurgeryStartTime,
  setSurgeryEndTime,
  setDiagnosis,
  setSurgeryTeam,
  setOperativeNotes,
  setIntraOperativeNotes,
  setPostOperativeNotes,
  setSingleOtNotesData,
  setCurrentOtNoteId,
  setCurrentOtNoteFilledByDetails,
  resetOtNotesForm,
} = otNotesSlice.actions;
export default otNotesSlice.reducer;
