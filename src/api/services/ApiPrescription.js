import api from "./axiosService";
import { env } from "../../EnvironmentConfig";

const baseUrl = { customBaseUrl: env.lab_params_api_url };

const ApiPrescription = {};

ApiPrescription.getLabParamsData = function ({
  patient_unique_id: patientId,
}) {
  return api.get(
    `/api/v1/lab-parameters/results/${patientId}`,
    baseUrl
  );
};

export default ApiPrescription;