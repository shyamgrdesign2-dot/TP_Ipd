import api from "../../api/services/axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.visit_api_url };

export const addAppointment = async (data) => {
    let res = {};
    try {
        const response = await api.post(`/api/v1/appointment`, data, baseUrl);
        if (response?.status === undefined) {
            res = { status: true, ...response };
        } else {
            res = { status: false, message: response?.data?.message };
        }
    } catch (error) {
        res = { status: false, message: error?.response?.data?.message };
        // throw error.response ? error.response.data : error;
    }
    return res;
};
