import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

import appointmentsSlice from "./appointmentsSlice";
import doctorsSlice from "./doctorsSlice";
import symptomsSlice from "./symptomsSlice";
import examinationSlice from "./examinationSlice";
import diagnosisSlice from "./diagnosisSlice";
import adviceSlice from "./adviceSlice";
import investigationSlice from "./investigationSlice";
import medicationSlice from "./medicationSlice";
import vitalsSlice from "./vitalsSlice";
import medicalhistorySlice from "./medicalhistorySlice";
import caseManagerSlice from "./caseManagerSlice";
import followUpSlice from "./followUpSlice";
import vaccineSlice from "./vaccineSlice";
import growthChartSlice from "./growthChartSlice";
import doctorWebsiteSlice from "./doctorWebsiteSlice";
import obstetricSlice from "./obstetricSlice";
import uploadDocSlice from "./uploadDocSlice";
import ddxSlice from "./ddxSlice";
import subscriptionReducer from "./subscriptionSlice";
import doctorModalReducer from "./doctorModalSlice";
import surgicalSlice from "./surgicalSlice";
import bulkMessagesSlice from "./bulkMessagesSlice";
import customModuleReducer from "./customModuleSlice";
import snapRxDigitizationSlice from "./snapRxDigitizationSlice";
import billingSlice from "./billingSlice";
import shortLinkSlice from "./shortLinkSlice";
import monetizationSlice from "./monetizationSlice";
import prescriptionSlice from "./prescriptionSlice";
import ipdSlice from "./ipd/ipdSlice";
import assessmentSlice from "./ipd/assessmentsFormSlice";
import otNotesSlice from "./ipd/otNotesSlice";
import crossReferralSlice from "./ipd/crossReferralSlice";
import inPatientsSlice from "./ipd/inPatientsSlice";
import consultantNotesSlice from "./ipd/consultantNotesSlice";
import progressNotesSlice from "./ipd/progressNotesSlice";
import medicalRecordsSlice from "./ipd/medicalRecordsSlice";
import labResultsSlice from "./ipd/labResultsSlice";
import printSettingsSlice from "./ipd/printSettingsSlice";
import dischargeSummarySlice, { setSurgeriesPerformed } from "./ipd/dischargeSummarySlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["doctors"],
};

const rootReducer = combineReducers({
  records: appointmentsSlice,
  doctors: doctorsSlice,
  symptoms: symptomsSlice,
  examination: examinationSlice,
  assessment: assessmentSlice,
  otNotes: otNotesSlice,
  ipd: ipdSlice,
  surgical: surgicalSlice,
  diagnosis: diagnosisSlice,
  advice: adviceSlice,
  investigation: investigationSlice,
  medication: medicationSlice,
  vitals: vitalsSlice,
  medicalhistory: medicalhistorySlice,
  caseManager: caseManagerSlice,
  followUp: followUpSlice,
  vaccines: vaccineSlice,
  growthChart: growthChartSlice,
  doctorWebsite: doctorWebsiteSlice,
  obstetric: obstetricSlice,
  uploadDoc: uploadDocSlice,
  ddx: ddxSlice,
  subscription: subscriptionReducer,
  doctorModal: doctorModalReducer,
  bulkMessages: bulkMessagesSlice,
  customModules: customModuleReducer,
  billing: billingSlice,
  snapRx: snapRxDigitizationSlice,
  shortLink: shortLinkSlice,
  monetization: monetizationSlice,
  prescription: prescriptionSlice,
  inPatients: inPatientsSlice,
  consultantNotes: consultantNotesSlice,
  progressNotes: progressNotesSlice,
  medicalRecords: medicalRecordsSlice,
  labResults: labResultsSlice,
  crossReferral: crossReferralSlice,
  dischargeSummary: dischargeSummarySlice,
  printSettings: printSettingsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create listener middleware
const listenerMiddleware = createListenerMiddleware();

// Function to transform otNotesData to surgeries performed array
const transformOtNotesToSurgeriesPerformed = (otNotesData) => {
  if (!Array.isArray(otNotesData) || otNotesData.length === 0) {
    return [];
  }

  return otNotesData.map((item, index) => {
    const key = item.key || item.id || item.title || `surgery_${index}`;
    const procedureName = item?.otNotes?.surgeryDetails?.procedureName;
    const surgeryDate = item?.otNotes?.surgeryDetails?.surgeryDate;
    
    // Handle procedureName as array (join with comma) or string
    const procedureText = Array.isArray(procedureName) 
      ? procedureName.join(', ') 
      : procedureName || '';
    
    // Create a text representation for display
    const displayText = surgeryDate 
      ? `${procedureText} (${surgeryDate})`
      : procedureText;
    
    return {
      key,
      text: displayText,
      procedureName: Array.isArray(procedureName) ? procedureName : (procedureName ? [procedureName] : []),
      surgeryDate: surgeryDate || "",
      surgeryStartTime: item?.otNotes?.surgeryDetails?.surgeryStartTime || "",
      surgeryEndTime: item?.otNotes?.surgeryDetails?.surgeryEndTime || ""
    };
  });
};

// Add listener for otNotesData changes
listenerMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    // Listen for any action that might change otNotesData
    return currentState.otNotes?.otNotesData !== previousState?.otNotes?.otNotesData;
  },
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const otNotesData = state.otNotes?.otNotesData;
    
    // Transform the data and dispatch to discharge summary
    const surgeriesPerformed = transformOtNotesToSurgeriesPerformed(otNotesData);
    listenerApi.dispatch(setSurgeriesPerformed(surgeriesPerformed));
  },
});

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).prepend(listenerMiddleware.middleware),
});

const persistor = persistStore(store);

export { store, persistor };
