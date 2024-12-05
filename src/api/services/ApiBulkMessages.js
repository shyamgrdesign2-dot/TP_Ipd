import api from "./axiosService";
import config from "../../config";

const baseUrl = { customBaseUrl: config.bulk_messages };

const ApiBulkMessages = {};

ApiBulkMessages.userCampaign = function (data) {
    return api.post(`/api/v1/campaign/userCampaign`, data, baseUrl);
};


export default ApiBulkMessages;