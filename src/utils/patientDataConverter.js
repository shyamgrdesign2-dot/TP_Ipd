/**
 * Converts patient mock data format to IPD patient details format
 * @param {Object} mockData - Patient data in mock format
 * @returns {Object} - Patient data in IPD format
 */
export const convertMockToIpdFormat = (mockData) => {
  return {
    patientDetails: {
      details: {
        id: mockData.patient_unique_id?.toString() || "",
        name: [
          mockData.pm_salutation,
          mockData.pm_first_name,
          mockData.pm_middle_name,
          mockData.pm_last_name
        ].filter(Boolean).join(" ").trim(),
        gender: mockData.pm_gender || "",
        age: mockData.ageYears || 0,
        contact: mockData.pm_contact_no ? `+91-${mockData.pm_contact_no}` : "",
      },
      ward: {
        id: null,
        title: "",
      },
      room: {
        id: null,
        title: "",
      },
      doctor: {
        id: null,
        name: "",
      },
      admittedOn: null,
      _id: mockData.pm_id?.toString() || "",
      referral: false,
      // Additional patient information that might be useful
      address: {
        street: mockData.pm_address || "",
        city: mockData.pm_city || "",
        state: mockData.pm_state || "",
        pincode: mockData.pm_pincode || "",
        country: mockData.pm_country || "",
      },
      email: mockData.pm_email || "",
      bloodGroup: mockData.pm_blood_group || "",
      dateOfBirth: mockData.DOB || "",
    }
  };
};

/**
 * Converts IPD patient details format back to mock data format
 * @param {Object} ipdData - Patient data in IPD format
 * @returns {Object} - Patient data in mock format
 */
export const convertIpdToMockFormat = (ipdData) => {
  // Extract patient details for easier access
  const { patientDetails } = ipdData;
  const { details, address } = patientDetails;

  // Split the name into components (assuming the name follows the same format)
  const nameParts = details.name.split(" ");
  const salutation = nameParts[0] || "";
  const firstName = nameParts[1] || "";
  const middleName = nameParts[2] || "";
  const lastName = nameParts[3] || "";

  // Extract phone number without country code
  const contactNo = details.contact ? details.contact.replace("+91-", "") : "";

  return {
    pm_fullname: details.name || "",
    patient_unique_id: parseInt(details.id) || null,
    pm_id: parseInt(patientDetails._id) || null,
    pm_pid: "", // Not available in IPD format
    hm_id: null, // Not available in IPD format
    hm_business_id: null, // Not available in IPD format
    rm_id: 0, // Default value as per mock data
    pm_rm_name: null,
    other_ref: 0,
    pm_salutation: salutation,
    pm_first_name: firstName,
    pm_middle_name: middleName,
    pm_last_name: lastName,
    pc_id: null, // Not available in IPD format
    pm_contact_no: contactNo,
    DOB: patientDetails.dateOfBirth || "",
    ageYears: details.age || 0,
    ageMonths: 0, // Not available in IPD format
    ageDays: 0, // Not available in IPD format
    pm_gender: details.gender || "",
    pm_email: patientDetails.email || null,
    pm_address: address.street || "",
    pm_city: address.city || "",
    pm_area: null,
    pm_district: null,
    pm_state: address.state || "",
    pm_pincode: address.pincode || "",
    pm_country: address.country || null,
    pm_blood_group: patientDetails.bloodGroup || null,
    patient_address: [address.city, address.state, address.pincode].filter(Boolean).join(",")
  };
};

/**
 * Example usage:
 * import mockData from './patientMockData.json';
 * const ipdFormat = convertMockToIpdFormat(mockData);
 * const backToMock = convertIpdToMockFormat(ipdFormat);
 */
