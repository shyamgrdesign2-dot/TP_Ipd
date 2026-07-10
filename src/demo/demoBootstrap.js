import axios from "axios";
import apiInstance from "../api/services/axiosService";
import {
  DEMO_DOCTOR,
  makeMockJwt,
  MOCK_PATIENTS,
  MOCK_VITALS,
  MOCK_MAR,
  MOCK_FLUID,
  MOCK_LABS,
  MOCK_RISK_SCORES,
  MOCK_NURSING_NOTES,
  MOCK_WARD_TASKS,
  MOCK_PROGRESS_TIMELINE,
  MOCK_ASSESSMENTS,
  MOCK_PROGRESS_NOTES_IPD,
  MOCK_CONSULTANT_NOTES_IPD,
  MOCK_OT_NOTES_IPD,
  findAdmissionId,
} from "./demoData";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";

var IS_DEMO = process.env.REACT_APP_DEMO === "true";

function mockResponse(data, status) {
  return Promise.resolve({
    data: data,
    status: status || 200,
    statusText: "OK",
    headers: {},
    config: {},
  });
}

function setupDemoAuth() {
  var token = makeMockJwt();
  localStorage.setItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN, JSON.stringify(token));
}

function findPatientId(url) {
  var m =
    url.match(/patient[_-]?[Ii]d[=/]([A-Z0-9-]+)/) ||
    url.match(/entries\/(PAT-\d+)/) ||
    url.match(/patient\/(PAT-\d+)/);
  return m ? m[1] : null;
}

function demoRequestInterceptor(config) {
    var url = (config.url || "") + "";
    var base = (config.baseURL || "") + "";
    var full = base + url;

    if (full.includes("/patients/filters")) {
      var fieldMatch = full.match(/field=(\w+)/);
      var field = fieldMatch ? fieldMatch[1] : "";
      config.adapter = function () {
        if (field === "doctor") {
          return mockResponse([
            { id: 9001, name: "Dr. Rajesh Sharma" },
          ]);
        }
        if (field === "ward") {
          return mockResponse([
            { id: 1, title: "General Ward A" },
            { id: 2, title: "ICU" },
            { id: 3, title: "General Ward B" },
            { id: 4, title: "Maternity Ward" },
            { id: 5, title: "Surgical Ward" },
          ]);
        }
        return mockResponse([]);
      };
      return config;
    }

    if (full.match(/\/patients(\?|$)/) && !full.includes("/patient-details")) {
      config.adapter = function () {
        return mockResponse({
          status: true,
          patients: MOCK_PATIENTS,
          pagination: {
            page: 1,
            limit: 10,
            total: MOCK_PATIENTS.length,
            totalPages: 1,
          },
        });
      };
      return config;
    }

    if (full.includes("/account-status") || full.includes("/account/check")) {
      config.adapter = function () {
        return mockResponse({ account_status: true });
      };
      return config;
    }

    if (full.includes("/showProfile") || full.includes("/profile") || full.includes("/getProfile")) {
      config.adapter = function () {
        return mockResponse({ status: true, data: [DEMO_DOCTOR] });
      };
      return config;
    }

    if (full.includes("/changeHospital")) {
      config.adapter = function () {
        return mockResponse({ status: true, data: [DEMO_DOCTOR] });
      };
      return config;
    }

    if (full.includes("/video") || full.includes("/video-library")) {
      config.adapter = function () {
        return mockResponse({ status: true, data: [] });
      };
      return config;
    }

    if (full.includes("/billing") || full.includes("/bills")) {
      config.adapter = function () {
        return mockResponse({ status: true, data: {} });
      };
      return config;
    }

    if (full.includes("/certificate")) {
      config.adapter = function () {
        return mockResponse({ status: true, data: [] });
      };
      return config;
    }

    if (full.includes("growthbook")) {
      config.adapter = function () {
        return mockResponse({ features: {} });
      };
      return config;
    }

    if (url.includes("/vitals") || full.includes("/vitals")) {
      var pid = findPatientId(full);
      config.adapter = function () {
        return mockResponse({ status: true, data: MOCK_VITALS[pid] || MOCK_VITALS["PAT-001"] });
      };
      return config;
    }

    if (url.includes("/drug-admin") || url.includes("/mar")) {
      var pid2 = findPatientId(full);
      config.adapter = function () {
        return mockResponse({ status: true, data: MOCK_MAR[pid2] || [] });
      };
      return config;
    }

    if (url.includes("/fluid-balance") || url.includes("/fluid")) {
      var pid3 = findPatientId(full);
      config.adapter = function () {
        return mockResponse({ status: true, data: MOCK_FLUID[pid3] || { totalIntake: 0, totalOutput: 0, balance: 0, balanceDate: "" } });
      };
      return config;
    }

    if (url.includes("/risk-score")) {
      var pid5 = findPatientId(full);
      config.adapter = function () {
        return mockResponse({ status: true, data: MOCK_RISK_SCORES[pid5] || [] });
      };
      return config;
    }

    // ─── IPD-SPECIFIC interceptors BEFORE broad /notes and /labs catches ─────

    if ((url.includes("/assessments") || full.includes("/assessments")) && !url.includes("/prescriptions")) {
      var admId1 = findAdmissionId(full);
      config.adapter = function () {
        var data = admId1 && MOCK_ASSESSMENTS[admId1] ? MOCK_ASSESSMENTS[admId1] : {};
        return mockResponse(data);
      };
      return config;
    }

    if (url.includes("/progress-notes") || full.includes("/progress-notes")) {
      var admId2 = findAdmissionId(full);
      config.adapter = function () {
        return mockResponse(admId2 && MOCK_PROGRESS_NOTES_IPD[admId2] ? MOCK_PROGRESS_NOTES_IPD[admId2] : []);
      };
      return config;
    }

    if (url.includes("/progress-timeline")) {
      var admId2b = findAdmissionId(full);
      config.adapter = function () {
        return mockResponse(admId2b && MOCK_PROGRESS_TIMELINE[admId2b] ? MOCK_PROGRESS_TIMELINE[admId2b] : {});
      };
      return config;
    }

    if (url.includes("/consultant-notes") || full.includes("/consultant-notes")) {
      var admId3 = findAdmissionId(full);
      config.adapter = function () {
        return mockResponse(admId3 && MOCK_CONSULTANT_NOTES_IPD[admId3] ? MOCK_CONSULTANT_NOTES_IPD[admId3] : []);
      };
      return config;
    }

    if (url.includes("/ot-notes") || full.includes("/ot-notes")) {
      config.adapter = function () {
        return mockResponse([]);
      };
      return config;
    }

    if (url.includes("/cross-referral") || full.includes("/cross-referral")) {
      config.adapter = function () {
        return mockResponse([]);
      };
      return config;
    }

    if (url.includes("/discharged-summary") || full.includes("/discharged-summary")) {
      config.adapter = function () {
        return mockResponse({});
      };
      return config;
    }

    if (url.includes("/lab-results") || full.includes("/lab-results")) {
      var pid4lr = findPatientId(full);
      config.adapter = function () {
        return mockResponse(MOCK_LABS[pid4lr] || []);
      };
      return config;
    }

    if ((url.includes("/docs") || full.includes("/docs")) && (full.includes("category=medical_records") || full.includes("category=scan_results"))) {
      config.adapter = function () {
        return mockResponse([]);
      };
      return config;
    }

    // ─── Broad catches (AFTER specific IPD handlers) ─────────────────────────

    if (url.includes("/labs") || url.includes("/lab")) {
      var pid4 = findPatientId(full);
      config.adapter = function () {
        return mockResponse({ status: true, data: MOCK_LABS[pid4] || [] });
      };
      return config;
    }

    if (url.includes("/nursing") || url.includes("/notes")) {
      var pid6 = findPatientId(full);
      config.adapter = function () {
        return mockResponse({ status: true, data: MOCK_NURSING_NOTES[pid6] || [] });
      };
      return config;
    }

    if (full.includes("/dynamic-modules") || full.includes("/customization") || full.includes("/print-settings") || full.includes("/printSettings")) {
      config.adapter = function () {
        return mockResponse({ modules: [] });
      };
      return config;
    }

    if (url.includes("/doctor-agent/entries/")) {
      var pid7 = findPatientId(full);
      config.adapter = function () {
        return mockResponse({
          status: true,
          data: {
            consultant: "Dr. Rajesh Sharma",
            generatedAt: new Date().toISOString(),
            medications: (MOCK_MAR[pid7] || []),
            labOrders: (MOCK_LABS[pid7] || []),
            roundNote: (MOCK_NURSING_NOTES[pid7] || [{}])[0]?.nursingPlan || "",
            careTasks: [],
          },
        });
      };
      return config;
    }

    if (url.includes("/doctor-agent/tasks")) {
      config.adapter = function () {
        return mockResponse({ status: true, data: { pending: MOCK_WARD_TASKS.length, urgent: MOCK_WARD_TASKS.filter(function (t) { return t.priority === "Urgent"; }).length } });
      };
      return config;
    }

    if (url.includes("/login") || url.includes("/auth")) {
      config.adapter = function () {
        return mockResponse({ status: true, token: makeMockJwt(), data: DEMO_DOCTOR });
      };
      return config;
    }

    config.adapter = function () {
      return mockResponse({ status: true, data: [] });
    };
    return config;
}

function setupAxiosInterceptors() {
  axios.interceptors.request.use(demoRequestInterceptor);
  apiInstance.interceptors.request.use(demoRequestInterceptor);
}

export function initDemo() {
  if (!IS_DEMO) return false;
  setupDemoAuth();
  setupAxiosInterceptors();
  return true;
}

export { IS_DEMO };
