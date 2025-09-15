import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../utils/constants";
import { jwtDecode } from "jwt-decode";

export function useLocalStorage(key) {
  const getValue = () =>
    localStorage.getItem(key) == null
      ? null
      : JSON.parse(localStorage.getItem(key));
  const setValue = (value) => localStorage.setItem(key, JSON.stringify(value));

  return [getValue, setValue];
}

export function clearLocalStorage() {
  localStorage.clear();
}

export const getDecodedToken = () => {
  let token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
  token = token ? JSON.parse(token) : null;
  return token ? jwtDecode(token) : null;
};

// Local storage utilities for filter persistence
export function useLocalStorageForFilters(key) {
  const getValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading local storage key ${key}:`, error);
      return null;
    }
  };

  const setValue = (value) => {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error writing to local storage key ${key}:`, error);
    }
  };

  return [getValue, setValue];
}

// Specific utilities for IPD filters using localStorage
export const IPD_FILTERS_KEY = "ipd_patient_filters";

export const saveIPDFilters = (filters) => {
  try {
    localStorage.setItem(IPD_FILTERS_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error("Error saving IPD filters to local storage:", error);
  }
};

export const loadIPDFilters = () => {
  try {
    const filters = localStorage.getItem(IPD_FILTERS_KEY);
    return filters ? JSON.parse(filters) : null;
  } catch (error) {
    console.error("Error loading IPD filters from local storage:", error);
    return null;
  }
};

export const clearIPDFilters = () => {
  try {
    localStorage.removeItem(IPD_FILTERS_KEY);
  } catch (error) {
    console.error("Error clearing IPD filters from local storage:", error);
  }
};
