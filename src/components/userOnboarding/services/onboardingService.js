import axios from "axios";

/**
 * Updates doctor onboarding details
 * @param {Object} doctorData - Doctor's information
 * @param {string} doctorData.id - Doctor's unique ID
 * @param {string} doctorData.phone_number - Doctor's phone number
 * @param {string} doctorData.doctorName - Doctor's full name
 * @param {number} doctorData.departmentId - Department/Speciality ID
 * @param {string} doctorData.utm_source - UTM source
 * @param {string} doctorData.utm_campaign - UTM campaign
 * @param {string} doctorData.utm_term - UTM term
 * @param {string} doctorData.utm_content - UTM content
 * @param {string} doctorData.utm_medium - UTM medium
 * @returns {Promise} Promise with the response
 */
export const updateOnboardingDetails = async (doctorData) => {
  try {
    const response = await axios.post(
      "https://pm-central-auth-uat.tatvacare.in/api/v1/onBoarding/updateDetails",
      doctorData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating onboarding details:", error);
    throw error;
  }
};

/**
 * Finalizes doctor onboarding with clinic details
 * @param {Object} doctorData - Doctor's information including clinic details
 * @param {string} doctorData.id - Doctor's unique ID
 * @param {string} doctorData.phone_number - Doctor's phone number
 * @param {string} doctorData.doctorName - Doctor's full name
 * @param {number} doctorData.departmentId - Department/Speciality ID
 * @param {string} doctorData.utm_source - UTM source
 * @param {string} doctorData.utm_campaign - UTM campaign
 * @param {string} doctorData.utm_term - UTM term
 * @param {string} doctorData.utm_content - UTM content
 * @param {string} doctorData.utm_medium - UTM medium
 * @param {string} doctorData.clinicName - Name of the clinic
 * @param {string} doctorData.clinicAddress - Address of the clinic
 * @param {string} doctorData.clinicPincode - Pincode of the clinic
 * @param {string} doctorData.clinic_lat - Latitude of the clinic
 * @param {string} doctorData.clinic_long - Longitude of the clinic
 * @returns {Promise} Promise with the response
 */
export const finalizeOnboarding = async (doctorData) => {
  try {
    const response = await axios.post(
      "https://pm-central-auth-uat.tatvacare.in/api/v1/onBoarding/finalize",
      doctorData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error finalizing onboarding:", error);
    throw error;
  }
};

/**
 * Uploads doctor verification documents
 * @param {File} governmentProof - Government ID proof document
 * @param {File} mrcCertificate - Medical Registration Certificate
 * @param {string} authToken - JWT authentication token
 * @returns {Promise} Promise with the response
 */
export const uploadDocuments = async (
  governmentProof,
  mrcCertificate,
  authToken
) => {
  try {
    // Create a FormData object for file upload
    const formData = new FormData();
    if (governmentProof) {
      formData.append("goverment_proof", governmentProof);
    }
    if (mrcCertificate) {
      formData.append("mrc_certificate", mrcCertificate);
    }

    // Get auth token from localStorage if not provided
    const token = authToken || localStorage.getItem("AUTH_TOKEN");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.post(
      "https://pm-central-auth-uat.tatvacare.in/api/v1/onBoarding/uploadDocument",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading documents:", error);
    throw error;
  }
};

/**
 * Map between speciality names and department IDs
 * This is a placeholder mapping - you should replace with actual values
 */
export const specialityToDepartmentId = {
  Dermatologist: 14,
  Cardiologist: 2,
  Neurologist: 3,
  Pediatrician: 4,
  Orthopedist: 5,
  Gynecologist: 6,
  Oncologist: 7,
  Psychiatrist: 8,
  Ophthalmologist: 9,
  "ENT Specialist": 10,
};
