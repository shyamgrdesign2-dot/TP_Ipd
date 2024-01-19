import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ApiAppointments from "../api/services/ApiAppointments";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    loading: false,
    error: null,
    queueCount: 0,
    finishedCount: 0,
    cancelledCount: 0,
    setOnLoad: true,
    appointmentsData: [],
    caseTypes: [],
    salutationData: [],
    pincodeInfo: {},
    patients: null,
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

export const endVisit = createAsyncThunk(
    "records/endVisit",
    async (data) => {
        let result = {};
        result = await ApiAppointments.endVisit(data);
        if (result.status) {
            return result;
        } else {
            throw Error(result.error);
        }
    }
);

export const clearSearch = createAsyncThunk("records/clearSearch", async () => {
    return null;
});

export const searchPatients = createAsyncThunk(
    "records/searchPatients",
    async (searchQuery) => {
        let result = {};
        result = await ApiAppointments.searchPatients(searchQuery);
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

        try {
            const result = await ApiAppointments.addPatient(formData);
            console.log("result: ", result);
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
                    return { ...e, key: uuidv4() }
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
                const updatedData = state.appointmentsData.filter(e => e.pam_id != action.meta.arg.pam_id);
                state.appointmentsData = updatedData
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
                const updatedData = state.appointmentsData.filter(e => e.pam_id != action.meta.arg.pam_id);
                state.appointmentsData = updatedData
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
            .addCase(searchPatients.rejected, (state,action) => {
                state.loading = false;
                state.patients = []
                state.error = action.error.message
            })
            .addCase(listSalutation.pending, (state) => {
                state.loading = true;
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
                state.patientDetals = action.payload;
            })
            .addCase(addPatient.rejected, (state) => {
                state.loading = false;
                state.patientDetals = null;
            })
    },
});

export default appointmentsSlice.reducer;