import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.ddx_api_url };

export const getDDxDetails = async function (payload) {
  let res = {};
  try {
    res = await api.post(`/cdss/ai-diagnosis`, payload, baseUrl);
  } catch (error) {
    console.error("Error while generating ddx: ", error);
  }
  //   return res;
  return {
    patientId: "567770111407",
    businessId: "149831714557669",
    doctorId: "64",
    results: [
      {
        _id: "66867285cdbebbe52109f4d2",
        testName: "Influenza Test",
        rank: 1,
        severity: "high",
        likelihood: "most likely",
        assocSymptoms: ["Fever", "Cold"],
        treatmentOptions: ["Antiviral medication", "Rest", "Fluids"],
        labTests: ["Complete Blood Count (CBC)"],
        evidence:
          "Patient has fever for 2 days, history of tobacco use which can increase susceptibility to respiratory infections.",
        impression: "",
      },
      {
        _id: "66867285cdbebbe52109f4d3",
        testName: "COVID-19 Test",
        rank: 2,
        severity: "critical",
        likelihood: "can't miss",
        assocSymptoms: ["Fever"],
        treatmentOptions: ["Isolation", "Supportive care", "Antiviral drugs"],
        labTests: ["Arterial Blood Gases (ABG)"],
        evidence:
          "Fever lasting 2 days, with global pandemic considerations and patient's age.",
        impression: "",
      },
      {
        _id: "66867285cdbebbe52109f4d4",
        testName: "Complete Blood Count (CBC)",
        rank: 3,
        severity: "medium",
        likelihood: "extended",
        assocSymptoms: ["Fever"],
        treatmentOptions: [
          "General monitoring",
          "Antibiotics if bacterial infection detected",
        ],
        labTests: ["B-type Natriuretic Peptite (BNP)"],
        evidence:
          "Fever is often a sign of infection; tobacco use may increase risk of complications.",
        impression: "",
      },
    ],
  };
};
