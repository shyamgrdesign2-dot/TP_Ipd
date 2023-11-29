import axios from 'axios';
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from '../utils/constants';
import { useLocalStorage } from '../utils/localStorage';

const defaultOptions = {};

function axiosProvider(baseUrl, options) {
  console.log('creating axios instance');
  const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN) == null ? null: JSON.parse(localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN));
  const api = axios.create({
    baseURL: baseUrl,
    ...defaultOptions,
    ...options
  });
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return api;
}

export default axiosProvider;
