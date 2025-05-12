/**
 * Gets the current user data from JWT token in local storage
 * @returns {Object} User data from token or default values if not available
 */
export const getUserMobileNumber = () => {
  try {
    const mobileNumber = localStorage.getItem("mobileNumber");

    if (!mobileNumber) {
      return "";
    }

    return mobileNumber;
  } catch (error) {
    console.error("Error getting user data:", error);
    return "";
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
    return null;
  } catch (error) {
    console.error("Error getting UTM params:", error);
    return null;
  }
};
