import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { parseApiError } from "../utils/utils";
import ApiAppointments from "../api/services/ApiAppointments";
import ApiMedication from "../api/services/ApiMedication";
import ApiPrintSettings from "../api/services/ApiPrintSettings";
import ApiVideoLibrary from "../api/services/ApiVideoLibrary";
import ApiMedicalCertificate from "../api/services/ApiMedicalCertificate";

const initialState = {
  sort_order: 'ascend',
  // sort_bill: {
  //   billDateSort: 'desc',
  //   totalAmountSort: 'desc',
  //   paidAmountSort: 'desc',
  //   clickedSort: 'billDateSort'
  // },
  profile: null,
  loading: false,
  error: null,
  customizedPadLeftList: [],
  customizedPadRightList: [],
  timingList: [],
  frequencyList: [],
  medicineTypeList: [],
  defaultPrintSettings: null,
  videoList: [],
  certificateList: [],
  patientCertificateList: [],
  userId: null,
  dragDrop: {},
  siteId: null,
  empNo: [],
  storeCode: null,
  hasLocation: null,
};

export const getProfile = createAsyncThunk(
  "doctors/getProfile",
  async () => {
    let result = {};
    try {
      result = await ApiAppointments.getProfile();
      if (result.status) {
        return result.data[0];
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const changeHospital = createAsyncThunk(
  "records/changeHospital",
  async (data) => {
    const result = await ApiAppointments.changeHospital(data);
    if (result.status) {
      return result;
    } else {
      throw Error(result.error);
    }
  }
);

export const customizedPad = createAsyncThunk(
  "records/customizedPad",
  async (data) => {
    try {
      const result = await ApiAppointments.customizedPad(data);
      if (result.status) {
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

export const swtichLayout = createAsyncThunk(
  "records/swtichLayout",
  async (data) => {
    try {
      const result = await ApiAppointments.swtichLayout(data);
      if (result.status) {
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

export const navigatetoTatvaPedia = createAsyncThunk(
  "records/navigatetoTatvaPedia",
  async () => {
    try {
      const result = await ApiAppointments.navigatetoTatvaPedia();
      if (result.status) {
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

export const showMedicineFrequency = createAsyncThunk(
  "medication/showMedicineFrequency",
  async () => {
    let result = {};
    result = await ApiMedication.showMedicineFrequency();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const showMedicineTime = createAsyncThunk(
  "medication/showMedicineTime",
  async () => {
    let result = {};
    result = await ApiMedication.showMedicineTime();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const getMedicineType = createAsyncThunk(
  "medication/getMedicineType",
  async () => {
    let result = {};
    result = await ApiMedication.getMedicineType();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const getDefaultPrintsettings = createAsyncThunk(
  "printSettings/getDefaultPrintsettings",
  async (data) => {
    let result = {};
    result = await ApiPrintSettings.getDefaultPrintsettings(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const savePrintsettings = createAsyncThunk(
  "printSettings/savePrintsettings",
  async (printInfo) => {
    const formData = new FormData();
    Object.keys(printInfo).forEach((key) => {
      formData.append(key, printInfo[key]);
    });

    try {
      const result = await ApiPrintSettings.savePrintsettings(formData);
      if (result.status) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      throw Error(error);
    }
  }
);

// For Video Library
export const listVideo = createAsyncThunk(
  "videoLibrary/listVideo",
  async () => {
    let result = {};
    result = await ApiVideoLibrary.listVideo();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

// For Medical Certificate
export const listCertificate = createAsyncThunk(
  "medicalCertificate/listCertificate",
  async () => {
    let result = {};
    result = await ApiMedicalCertificate.listCertificate();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const deleteCertificate = createAsyncThunk(
  "medicalCertificate/deleteCertificate",
  async (certificateId) => {
    const result = await ApiMedicalCertificate.deleteCertificate(certificateId);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const addCertificate = createAsyncThunk(
  "medicalCertificate/addCertificate",
  async (data) => {
    let result = {};
    result = await ApiMedicalCertificate.addCertificate(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const addPatientCertificate = createAsyncThunk(
  "medicalCertificate/addPatientCertificate",
  async (data) => {
    let result = {};
    result = await ApiMedicalCertificate.addPatientCertificate(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const editPatientCertificate = createAsyncThunk(
  "medicalCertificate/editPatientCertificate",
  async (data) => {
    let result = {};
    result = await ApiMedicalCertificate.editPatientCertificate(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const listPatientCertificate = createAsyncThunk(
  "medicalCertificate/listPatientCertificate",
  async (data) => {
    let result = {};
    result = await ApiMedicalCertificate.listPatientCertificate(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const deletePatientCertificate = createAsyncThunk(
  "medicalCertificate/deletePatientCertificate",
  async (data) => {
    const result = await ApiMedicalCertificate.deletePatientCertificate(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const viewPatientCertificate = createAsyncThunk(
  "medicalCertificate/viewPatientCertificate",
  async (data) => {
    let result = {};
    result = await ApiMedicalCertificate.viewPatientCertificate(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const zydusRefIds = createAsyncThunk(
  "records/zydusRefIds",
  async () => {
    const result = await ApiAppointments.zydusRefIds();
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const upsertDoctorSettingFlag = createAsyncThunk(
  "records/upsertDoctorSettingFlag",
  async (data) => {
    try {
      const result = await ApiAppointments.upsertDoctorSettingFlag(data);
      if (result.status) {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      throw Error(error);
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload?.user_id;
    },
    updateStatusMoengageB2C: (state) => {
      state.profile = { ...state.profile, old_b2c: state.profile.b2c, moengage_b2c_send: true }
    },
    changeLogoStatus: (state) => {
      state.profile = { ...state.profile, NavigatetoTatvaPedia: 1 }
    },
    changeSortOrder: (state, action) => {
      state.sort_order = action.payload
    },
    updatePatientCertificateList: (state, action) => {
      const { index, thumbnailUrl } = action.payload
      state.patientCertificateList[index]['thumbnailUrl'] = thumbnailUrl
    },
    updateWebsitePublish: (state, action) => {
      const { website_publish, publish_url } = action.payload
      state.profile = { ...state.profile, website_publish: website_publish, publish_url: publish_url }
    },
    updateDragDrop: (state, action) => {
      if (action.payload == 'symptoms') {
        state.dragDrop = { ...state.dragDrop, symptoms: true }
      } else if (action.payload == 'diagnosis') {
        state.dragDrop = { ...state.dragDrop, examinations: true }
      } else if (action.payload == 'medications') {
        state.dragDrop = { ...state.dragDrop, diagnosis: true }
      } else if (action.payload == 'advices') {
        state.dragDrop = { ...state.dragDrop, medications: true }
      } else if (action.payload == 'lab_investigation') {
        state.dragDrop = { ...state.dragDrop, lab_investigation: true }
      } else {
        state.dragDrop = {}
      }
    },
    updateHasLocation: (state, action) => {
      state.hasLocation = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = state.profile && state.profile.old_b2c == action.payload.b2c ? { ...state.profile, ...action.payload } : action.payload;
        state.hasLocation = action.payload.hasLocation;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.profile = null;
      })
      .addCase(changeHospital.pending, (state) => {
        state.loading = false;
      })
      .addCase(changeHospital.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changeHospital.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(customizedPad.pending, (state, action) => {
        state.loading = action.meta.arg.data.default ? false : true;
      })
      .addCase(customizedPad.fulfilled, (state, action) => {
        state.loading = false;
        state.customizedPadLeftList = action.payload.left != undefined ? action.payload.left : []
        state.customizedPadRightList = action.payload.right != undefined ? action.payload.right : []
      })
      .addCase(customizedPad.rejected, (state) => {
        state.loading = false;
      })
      .addCase(swtichLayout.pending, (state) => {
        state.loading = true;
      })
      .addCase(swtichLayout.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(swtichLayout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(navigatetoTatvaPedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(navigatetoTatvaPedia.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(navigatetoTatvaPedia.rejected, (state) => {
        state.loading = false;
      })
      .addCase(showMedicineFrequency.fulfilled, (state, action) => {
        state.frequencyList = action.payload;
      })
      .addCase(showMedicineFrequency.rejected, (state) => {
        state.frequencyList = [];
      })
      .addCase(showMedicineTime.fulfilled, (state, action) => {
        state.timingList = action.payload;
      })
      .addCase(showMedicineTime.rejected, (state) => {
        state.timingList = [];
      })
      .addCase(getMedicineType.fulfilled, (state, action) => {
        state.medicineTypeList = action.payload;
      })
      .addCase(getMedicineType.rejected, (state) => {
        state.medicineTypeList = [];
      })
      .addCase(getDefaultPrintsettings.fulfilled, (state, action) => {
        state.defaultPrintSettings = action.payload;
      })
      .addCase(getDefaultPrintsettings.rejected, (state) => {
        state.defaultPrintSettings = null;
      })
      .addCase(savePrintsettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(savePrintsettings.fulfilled, (state, action) => {
        state.loading = false;
        state.defaultPrintSettings = action.payload;
      })
      .addCase(savePrintsettings.rejected, (state) => {
        state.loading = false;
      })
      .addCase(listVideo.fulfilled, (state, action) => {
        state.videoList = action.payload;
      })
      .addCase(listVideo.rejected, (state) => {
        state.videoList = [];
      })
      .addCase(listCertificate.fulfilled, (state, action) => {
        state.certificateList = action.payload;
      })
      .addCase(listCertificate.rejected, (state) => {
        state.certificateList = [];
      })
      .addCase(deleteCertificate.pending, (state, action) => {
        const updatedData = state.certificateList.map((e) =>
          e.id == action.meta.arg ? { ...e, loading: true } : e
        );
        state.certificateList = [...updatedData];
      })
      .addCase(deleteCertificate.fulfilled, (state, action) => {
        const result = state.certificateList.filter(
          (item) => item.id !== action.payload.id
        );
        state.certificateList = [...result];
      })
      .addCase(deleteCertificate.rejected, (state, action) => {
        const updatedData = state.certificateList.map((e) =>
          e.id == action.meta.arg ? { ...e, loading: false } : e
        );
        state.certificateList = [...updatedData];
      })
      .addCase(addCertificate.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCertificate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addCertificate.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addPatientCertificate.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPatientCertificate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addPatientCertificate.rejected, (state) => {
        state.loading = false;
      })
      .addCase(editPatientCertificate.pending, (state) => {
        state.loading = true;
      })
      .addCase(editPatientCertificate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(editPatientCertificate.rejected, (state) => {
        state.loading = false;
      })
      .addCase(listPatientCertificate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(listPatientCertificate.fulfilled, (state, action) => {
        const updatedData = action.payload.map((e) => {
          const object = state.patientCertificateList?.find(e1 => e1.tcu_id === e.tcu_id)
          const findObject = object !== undefined ? object : {}
          return { ...findObject, ...e };
        });
        state.patientCertificateList = updatedData;

        state.loading = false;
      })
      .addCase(listPatientCertificate.rejected, (state) => {
        state.patientCertificateList = [];
        state.loading = false;
      })
      .addCase(deletePatientCertificate.pending, (state, action) => {
        const updatedData = state.patientCertificateList.map((e) =>
          e.tcu_id == action.meta.arg ? { ...e, loading: true } : e
        );
        state.patientCertificateList = [...updatedData];
      })
      .addCase(deletePatientCertificate.fulfilled, (state, action) => {
        const result = state.patientCertificateList.filter(
          (item) => item.tcu_id !== action.payload.tcu_id
        );
        state.patientCertificateList = [...result];
      })
      .addCase(deletePatientCertificate.rejected, (state, action) => {
        const updatedData = state.patientCertificateList.map((e) =>
          e.tcu_id == action.meta.arg ? { ...e, loading: false } : e
        );
        state.patientCertificateList = [...updatedData];
      })
      .addCase(viewPatientCertificate.pending, (state, action) => {
        if (action.meta.arg.configurePrintSetting === undefined) {
          state.loading = true
        }
      })
      .addCase(viewPatientCertificate.fulfilled, (state, action) => {
        if (action.meta.arg.configurePrintSetting === undefined) {
          state.loading = false;
        }
      })
      .addCase(viewPatientCertificate.rejected, (state, action) => {
        if (action.meta.arg.configurePrintSetting === undefined) {
          state.loading = false;
        }
      })
      .addCase(upsertDoctorSettingFlag.fulfilled, (state, action) => {
        const updatedFlags = [...state.profile.userSettingFlag];
        const index = updatedFlags.findIndex(item => item.type === action.meta.arg.type);
        if (index !== -1) {
          updatedFlags[index].status = 1;
        } else {
          updatedFlags.push({ type: action.meta.arg.type, status: 1 });
        }
        state.profile.userSettingFlag = updatedFlags
        console.log(state.profile)
      })
      .addCase(zydusRefIds.fulfilled, (state, action) => {
        if (action.payload.siteId !== undefined) {
          state.siteId = action.payload.siteId;
          state.empNo = action.payload.empNo;
          state.storeCode = action.payload.storeCode;
        }
      })
      .addCase(zydusRefIds.rejected, (state) => {
        state.siteId = null;
        state.empNo = [];
        state.storeCode = null;
      });
  },
});

export const { setUserId, updateStatusMoengageB2C, changeLogoStatus, changeSortOrder, updatePatientCertificateList, updateWebsitePublish, updateDragDrop, updateHasLocation } = doctorsSlice.actions
export default doctorsSlice.reducer;