import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.lab_params_api_url };

export const fetchApolloConsultations = async function ({
  page,
  startDate,
  endDate,
  umIds,
  search,
  download
}) {
  let consultations = [];

  let query=''
  if(download !== undefined){
    query=`&download=${download}`
  }

  try {
    consultations = await api.get(
      `api/v1/apollo/owner?page=${page}&startdate=${startDate}&enddate=${endDate}&um_ids=${umIds}&search=${search}${query}`,
      baseUrl
    );
  } catch (e) {
    console.error("Error while fetching consultations", e);
  }
  return consultations;
};

export const updateConsultationRemarks = async function (payload) {
  let res = {};
  try {
    res = await api.put(`api/v1/apollo/owner`, payload, baseUrl);
  } catch (e) {
    console.error("Error while updateConsultationRemrks: ", e);
  }
  return res;
};

export const fetchApolloDoctors = async () => {
  let res;
  try {
    res = await api.get(`api/v1/apollo/owner/list-doctors`, baseUrl);
  } catch (e) {
    console.error("Error while fetching getParentalDetails: ", e);
  }
  return res;
};
