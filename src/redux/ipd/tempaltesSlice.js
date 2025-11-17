import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiTemplate from "../../api/services/ipd/ApiTemplate";

export const TEMPLATE_MODULE_CATALOG = [
  {
    id: "admissionAssessment",
    title: "Admission Assessment - Temp",
    groups: [
      {
        id: "basicInfo",
        title: "Basic Info",
        modules: [
          { id: "presentingComplaints", title: "Presenting Complaints - Temp" },
          // { id: "currentMedications", title: "Current Medications - Temp" },
        ],
      },
      {
        id: "physicalExamination",
        title: "Physical Examination",
        modules: [
          // { id: "generalExamination", title: "General Examination - Temp" },
          { id: "physicalExaminationOthers", title: "Others - Temp" },
        ],
      },
      {
        id: "functionalAssessment",
        title: "Functional Assessment",
        modules: [{ id: "functionalAssessmentOthers", title: "Others - Temp" }],
      },
      {
        id: "provisionalDiagnosis",
        title: "Provisional Diagnosis",
        modules: [
          // { id: "provisionalDiagnosis", title: "Provisional Diagnosis - Temp" },
        ],
      },
      {
        id: "treatmentPlan",
        title: "Treatment Plan",
        modules: [
          { id: "immediateManagement", title: "Immediate Management - Temp" },
          { id: "monitoringPlan", title: "Desired Outcome - Temp" },
          { id: "preventiveActions", title: "Preventive Actions - Temp" },
        ],
      },
      {
        id: "additionalNotes",
        title: "Additional Notes",
        modules: [
          { id: "specialInstructions", title: "Special Instructions - Temp" },
          { id: "dischargeCriteria", title: "Discharge Criteria - Temp" },
        ],
      },
    ],
  },
  {
    id: "progressNotes",
    title: "Progress Notes - Temp",
    groups: [
      {
        id: "progress",
        title: "Progress",
        modules: [
          { id: "progressChiefComplaint", title: "Chief Complaint - Temp" },
          { id: "progressFindings", title: "Findings - Temp" },
          {
            id: "progressAdditionalRemarks",
            title: "Additional Remarks - Temp",
          },
        ],
      },
    ],
  },
  {
    id: "consultantNotes",
    title: "Consultant Notes - Temp",
    groups: [
      {
        id: "consultant",
        title: "Consultant Notes",
        modules: [
          {
            id: "consultantClinicalAssessmentPlan",
            title: "Clinical Assessment Plan - Temp",
          },
          { id: "consultantMedication", title: "Medication - Temp" },
          // {
          //   id: "consultantLabInvestigation",
          //   title: "Lab Investigation - Temp",
          // },
          {
            id: "consultantAdditionalRemarks",
            title: "Additional Remarks - Temp",
          },
        ],
      },
    ],
  },
  {
    id: "otNotes",
    title: "OT Notes - Temp",
    groups: [
      {
        id: "surgeryDetails",
        title: "Surgery Details",
        modules: [{ id: "otDiagnosis", title: "Diagnosis - Temp" }],
      },
      {
        id: "operativeNotes",
        title: "Operative Notes",
        modules: [
          { id: "operativeFindings", title: "Operative Findings - Temp" },
          { id: "operativeProcedure", title: "Procedure - Temp" },
          { id: "operativeAdditionalNotes", title: "Additional Notes - Temp" },
        ],
      },
      {
        id: "intraOperativeNotes",
        title: "Intra Operative Notes",
        modules: [
          {
            id: "complicationSeverity",
            title: "Complication Severity - Temp",
          },
          { id: "specimensSent", title: "Specimens Sent - Temp" },
          {
            id: "implantsProstheticsUsed",
            title: "Implants / Prosthetics Used - Temp",
          },
        ],
      },
      {
        id: "postOperativeNotes",
        title: "Post Operative Notes",
        modules: [
          {
            id: "postOperativeAdditionalInstructions",
            title: "Additional Instructions - Temp",
          },
        ],
      },
    ],
  },
  {
    id: "dischargeSummary",
    title: "Discharge Summary - Temp",
    groups: [
      {
        id: "diagnosisAndSurgery",
        title: "Diagnosis & Surgery",
        modules: [
          { id: "finalDiagnosis", title: "Final Diagnosis - Temp" },
          {
            id: "dischargeProvisionalDiagnosis",
            title: "Provisional Diagnosis - Temp",
          },
        ],
      },
      {
        id: "courseInHospital",
        title: "Course in Hospital",
        modules: [
          {
            id: "chronologicalSummary",
            title: "Chronological Summary - Temp",
          },
          { id: "treatmentGiven", title: "Treatment Given - Temp" },
        ],
      },
      {
        id: "dischargeNotes",
        title: "Discharge Notes",
        modules: [
          {
            id: "patientConditionDuringDischarge",
            title: "Patient Condition During Discharge - Temp",
          },
          // { id: "dischargeMedication", title: "Discharge Medication - Temp" },
        ],
      },
      {
        id: "dischargeAdvice",
        title: "Discharge Advice",
        modules: [
          { id: "diet", title: "Diet - Temp" },
          { id: "physicalActivities", title: "Physical Activities - Temp" },
          { id: "otherAdvice", title: "Other Advice - Temp" },
          { id: "warningSigns", title: "Warning Signs - Temp" },
          { id: "emergencyContact", title: "Emergency Contact - Temp" },
        ],
      },
      {
        id: "followUp",
        title: "Follow Up",
        modules: [
          { id: "additionalNotes", title: "Additional Notes - Temp" },
        ],
      },
    ],
  },
];

const ALL_TEMPLATE_MODULE_IDS = Array.from(
  new Set(
    TEMPLATE_MODULE_CATALOG.flatMap((section) =>
      section.groups.flatMap((group) =>
        group.modules.map((module) => module.id)
      )
    )
  )
);

const createInitialModuleMap = () =>
  ALL_TEMPLATE_MODULE_IDS.reduce((acc, moduleName) => {
    acc[moduleName] = [];
    return acc;
  }, {});

const initialState = {
  templates: [],
  templateDetails: null,
  moduleTemplates: [],
  templatesByModule: createInitialModuleMap(),
  loading: false,
  error: null,
};

export const getTemplates = createAsyncThunk(
  "ipdTemplates/getTemplates",
  async (params, { rejectWithValue }) => {
    try {
      const response = await ApiTemplate.getTemplates(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTemplateById = createAsyncThunk(
  "ipdTemplates/getTemplateById",
  async (params, { rejectWithValue }) => {
    try {
      const response = await ApiTemplate.getTemplateById(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTemplatesByModuleName = createAsyncThunk(
  "ipdTemplates/getTemplatesByModuleName",
  async (params, { rejectWithValue }) => {
    try {
      const response = await ApiTemplate.getTemplatesByModuleName(params);
      console.log(response,"response")
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTemplate = createAsyncThunk(
  "ipdTemplates/updateTemplate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiTemplate.updateTemplate(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  "ipdTemplates/deleteTemplate",
  async (params, { rejectWithValue }) => {
    try {
      const response = await ApiTemplate.deleteTemplate(params);
      return { response, params };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const normalizeTemplates = (payload) => {
  
  if (!payload) {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
//   if (Array.isArray(payload.templates)) {
//     console.log("normalizeTemplates - payload.templates is array, length:", payload.templates.length);
//     return payload.templates;
//   }
//   if (Array.isArray(payload.data)) {
//     console.log("normalizeTemplates - payload.data is array, length:", payload.data.length);
//     return payload.data;
//   }
//   if (payload.template) {
//     return [payload.template];
//   }
  return [];
};

const ensureModuleCache = (state, moduleName) => {
  if (!moduleName) return;
  if (!state.templatesByModule[moduleName]) {
    state.templatesByModule[moduleName] = [];
  }
};

const mergeTemplates = (existing = [], incoming = []) => {
  if (!incoming.length) return existing;
  const seen = new Set();
  const combined = [...incoming, ...existing];

  return combined.reduce((acc, template) => {
    const identifier = template?._id || template?.id;
    if (!identifier) return acc;
    if (!seen.has(identifier)) {
      seen.add(identifier);
      acc.push(template);
    }
    return acc;
  }, []);
};

const upsertTemplateInList = (list = [], template) => {
  if (!template) return list;
  const identifier = template._id || template.id;
  if (!identifier) return list;

  const index = list.findIndex(
    (item) => item._id === identifier || item.id === identifier
  );

  if (index === -1) {
    return [template, ...list];
  }

  const updated = [...list];
  updated[index] = template;
  return updated;
};

const removeTemplateFromList = (list = [], identifier) => {
  if (!identifier) return list;
  return list.filter(
    (item) => item._id !== identifier && item.id !== identifier
  );
};

const templatesSlice = createSlice({
  name: "ipdTemplates",
  initialState,
  reducers: {
    clearTemplateDetails(state) {
      state.templateDetails = null;
    },
    clearModuleTemplates(state) {
      state.moduleTemplates = [];
    },
    clearTemplatesByModule(state, action) {
      const moduleName = action.payload;
      if (moduleName) {
        state.templatesByModule[moduleName] = [];
      } else {
        state.templatesByModule = createInitialModuleMap();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplates.fulfilled, (state, action) => {
        state.loading = false;
        const templates = normalizeTemplates(action.payload);
        state.templates = templates.length ? templates : [];
      })
      .addCase(getTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.templates = [];
      })
      .addCase(getTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.templateDetails = action.payload || null;
      })
      .addCase(getTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.templateDetails = null;
      })
      .addCase(getTemplatesByModuleName.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplatesByModuleName.fulfilled, (state, action) => {
        try {
          state.loading = false;
          const templates = normalizeTemplates(action.payload);
          const moduleName =
            action.meta?.arg?.moduleName || action.meta?.arg?.module;

          state.moduleTemplates = templates.length ? templates : [];

          if (moduleName) {
            ensureModuleCache(state, moduleName);
            state.templatesByModule[moduleName] = templates;
            state.templates = mergeTemplates(state.templates, templates);
          } else {
            console.warn("⚠️ moduleName is missing! Cannot store templates.");
          }
        } catch (error) {
          console.error("ERROR in getTemplatesByModuleName.fulfilled:", error);
          state.loading = false;
          state.error = error.message;
        }
      })
      .addCase(getTemplatesByModuleName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const updated = Array.isArray(action.payload?.templates)
          ? action.payload.templates
          : Array.isArray(action.payload)
          ? action.payload
          : null;

        if (updated) {
          state.templates = updated;
        } else if (action.payload?.template) {
          const template = action.payload.template;
          const moduleName = template.module || template.moduleName;

          state.templates = upsertTemplateInList(state.templates, template);
          if (
            state.templateDetails &&
            (state.templateDetails._id === template._id ||
              state.templateDetails.id === template.id)
          ) {
            state.templateDetails = template;
          }

          if (moduleName) {
            ensureModuleCache(state, moduleName);
            state.templatesByModule[moduleName] = upsertTemplateInList(
              state.templatesByModule[moduleName],
              template
            );
          } else {
            Object.keys(state.templatesByModule).forEach((key) => {
              state.templatesByModule[key] = upsertTemplateInList(
                state.templatesByModule[key],
                template
              );
            });
          }
        } else if (action.payload && action.payload._id) {
          state.templates = upsertTemplateInList(state.templates, action.payload);
          if (
            state.templateDetails &&
            state.templateDetails._id === action.payload._id
          ) {
            state.templateDetails = action.payload;
          }

          Object.keys(state.templatesByModule).forEach((key) => {
            state.templatesByModule[key] = upsertTemplateInList(
              state.templatesByModule[key],
              action.payload
            );
          });
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta?.arg?._id || action.meta?.arg?.id;
        const moduleName =
          action.meta?.arg?.moduleName || action.meta?.arg?.module;

        if (deletedId) {
          state.templates = removeTemplateFromList(state.templates, deletedId);
          state.moduleTemplates = removeTemplateFromList(
            state.moduleTemplates,
            deletedId
          );

          if (moduleName) {
            ensureModuleCache(state, moduleName);
            state.templatesByModule[moduleName] = removeTemplateFromList(
              state.templatesByModule[moduleName],
              deletedId
            );
          } else {
            Object.keys(state.templatesByModule).forEach((key) => {
              state.templatesByModule[key] = removeTemplateFromList(
                state.templatesByModule[key],
                deletedId
              );
            });
          }

          if (
            state.templateDetails &&
            (state.templateDetails._id === deletedId ||
              state.templateDetails.id === deletedId)
          ) {
            state.templateDetails = null;
          }
        }
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearTemplateDetails,
  clearModuleTemplates,
  clearTemplatesByModule,
} = templatesSlice.actions;

const selectTemplatesSlice = (state) =>
  state?.ipdTemplates ||
  state?.templates ||
  state?.ipd?.templates ||
  state?.ipd?.ipdTemplates ||
  initialState;

export const selectTemplatesLoading = (state) =>
  selectTemplatesSlice(state).loading;
export const selectTemplatesError = (state) =>
  selectTemplatesSlice(state).error;
export const makeSelectTemplatesByModule = (moduleName) => (state) =>
  selectTemplatesSlice(state).templatesByModule[moduleName] || [];

export default templatesSlice.reducer;
