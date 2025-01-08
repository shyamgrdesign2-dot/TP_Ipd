import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.gen_rx_api_url };

export const generateRx = async function (payload) {
  let res = {
    success: true,
    error: null,
    data: {
      transcription:
        "So now I'm consulting a patient called Abhishek Bora. So he's 24 years old male and he's 170 centimeters high and 68 kg of weight and he's experiencing chest pain and from past two months which is mild and also he has a cold from past one month a bit severe and based on this what we found is there is no hydration in his body and this is because of this cold I guess he's not having proper water intake and and also chest congestion and the diagnosis is hypertension from from past one month which is suspected and it might be heart failure also from past three months which is confirmed. So for this I would recommend Telma 20 tablet one tablet in the morning and one in the night before food for next two weeks and Metasmile 500 tablet one tablet in the morning evening and afternoon before food for next one week and Geico Med 500 tablet for next four weeks SOS whenever it's needed and I've also advised him not to take spicy foods and no alcohol and and also I would recommend him to take few tests like AB-1A-C and FBS test and vitals are calculated as SpO2 and SpO2 is 95% height is 175 centimeter and the pulse rate is 68 and systolic is 120 mm and diastolic is 75 mm actually and this patient has a past medical history like lifestyle change, allergies, allergies on test and lifestyle change like smoking and medical problems etc and also he has given me some lab results where hemoglobin level is bit high 98.4 and platelet count is also bit less which is 95 and WBC is also okay 95 and also I am suggesting in some diet plan where I'm asking him to take more green vegetables in the morning and high protein foods like egg and chicken and also I am recommending him to avoid red meat as well as high fatty foods and also I'm asking him to avoid eating food after 6 so he has to complete his meal before 6 so this is the diet I'm giving to him and also I want to write a follow-up on and also I'm asking him to come again on Saturday 16th October 2023 that's it I guess thank you",
      digitize: {
        vitalsAndBodyComposition: {
          temperature: "",
          pulse: "68 bpm",
          respRate: "",
          bloodPressure: "120/75 mmHg",
          spo2: "95%",
          ofc: "",
          height: "170 cm",
          weight: "68 kg",
        },
        symptoms: [
          {
            name: "Chest Pain",
            duration: "2 Month(s)",
            severity: "Mild",
            notes: "Chest congestion present",
            lineItem: "2 Month(s), Mild, Chest congestion present",
          },
          {
            name: "Cold",
            duration: "1 Month",
            severity: "Severe",
            notes: "Due to inadequate hydration",
            lineItem: "1 Month, Severe, Due to inadequate hydration",
          },
        ],
        examinations: [],
        diagnosis: [
          {
            name: "Hypertension",
            since: "1 Month",
            status: "Suspected",
            notes: "",
            lineItem: "1 Month, Suspected",
          },
          {
            name: "Heart Failure",
            since: "3 Month(s)",
            status: "Confirmed",
            notes: "",
            lineItem: "3 Month(s), Confirmed",
          },
        ],
        medications: [
          {
            name: "Telma 20",
            dosage: "1 tablet",
            frequency: "1-0-1",
            schedule: "Before Food",
            duration: "2 Week(s)",
            notes: "",
            lineItem: "1 tablet, 1-0-1, Before Food, 2 Week(s)",
          },
          {
            name: "Metasmile 500",
            dosage: "1 tablet",
            frequency: "1-1-1",
            schedule: "Before Food",
            duration: "1 Week",
            notes: "",
            lineItem: "1 tablet, 1-1-1, Before Food, 1 Week",
          },
          {
            name: "Geico Med 500",
            dosage: "1 tablet",
            frequency: "SOS",
            schedule: "",
            duration: "4 Week(s)",
            notes: "",
            lineItem: "1 tablet, SOS, 4 Week(s)",
          },
        ],
        advice: [
          "Avoid spicy foods",
          "No alcohol",
          "Complete meals before 6 PM",
          "Increase intake of green vegetables and high protein foods like eggs and chicken",
          "Avoid red meat and high fatty foods",
        ],
        labInvestigation: [
          { name: "AB-1A-C", instruction: "", lineItem: "" },
          { name: "FBS", instruction: "", lineItem: "" },
        ],
        followUp: "Saturday 16th October 2023",
        dynamicFields: {
          pastMedicalHistory: ["Lifestyle change", "Allergies", "Smoking"],
          labResults: [
            "Hemoglobin level: 98.4",
            "Platelet count: 95",
            "WBC count: 95",
          ],
        },
        others: [],
      },
      type: "AUDIO_NO_CONTEXT",
      source: "6ce8dfbe-5d54-4a1d-bd4b-8e505de9d213.webm",
      timeRequiredInMs: 28922,
      source_duration: null,
      _id: "677d2584405d600013bdb08e",
    },
  };
  try {
    res = await api.post(`/api/v1/voice-digitize/`, baseUrl, payload);
  } catch (e) {
    console.error("Error while generating rx: ", e);
  }
  return res;
};
