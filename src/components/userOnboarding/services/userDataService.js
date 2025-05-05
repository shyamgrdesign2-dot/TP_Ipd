import { jwtDecode } from "jwt-decode";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from "../../../utils/constants";

/**
 * Gets the current user data from JWT token in local storage
 * @returns {Object} User data from token or default values if not available
 */
export const getUserData = () => {
  try {
    // Get token from local storage
    const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);

    if (!token) {
      return {
        id: "",
        phoneNumber: "",
        doctorName: "",
      };
    }

    // Decode the JWT token
    const decodedToken = jwtDecode(token);

    // Extract relevant user data
    return {
      id: decodedToken?.result?.doctor_unique_id || "",
      phoneNumber: decodedToken?.result?.mobile_no || "",
      doctorName: decodedToken?.result?.name || "",
    };
  } catch (error) {
    console.error("Error getting user data:", error);
    return {
      id: "",
      phoneNumber: "",
      doctorName: "",
    };
  }
};

/**
 * Gets UTM parameters from URL or local storage
 * @returns {Object} UTM parameters
 */
export const getUtmParams = () => {
  try {
    // First try to get from URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");

    // If UTM params exist in URL, use those
    if (utmSource) {
      return {
        utm_source: utmSource,
        utm_campaign: urlParams.get("utm_campaign") || "",
        utm_term: urlParams.get("utm_term") || "",
        utm_content: urlParams.get("utm_content") || "",
        utm_medium: urlParams.get("utm_medium") || "",
      };
    }

    // Otherwise use default values
    return {
      utm_source: "Source 4589",
      utm_campaign: "Campaign 4589",
      utm_term: "Term 4589",
      utm_content: "Content 4589",
      utm_medium: "Medium 4589",
    };
  } catch (error) {
    console.error("Error getting UTM params:", error);
    return {
      utm_source: "Source 4589",
      utm_campaign: "Campaign 4589",
      utm_term: "Term 4589",
      utm_content: "Content 4589",
      utm_medium: "Medium 4589",
    };
  }
};
