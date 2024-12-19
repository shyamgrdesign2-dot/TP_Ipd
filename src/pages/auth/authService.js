import axios from 'axios';
import config from '../../config';

const baseUrl = config.central_auth_api_url;

export const loginWithPassword = async (phoneNumber, password) => {
  try {
    const response = await axios.post(`${baseUrl}/api/v1/auth/password-login`, {
      phone_number: phoneNumber,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const validateUser = async (phoneNumber) => {
  try {
    const response = await axios.post(`${baseUrl}/api/v1/auth/check-user`, {
      phone_number: phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const verifyAccessToken = async (phoneNumber, accessToken) => {
  try {
    const response = await axios.post(`${baseUrl}/api/v1/auth/verify-access-token`, {
      phone_number: phoneNumber,
      access_token: accessToken,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const setPassword = async (uniqueId, password) => {
  try {
    const response = await axios.put(`${baseUrl}/api/v1/auth/set-password`, {
      doctor_unique_id: uniqueId,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
