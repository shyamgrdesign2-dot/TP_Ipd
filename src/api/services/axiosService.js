import axios from 'axios';
import { notification } from 'antd';
import config from '../../config';
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from '../../utils/constants';

const instance = axios.create({
    // baseURL: config.appointment_api_url, // Replace with your API base URL
    timeout: 20000, // Set the timeout for requests
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        if (!window.navigator.onLine) {
            const error = 'Internet connection not available';
            notification.error({ key: "notification_key", message: error });
            return Promise.reject(new Error(error));
        }
        // You can modify the request config here (e.g., add headers)
        if (config.customBaseUrl) {
            config.baseURL = config.customBaseUrl;
        }
        const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN) == null ? null : JSON.parse(localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN));
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.log('Entry Route')
        }
        return config;
    },
    (error) => {
        // Do something with request error here
        notification.error({ key: "notification_key", message: error.response.data.error })
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        // You can modify the response data here
        return response.data;
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
            console.log('Entry Route')
        }

        if (error.response.status === 404) {
            notificationParam.message = 'Not Found'
        }

        if (error.response.status === 500) {
            notificationParam.message = 'Internal Server Error'
        }

        if (error.response.status === 502) {
            notificationParam.message = 'Bad Gateway'
        }

        if (error.response.status === 508) {
            notificationParam.message = 'Time Out'
        }

        if (error.response.status === 401) {
            notificationParam.message = error.response.data.error
        }
        
        notificationParam.key = "notification_key"
        notification.error(notificationParam)
        return Promise.reject(error);
    }
);

export default instance;
