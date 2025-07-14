import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiAppointments from "../api/services/ApiAppointments";
import { v4 as uuidv4 } from "uuid";
import {
  PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN,
  TAB_FINISHED,
  TAB_ZYDUS_ENCOUNTER,
} from "../utils/constants";
import moment from "moment";
import { calculateAge } from "../utils/utils";

const initialState = {
  loading: false,
  error: null,
  queueCount: 0,
  finishedCount: 0,
  cancelledCount: 0,
  zydusEncounterCount: 0,
  zydusAappointmentCount: 0,
  setOnLoad: true,
  appointmentsData: [],
  finishedData: [],
  zydusAappointmentData: [],
  caseTypes: [],
  salutationData: [],
  pincodeInfo: {},
  patients: null,
  patients_details: null,
  categoriesList: [],
  snapRxUnDigitisedIds: [],
};

export const getCaseTypes = createAsyncThunk(
  "records/getCaseTypes",
  async () => {
    try {
      const result = await ApiAppointments.getCaseTypes();
      if (result.status) {
        return result.data.case_type;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const getAllAppointment = createAsyncThunk(
  "records/getAllAppointment",
  async (data) => {
    try {
      const result = await ApiAppointments.getAllAppointment(data);
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

export const getSnapRxUnDigitisedIds = createAsyncThunk(
  "records/getSnapRxUnDigitisedIds",
  async () => {
    try {
      const result = await ApiAppointments.getSnapRxUnDigitisedIds();
      if (
        result?.unDigitizedAppointmentIds ||
        result?.unReviewedAppointmentIds
      ) {
        return result;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const cancelAppointments = createAsyncThunk(
  "records/cancelAppointments",
  async (data) => {
    let result = {};
    result = await ApiAppointments.cancelAppointments(data);
    if (result.status) {
      return result;
    } else {
      throw Error(result.error);
    }
  }
);

export const endVisit = createAsyncThunk("records/endVisit", async (data) => {
  let result = {};
  result = await ApiAppointments.endVisit(data);
  if (result.status) {
    return result;
  } else {
    throw Error(result.error);
  }
});

export const clearSearch = createAsyncThunk("records/clearSearch", async () => {
  return null;
});

export const searchPatients = createAsyncThunk(
  "records/searchPatients",
  async (data) => {
    let result = {};
    result = await ApiAppointments.searchPatients(
      data.searchQuery,
      data.company
    );
    if (data.company === "" && result.status) {
      return result.data;
    } else if (data.company === "zydus" && result?.response?.docs?.length > 0) {
      return result.response.docs;
    } else {
      throw Error(result.error);
    }
  }
);

export const synczyduspatient = createAsyncThunk(
  "records/synczyduspatient",
  async (data) => {
    let result = {};
    result = await ApiAppointments.synczyduspatient(data);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const listSalutation = createAsyncThunk(
  "records/listSalutation",
  async () => {
    try {
      const result = await ApiAppointments.listSalutation();
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

export const searchPincode = createAsyncThunk(
  "records/searchPincode",
  async (pincode) => {
    const body = {
      searchPincode: pincode,
    };
    try {
      const result = await ApiAppointments.searchPincode(body);
      if (result.status && result.data.pincode == pincode) {
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

export const addPatient = createAsyncThunk(
  "records/addPatient",
  async (patientInfo) => {
    const formData = new FormData();
    Object.keys(patientInfo).forEach((key) => {
      formData.append(key, patientInfo[key]);
    });
    const result = await ApiAppointments.addPatient(formData);
    if (result.status) {
      return result.data;
    } else {
      throw Error(result.error);
    }
  }
);

export const editPatient = createAsyncThunk(
  "records/editPatient",
  async (patientInfo) => {
    try {
      const formData = new FormData();
      Object.keys(patientInfo).forEach((key) => {
        formData.append(key, patientInfo[key]);
      });
      const result = await ApiAppointments.editPatient(formData);
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

export const viewPatient = createAsyncThunk(
  "records/viewPatient",
  async (data) => {
    try {
      const result = await ApiAppointments.viewPatient(data);
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

export const ictAuthToken = createAsyncThunk(
  "records/ictAuthToken",
  async () => {
    const result = await ApiAppointments.ictAuthToken();
    if (result.status == "success") {
      return result;
    } else {
      throw Error(result.error);
    }
  }
);

export const zydusConsultAppoint = createAsyncThunk(
  "records/zydusConsultAppoint",
  async ({ siteId, empNo, date, apStatue }, { dispatch }) => {
    try {
      let result = {};
      if (apStatue === TAB_ZYDUS_ENCOUNTER) {
        result = await ApiAppointments.consultations(siteId, empNo, date);
      } else {
        result = await ApiAppointments.appointments(siteId, empNo, date);
      }
      if (result.status == "success") {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      if (error.response.status === 401) {
        const action = await dispatch(ictAuthToken());
        if (action.meta.requestStatus === "fulfilled") {
          await localStorage.setItem(
            PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN,
            JSON.stringify(action.payload.tokenNo)
          );
          dispatch(zydusConsultAppoint({ siteId, empNo, date, apStatue }));
        }
      }
      // console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const zydusAppointment = createAsyncThunk(
  "records/zydusAppointment",
  async ({ siteId, empNo, date }, { dispatch }) => {
    try {
      const result = await ApiAppointments.appointments(siteId, empNo, date);
      if (result.status == "success") {
        return result.data;
      } else {
        throw Error(result.error);
      }
    } catch (error) {
      if (error.response.status === 401) {
        const action = await dispatch(ictAuthToken());
        if (action.meta.requestStatus === "fulfilled") {
          await localStorage.setItem(
            PERSISTANT_STORAGE_KEY_ZYDUS_TOKEN,
            JSON.stringify(action.payload.tokenNo)
          );
          dispatch(zydusAppointment({ siteId, empNo, date }));
        }
      }
      // console.log("error: ", error);
      throw Error(error);
    }
  }
);

export const syncZydusPatientAndAppointment = createAsyncThunk(
  "records/syncZydusPatientAndAppointment",
  async (data) => {
    const result = await ApiAppointments.syncZydusPatientAndAppointment(data);
    if (result.status) {
      return result;
    } else {
      throw Error(result.error);
    }
  }
);

export const copyGetAllAppointment = createAsyncThunk(
  "records/copyGetAllAppointment",
  async (data) => {
    try {
      const result = await ApiAppointments.getAllAppointment(data);
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

export const copyGetAllAppointment1 = createAsyncThunk(
  "records/copyGetAllAppointment1",
  async (data) => {
    try {
      const result = await ApiAppointments.getAllAppointment(data);
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

export const placeIctOrder = createAsyncThunk(
  "records/placeIctOrder",
  async (data) => {
    try {
      const result = await ApiAppointments.placeIctOrder(data);
      return result;
    } catch (error) {
      throw Error(error);
    }
  }
);

export const listCategories = createAsyncThunk(
  "records/listCategories",
  async () => {
    try {
      const result = await ApiAppointments.listCategories();
      return result;
    } catch (error) {
      console.log("error: ", error);
      throw Error(error);
    }
  }
);

const appointmentsSlice = createSlice({
  name: "records",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCaseTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCaseTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.caseTypes = action.payload;
      })
      .addCase(getCaseTypes.rejected, (state, action) => {
        state.caseTypes = [];
        state.loading = false;
      })
      .addCase(getAllAppointment.pending, (state) => {
        state.loading = true;
        state.setOnLoad = true;
      })
      .addCase(getAllAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.setOnLoad = true;

        const updatedData = action.payload.app_data.map((e) => {
          return { ...e, key: uuidv4() };
        });
        if (action.meta.arg.page == 0) {
          state.queueCount = action.payload.queue_count;
          state.finishedCount = action.payload.finished_count;
          state.cancelledCount = action.payload.cancelled_count;
          state.appointmentsData = updatedData;
        } else {
          state.appointmentsData = [...state.appointmentsData, ...updatedData];
        }
      })
      .addCase(getAllAppointment.rejected, (state, action) => {
        state.loading = false;
        state.setOnLoad = false;
        if (action.meta.arg.page == 0) {
          state.queueCount = 0;
          state.finishedCount = 0;
          state.cancelledCount = 0;
          state.appointmentsData = [];
        }
      })
      .addCase(cancelAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.queueCount = state.queueCount - 1;
        state.cancelledCount = state.cancelledCount + 1;
        const updatedData = state.appointmentsData.filter(
          (e) => e.pam_id != action.meta.arg.pam_id
        );
        state.appointmentsData = updatedData;
      })
      .addCase(cancelAppointments.rejected, (state) => {
        state.loading = false;
      })
      .addCase(endVisit.pending, (state) => {
        state.loading = true;
      })
      .addCase(endVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.queueCount = state.queueCount - 1;
        state.finishedCount = state.finishedCount + 1;
        const updatedData = state.appointmentsData.filter(
          (e) => e.pam_id != action.meta.arg.pam_id
        );
        state.appointmentsData = updatedData;
      })
      .addCase(endVisit.rejected, (state) => {
        state.loading = false;
      })
      .addCase(clearSearch.fulfilled, (state) => {
        state.loading = false;
        state.patients = null;
      })
      .addCase(searchPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(searchPatients.rejected, (state, action) => {
        state.loading = false;
        state.patients = [];
        state.error = action.error.message;
      })
      .addCase(listSalutation.pending, (state) => {
        // state.loading = true;
      })
      .addCase(listSalutation.fulfilled, (state, action) => {
        state.loading = false;
        state.salutationData = action.payload;
      })
      .addCase(listSalutation.rejected, (state) => {
        state.loading = false;
      })
      .addCase(searchPincode.fulfilled, (state, action) => {
        state.pincodeInfo = action.payload;
      })
      .addCase(searchPincode.rejected, (state) => {
        state.pincodeInfo = null;
      })
      .addCase(addPatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addPatient.rejected, (state) => {
        state.loading = false;
      })
      .addCase(editPatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(editPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients_details = {
          ...state.patients_details,
          ...action.payload,
        };
      })
      .addCase(editPatient.rejected, (state) => {
        state.loading = false;
      })
      .addCase(viewPatient.pending, (state) => {
        state.loading = true;
        state.patients_details = null;
      })
      .addCase(viewPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients_details = action.payload;
      })
      .addCase(viewPatient.rejected, (state) => {
        state.loading = false;
        state.patients_details = null;
      })
      .addCase(zydusConsultAppoint.pending, (state) => {
        state.loading = true;
        state.setOnLoad = true;
      })
      .addCase(zydusConsultAppoint.fulfilled, (state, action) => {
        state.loading = false;
        state.setOnLoad = false;

        let modifiedData = [];
        if (action.meta.arg.apStatue === TAB_ZYDUS_ENCOUNTER) {
          modifiedData = action.payload.map((e) => {
            const age = calculateAge(
              moment(e.dob, "DD-MM-YYYY").format("YYYY-MM-DD")
            );
            return {
              ...e,
              key: uuidv4(),
              pm_fullname: e.patientName,
              apTime: moment(e.encounterDateTime, "DD-MM-YYYY HH:mm").format(
                "hh:mm A"
              ),
              apDate: moment(e.encounterDateTime, "DD-MM-YYYY HH:mm").format(
                "Do MMM YYYY"
              ),
              DOB: moment(e.dob, "DD-MM-YYYY").format("Do MMM YYYY"),
              ageYears: age?.years,
              ageMonths: age?.months,
              ageDays: age?.days,
              pm_gender: e.gender,
              pm_contact_no: e.mobileNo,
              patient_address: e.patientAddress,
              toct_type: e.consultationType,
            };
          });
        } else {
          modifiedData = action.payload.map((e) => {
            // const age = calculateAge(moment(e.dob, 'DD-MM-YYYY').format('YYYY-MM-DD'));
            return {
              ...e,
              key: uuidv4(),
              pm_fullname: e.patientName,
              apTime: moment(e.fromTime, "DD-MM-YYYY HH:mm").format("hh:mm A"),
              apDate: moment(e.fromTime, "DD-MM-YYYY HH:mm").format(
                "Do MMM YYYY"
              ),
              DOB: "",
              ageYears: 0,
              ageMonths: 0,
              ageDays: 0,
              pm_gender: e.gender,
              pm_contact_no: e.mobileNo,
              patient_address: e.location,
            };
          });
        }

        const updatedData = action.meta.arg.filterVisitType
          ? modifiedData?.filter((x) =>
              action.meta.arg.filterVisitType.split(",").includes(x.toct_type)
            )
          : modifiedData;

        if (action.meta.arg.apStatue === TAB_ZYDUS_ENCOUNTER) {
          state.zydusEncounterCount = modifiedData?.length;
        } else {
          state.zydusAappointmentCount = modifiedData?.length;
        }
        if (action.meta.arg.page == 0) {
          state.appointmentsData = updatedData;
        } else {
          state.appointmentsData = [...state.appointmentsData, ...updatedData];
        }
      })
      .addCase(zydusConsultAppoint.rejected, (state, action) => {
        state.loading = false;
        state.setOnLoad = false;
        if (action.meta.arg.page == 0) {
          state.appointmentsData = [];
        }
      })
      .addCase(zydusAppointment.fulfilled, (state, action) => {
        state.zydusAappointmentData = action.payload;
      })
      .addCase(copyGetAllAppointment1.pending, (state) => {
        state.setOnLoad = true;
      })
      .addCase(copyGetAllAppointment1.fulfilled, (state, action) => {
        if (action.meta.arg.apStatue == TAB_FINISHED) {
          state.setOnLoad = true;
          const updatedData = action.payload.app_data.map((e) => {
            return { ...e, key: uuidv4() };
          });
          if (action.meta.arg.page == 0) {
            state.queueCount = action.payload.queue_count;
            state.finishedCount = action.payload.finished_count;
            state.cancelledCount = action.payload.cancelled_count;
            state.finishedData = updatedData;
          } else {
            state.finishedData = [...state.finishedData, ...updatedData];
          }
        }
      })
      .addCase(copyGetAllAppointment1.rejected, (state, action) => {
        state.setOnLoad = false;
      })
      .addCase(listCategories.fulfilled, (state, action) => {
        state.categoriesList = action.payload?.categories;
      })
      .addCase(listCategories.rejected, (state, action) => {
        state.categoriesList = [];
      })
      .addCase(getSnapRxUnDigitisedIds.fulfilled, (state, action) => {
        state.snapRxUnDigitisedIds = action.payload;
      })
      .addCase(getSnapRxUnDigitisedIds.rejected, (state, action) => {
        state.snapRxUnDigitisedIds = [];
      });
  },
});

export default appointmentsSlice.reducer;
