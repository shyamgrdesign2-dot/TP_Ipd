import config from "../../../config";
import api from "../axiosService";

const baseConfig = { customBaseUrl: config.ipd_api_url };

const withParams = (params = {}) => {
  const sanitizedParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});

  return {
    ...baseConfig,
    ...(Object.keys(sanitizedParams).length ? { params: sanitizedParams } : {}),
  };
};

const ApiTemplate = {};

// TODO - Need to add doctorId here for all the APIs

ApiTemplate.getTemplates = function (params = {}) {
  // doctorId should be passed in params
  return api.get("/templates", withParams(params));
};

ApiTemplate.getTemplateById = function ({ _id, id, doctorId, ...rest } = {}) {
  const params = { _id: _id || id, ...rest };
  // Add doctorId to query params if provided
  if (doctorId) {
    params.doctorId = doctorId;
  }
  return api.get("/templates/via-id", withParams(params));
};

ApiTemplate.getTemplatesByModuleName = function ({
  moduleName,
  doctorId,
  ...rest
} = {}) {
  const params = { moduleName, ...rest };
  // Add doctorId to query params if provided
  if (doctorId) {
    params.doctorId = doctorId;
  }
  return api.get("/templates/via-module-name", withParams(params));
};


ApiTemplate.updateTemplate = function (data = {}) {
  const { _id, id, doctorId, ...payload } = data;
  const identifier = _id || id;

  // Build query params with _id and doctorId
  const queryParams = {};
  if (identifier) {
    queryParams._id = identifier;
  }
  if (doctorId) {
    queryParams.doctorId = doctorId;
  }

  if (!identifier) {
    // If no _id, still pass doctorId if provided
    return api.put("/templates", payload, Object.keys(queryParams).length > 0 ? withParams(queryParams) : baseConfig);
  }

  return api.put("/templates", payload, withParams(queryParams));
};

ApiTemplate.deleteTemplate = function ({ _id, id, doctorId, ...rest } = {}) {
  const identifier = _id || id;

  if (!identifier) {
    throw new Error("Template identifier (_id) is required for delete.");
  }

  const params = { _id: identifier, ...rest };
  // Add doctorId to query params if provided
  if (doctorId) {
    params.doctorId = doctorId;
  }
  return api.delete("/templates", withParams(params));
};

export default ApiTemplate;
