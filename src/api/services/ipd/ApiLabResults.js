import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiLabResults = {};

ApiLabResults.getPathologyResults = function ({
  patientId,
  admissionId,
  filterStartDate,
  filterEndDate,
  search,
  selected,
}) {
  return api.get(
    `/lab-results/pathology-results/available?patientId=${patientId}&admissionId=${admissionId}${
      filterStartDate ? `&filterStartDate=${filterStartDate}` : ""
    }${filterEndDate ? `&filterEndDate=${filterEndDate}` : ""}${
      search ? `&search=${search}` : ""
    }${selected ? `&selected=${selected}` : ""}`,
    baseUrl
  );
};

ApiLabResults.updatePathologyResults = function ({
  patientId,
  admissionId,
  data,
}) {
  return api.put(
    `/lab-results/pathology-results?patientId=${patientId}&admissionId=${admissionId}`,
    data,
    baseUrl
  );
};

ApiLabResults.getScanResults = function ({
  patientId,
  admissionId,
  subCategory,
  filterStartDate,
  filterEndDate,
}) {
  return api.get(
    `/docs?patientId=${patientId}&admissionId=${admissionId}&category=scan_results${
      subCategory ? `&subCategory=${subCategory}` : ""
    }${filterStartDate ? `&filterStartDate=${filterStartDate}` : ""}${
      filterEndDate ? `&filterEndDate=${filterEndDate}` : ""
    }`,
    baseUrl
  );
};

export default ApiLabResults;
