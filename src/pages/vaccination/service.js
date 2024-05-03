import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.vaccination_api_url };

const ApiVaccination = {};

ApiVaccination.getPatientDetails = async function (
  hospital_bid = 798251708943588,
  patient_uid = 1311432893
) {
  try {
    const res = await api.get(
      `/patientDetails?hospital_bid=${hospital_bid}&patient_uid=${patient_uid}`,
      baseUrl
    );
    console.log({ res });
    const { detail = [] } = res;
    // detail[0].vac_dob = null;
    return detail;
  } catch (e) {
    console.log({ e });
  }
};

ApiVaccination.getVaccineBrands = async function () {
  try {
    const vaccineBrands = await api.get(`/companyList`, baseUrl);
    console.log({ vaccineBrands });
    const { detail = [] } = vaccineBrands;
    return detail;
  } catch (e) {
    console.log({ e });
  }
};

ApiVaccination.updateDob = async function (payload) {
  try {
    const res = await api.post(`/patientDetails`, payload, baseUrl);
    console.log({ res });
  } catch (e) {
    console.log({ e });
  }
};

export default ApiVaccination;
