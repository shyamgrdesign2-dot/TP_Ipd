import config from "../../../config";
import api from "../axiosService";
const baseUrl = { customBaseUrl: config.ipd_api_url };

const ApiWardAndBedManagement = {};

ApiWardAndBedManagement.getAllWards = function (
  search = "",
  sort = null,
  page = 1,
  limit = 10
) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (sort !== null) params.append("sort", sort);
  params.append("page", page);
  params.append("limit", limit);

  const queryString = params.toString();
  return api.get(
    `/ward-management/wards${queryString ? `?${queryString}` : ""}`,
    baseUrl
  );
};

ApiWardAndBedManagement.getAvailableWards = function () {
  return api.get("/ward-management/available", baseUrl);
};

ApiWardAndBedManagement.getWardById = function (wardId) {
  return api.get(`/ward-management/via-id?wardId=${wardId}`, baseUrl);
};

ApiWardAndBedManagement.upsertWard = function (wardId, data) {
  // For creating new ward, wardId might be null/undefined
  // Backend should handle this case
  const queryParam = wardId ? `?wardId=${wardId}` : "";
  return api.put(`/ward-management/ward${queryParam}`, data, baseUrl);
};

ApiWardAndBedManagement.addRoom = function (wardId, data) {
  return api.post(`/ward-management/add-room?wardId=${wardId}`, data, baseUrl);
};

ApiWardAndBedManagement.bulkAddRooms = function (wardId, data) {
  return api.post(
    `/ward-management/bulk-add-room?wardId=${wardId}`,
    data,
    baseUrl
  );
};

ApiWardAndBedManagement.updateRoom = function (wardId, data) {
  return api.put(
    `/ward-management/update-room?wardId=${wardId}`,
    data,
    baseUrl
  );
};

ApiWardAndBedManagement.deleteWard = function (wardId) {
  return api.delete(`/ward-management/delete-ward?wardId=${wardId}`, baseUrl);
};

ApiWardAndBedManagement.deleteRoom = function (wardId, roomId) {
  return api.delete(
    `/ward-management/delete-room?wardId=${wardId}&roomId=${roomId}`,
    baseUrl
  );
};

ApiWardAndBedManagement.getWardStats = function () {
  return api.get("/ward-management/stats", baseUrl);
};

ApiWardAndBedManagement.blockRoom = function (wardId, roomId) {
  return api.put(
    `/ward-management/blocked-room?wardId=${wardId}&roomId=${roomId}`,
    {},
    baseUrl
  );
};

ApiWardAndBedManagement.unblockRoom = function (wardId, roomId) {
  return api.put(
    `/ward-management/unblocked-room?wardId=${wardId}&roomId=${roomId}`,
    {},
    baseUrl
  );
};

ApiWardAndBedManagement.getBeds = function (
  wardId,
  filter = "",
  sort = null,
  page = 1,
  limit = 10
) {
  const params = new URLSearchParams();

  // Handle multiple filters - can be array or string
  if (filter) {
    if (Array.isArray(filter) && filter.length > 0) {
      // Append each filter as a separate query parameter
      filter.forEach((f) => {
        if (f && f.trim() !== "") {
          params.append("filter", f.trim());
        }
      });
    } else if (typeof filter === "string" && filter.trim() !== "") {
      // Single filter as string
      params.append("filter", filter.trim());
    }
  }

  if (sort !== null) params.append("sort", sort);
  params.append("page", page);
  params.append("limit", limit);
  params.append("wardId", wardId);

  const queryString = params.toString();
  return api.get(
    `/ward-management/rooms${queryString ? `?${queryString}` : ""}`,
    baseUrl
  );
};

ApiWardAndBedManagement.getBedStatsByWard = function (wardId) {
  return api.get(`/ward-management/ward-stats?wardId=${wardId}`, baseUrl);
};

export default ApiWardAndBedManagement;
