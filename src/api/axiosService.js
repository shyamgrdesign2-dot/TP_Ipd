import axios from 'axios';
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from '../utils/constants';
import config from '../config';

  const instance = axios.create({
    baseURL: config.placeholderApiUrl, // Replace with your API base URL
    timeout: 10000, // Set the timeout for requests
  });
  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // You can modify the request config here (e.g., add headers)
      const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN) == null ? null: JSON.parse(localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN));
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // You can modify the response data here
      return response;
    },
    (error) => {
      // You can handle errors globally here
     let notificationParam = {
          message: ''
      }
      // Remove token and redirect
      if (error.response.status === 400 || error.response.status === 403) {
          notificationParam.message = 'Authentication Fail'
          notificationParam.description = 'Please login again'
          localStorage.removeItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN)
          // history.push("/");
          window.location.reload();
      }
      if (error.response.status === 404) {
          notificationParam.message = 'Not Found'
      }
      if (error.response.status === 500) {
          notificationParam.message = 'Internal Server Error'
      }
      if (error.response.status === 508) {
          notificationParam.message = 'Time Out'
      }
      // notification.error(notificationParam);
      return Promise.reject(error);
    }
  );  

  export default instance;