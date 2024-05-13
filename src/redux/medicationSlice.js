import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiMedication from "../api/services/ApiMedication";

const initialState = {
  selectedMedicationList: [],
  parentOptionsList: [],
  childOptionsList: [],
  templates: [],
  loading: false,
  error: null,
  genericList: [],
};

export const addTemplate = createAsyncThunk(
  "medication/addTemplate",
  async (template) => {
    let result = {};
    result = await ApiMedication.addTemplate(template);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const updateTemplate = createAsyncThunk(
  "medication/updateTemplate",
  async (template) => {
    const result = await ApiMedication.updateTemplate(template);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  "medication/deleteTemplate",
  async (templateId) => {
    const result = await ApiMedication.deleteTemplate(templateId);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const getMedicationTemplates = createAsyncThunk(
  "medication/getMedicationTemplates",
  async () => {
    let result = {};
    result = await ApiMedication.getMedicationTemplates();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const singleTemplateDetails = createAsyncThunk(
  "medication/singleTemplateDetails",
  async (templateId) => {
    let result = {};
    result = await ApiMedication.singleTemplateDetails(templateId);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const getMedicineDetails = createAsyncThunk(
  "medication/getMedicineDetails",
  async (query) => {
    let result = {};
    result = await ApiMedication.getMedicineDetails(query);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const getFrequentlySearchedMedication = createAsyncThunk(
  "medication/getFrequentlySearchedMedication",
  async () => {
    let result = {};
    result = await ApiMedication.getFrequentlySearchedMedication();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const searchMedication = createAsyncThunk(
  "medication/searchMedication",
  async (data) => {
    let result = {};
    result = await ApiMedication.searchMedication(data.searchQuery);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const getLoadPreviousRx = createAsyncThunk(
  "medication/getLoadPreviousRx",
  async (data) => {
    let result = {};
    result = await ApiMedication.getLoadPreviousRx(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const searchGeneric = createAsyncThunk(
  "medication/searchGeneric",
  async (query) => {
    let result = {};
    result = await ApiMedication.searchGeneric(query);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const addMedicine = createAsyncThunk(
  "medication/addMedicine",
  async (data) => {
    let result = {};
    result = await ApiMedication.addMedicine(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

const medicationSlice = createSlice({
  name: "medication",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(addTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMedicationList = action.payload.medication;
        const medication = {
          tmtd_id: action.payload.tmtd_id,
          tmtd_tmm_id: action.payload.data.map(e => e.tmm_id).toString(),
          tmtd_tmr_type: action.payload.data.map(e => e.tcm_tmr_type).toString(),
          tmtd_template_name: action.payload.tmtd_template_name,
          pms_default: 0,
          medicine_name: action.payload.data.map(e => e.tmm_medicine_name).toString()
        }
        state.templates.unshift(medication);
      })
      .addCase(addTemplate.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMedicationList = action.payload.medication;
        const medication = {
          tmtd_id: action.payload.tmtd_id,
          tmtd_tmm_id: action.payload.data.map(e => e.tmm_id).toString(),
          tmtd_tmr_type: action.payload.data.map(e => e.tcm_tmr_type).toString(),
          tmtd_template_name: action.payload.tmtd_template_name,
          pms_default: 0,
          medicine_name: action.payload.data.map(e => e.tmm_medicine_name).toString()
        }
        const index = state.templates.findIndex(
          (e) => e.tmtd_id == action.payload.tmtd_id
        );
        if (index !== -1) {
          state.templates[index] = medication;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTemplate.pending, (state, action) => {
        const updatedData = state.templates.map((e) =>
          e.tmtd_id == action.meta.arg ? { ...e, loading: true } : e
        );
        state.templates = [...updatedData];
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        const result = state.templates.filter(
          (item) => item.tmtd_id !== action.payload.tmtd_id
        );
        state.templates = [...result];
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        const updatedData = state.templates.map((e) =>
          e.tmtd_id == action.meta.arg ? { ...e, loading: false } : e
        );
        state.templates = [...updatedData];
      })
      .addCase(getMedicationTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
      })
      .addCase(getMedicationTemplates.rejected, (state, action) => {
        state.templates = [];
      })
      .addCase(getFrequentlySearchedMedication.fulfilled, (state, action) => {
        state.parentOptionsList = action.payload;
      })
      .addCase(getFrequentlySearchedMedication.rejected, (state, action) => {
        state.parentOptionsList = [];
      })
      .addCase(searchMedication.pending, (state) => { })
      .addCase(searchMedication.fulfilled, (state, action) => {
        if (action.meta.arg.type == "parent") {
          state.parentOptionsList = action.payload;
        } else {
          state.childOptionsList = action.payload;
        }
      })
      .addCase(searchMedication.rejected, (state, action) => {
        if (action.meta.arg.type == "parent") {
          state.parentOptionsList = [];
        } else {
          state.childOptionsList = [];
        }
      })
      .addCase(searchGeneric.pending, (state) => { })
      .addCase(searchGeneric.fulfilled, (state, action) => {
        state.genericList = action.payload;
      })
      .addCase(searchGeneric.rejected, (state, action) => {
        state.genericList = [];
      })
      .addCase(addMedicine.pending, (state) => {
        state.loading = true
      })
      .addCase(addMedicine.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(addMedicine.rejected, (state) => {
        state.loading = false
      })
  },
});

export default medicationSlice.reducer;