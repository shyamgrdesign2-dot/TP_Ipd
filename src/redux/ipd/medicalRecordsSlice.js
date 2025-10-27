import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiAppointments from "../../api/services/ApiAppointments";
import ApiMedicalRecords from "../../api/services/ipd/ApiMedicalRecords";
import { ictAuthToken } from "../appointmentsSlice";
import { PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN } from "../../utils/constants";
import moment from "moment";
import config from "../../config";

const initialState = {
  uploadDocCategories: [],
  medicalRecords: [],
  allUploadedDocs: [],
  patientUploadedDocs: [],
  isLoading: false,
};

// Async thunk for getting medical records documents
export const getMedicalRecordsDocuments = createAsyncThunk(
  "medicalRecords/getMedicalRecordsDocuments",
  async ({ patientId, admissionId, category = "medical_records" }, { rejectWithValue }) => {
    try {
      const result = await ApiMedicalRecords.getDocuments({ patientId, admissionId, category });
      return result;
    } catch (error) {
      console.error("Error while fetching medical records documents: ", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for uploading/updating a document
export const uploadMedicalRecordDocument = createAsyncThunk(
  "medicalRecords/uploadMedicalRecordDocument",
  async ({ patientId, admissionId, category, subCategory, file, name, thumbnail, notes }, { rejectWithValue }) => {
    try {
      const result = await ApiMedicalRecords.putDocument({
        patientId,
        admissionId,
        category,
        subCategory,
        file,
        name,
        thumbnail,
        notes,
      });
      return result;
    } catch (error) {
      console.error("Error while uploading/updating document: ", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for deleting a document
export const deleteMedicalRecordDocument = createAsyncThunk(
  "medicalRecords/deleteMedicalRecordDocument",
  async ({ patientId, admissionId, id }, { rejectWithValue }) => {
    try {
      const result = await ApiMedicalRecords.deleteDocument({ patientId, admissionId, id });
      return { result, deletedId: id };
    } catch (error) {
      console.error("Error while deleting document: ", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const medicalRecordsSlice = createSlice({
  name: "medicalRecords",
  initialState,
  reducers: {
    resetUploadDocState: (state) => {
      state.medicalRecords = [];
    },
    setUploadDocCategories: (state, action) => {
      const categoriesOrder = [
        "Pathology",
        "Radiology",
        "Prescription",
        "Other",
      ];
      if (action?.payload?.length > 0) {
        const reorderedCategories = categoriesOrder.map((name) =>
          action.payload.find((category) => category.category_name === name)
        );
        state.uploadDocCategories = reorderedCategories;
      }
    },
    setLoadingStatus: (state, action) => {
      state.isLoading = action.payload;
    },
    setMedicalRecords: (state, action) => {
      state.medicalRecords = action.payload;
    },
    setPatientUploadedDocs: (state, action) => {
      state.patientUploadedDocs = action.payload;
    },
    setAllUploadedDocs: (state, action) => {
      state.allUploadedDocs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Zydus API responses
      // .addCase(zydusDocsList.fulfilled, (state, action) => {
      //   const updatedData = action.payload.map(e => {
      //     return {
      //       id: e?.labResultId,
      //       category_id: -2,
      //       name: e?.serviceName,
      //       display_name: e?.serviceName,
      //       url: `${config.zydus_proxy_url}/ictApiProxy/emr/lab/report/print?sampleId=${e?.sampleId}&labResultId=${e?.labResultId}`,
      //       um_id: action.meta.arg.um_id,
      //       thumbnail_url: '',
      //       created_date: moment(e?.certifiedDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      //       investigation_date: moment(e?.certifiedDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      //       notes: ''
      //     }
      //   })
      //   state.medicalRecords.unshift(...updatedData)
      // })
      // .addCase(zydusRadioList.fulfilled, (state, action) => {
      //   const updatedData = action.payload.map(e => {
      //     return {
      //       id: e?.orderId,
      //       category_id: -3,
      //       name: `${e?.serviceName}-${e?.orderStatus}`,
      //       display_name: `${e?.serviceName}-${e?.orderStatus}`,
      //       url: null,
      //       um_id: action.meta.arg.um_id,
      //       thumbnail_url: '',
      //       created_date: moment(e?.orderConformedDate).format('YYYY-MM-DD'),
      //       investigation_date: moment(e?.orderConformedDate).format('YYYY-MM-DD'),
      //       notes: ''
      //     }
      //   })
      //   state.medicalRecords.unshift(...updatedData)
      // })
      // Medical Records API responses
      .addCase(getMedicalRecordsDocuments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMedicalRecordsDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicalRecords = action.payload || [];
      })
      .addCase(getMedicalRecordsDocuments.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadMedicalRecordDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadMedicalRecordDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add the new document to the medical records
        if (action.payload) {
          state.medicalRecords.unshift(action.payload);
        }
      })
      .addCase(uploadMedicalRecordDocument.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteMedicalRecordDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMedicalRecordDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted document from medical records
        const deletedId = action.payload.deletedId;
        state.medicalRecords = state.medicalRecords.filter(doc => doc._id !== deletedId);
      })
      .addCase(deleteMedicalRecordDocument.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  resetUploadDocState,
  setUploadDocCategories,
  setLoadingStatus,
  setMedicalRecords,
  setPatientUploadedDocs,
  setAllUploadedDocs,
} = medicalRecordsSlice.actions;
export default medicalRecordsSlice.reducer;
