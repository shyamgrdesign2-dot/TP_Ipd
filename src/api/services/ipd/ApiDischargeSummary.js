import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiDischargeSummary = {};

ApiDischargeSummary.getDischargeSummary = function ({
  patientId,
  admissionId,
  filterStartDate,
  filterEndDate,
  _id,
}) {
  let url = `/discharged-summary?patientId=${patientId}&admissionId=${admissionId}`;
  if (filterStartDate) url += `&filterStartDate=${filterStartDate}`;
  if (filterEndDate) url += `&filterEndDate=${filterEndDate}`;
  if (_id) url += `&_id=${_id}`;
  return api.get(url, baseUrl);
};

ApiDischargeSummary.addDischargeSummary = function ({
  patientId,
  admissionId,
  data,
}) {
  return api.post(
    `/discharged-summary?patientId=${patientId}&admissionId=${admissionId}`,
    data,
    baseUrl
  );
};

ApiDischargeSummary.updateDischargeSummary = function ({
  patientId,
  admissionId,
  _id,
  data,
}) {
  return api.put(
    `/discharged-summary?patientId=${patientId}&admissionId=${admissionId}${
      _id ? `&_id=${_id}` : ""
    }`,
    data,
    baseUrl
  );
};

ApiDischargeSummary.getMockValues = function () {
  return api.get(`/discharged-summary/mock-values`, baseUrl);
};

export default ApiDischargeSummary;
