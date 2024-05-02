const dev = {
  appointment_api_url: `https://appointment-webservice.azurewebsites.net`,
  symptoms_api_url: `https://symptoms-webservice.azurewebsites.net`,
  examination_api_url: `https://examination-webservice.azurewebsites.net`,
  diagnosis_api_url: `https://diagnosis-webservice.azurewebsites.net`,
  advice_api_url: `https://advice-webservice.azurewebsites.net`,
  investigation_api_url: `https://investigation-webservice.azurewebsites.net`,
  medication_api_url: `https://medicine-webservice.azurewebsites.net`,
  vitals_api_url: `https://vital-webservice.azurewebsites.net`,
  casemanager_api_url: `https://casemanager-webservice.azurewebsites.net`,
  printsettings_api_url: `https://printsettings-webservice.azurewebsites.net`,
  sso_to_pm_url: `https://pms-upgrade.azurewebsites.net/api/get_doctor_sso_token.php`,
  sso_to_pm_username: `PM_40d30f01184aedc47`,
  sso_to_pm_password: `487154d8-b9ad-4314-a0e3-a72d5se84x14`,
  doctor_website_url: `https://pms-upgrade.azurewebsites.net/doctor_website/`,
  vaccination_url: `https://pm-vaccination-uat.mytatva.in/`,
};

const qa = {
  appointment_api_url: `https://appointment-webservice.azurewebsites.net`,
  symptoms_api_url: `https://symptoms-webservice.azurewebsites.net`,
  examination_api_url: `https://examination-webservice.azurewebsites.net`,
  diagnosis_api_url: `https://diagnosis-webservice.azurewebsites.net`,
  advice_api_url: `https://advice-webservice.azurewebsites.net`,
  investigation_api_url: `https://investigation-webservice.azurewebsites.net`,
  medication_api_url: `https://medicine-webservice.azurewebsites.net`,
  vitals_api_url: `https://vital-webservice.azurewebsites.net`,
  casemanager_api_url: `https://casemanager-webservice.azurewebsites.net`,
  printsettings_api_url: `https://printsettings-webservice.azurewebsites.net`,
  sso_to_pm_url: `https://pms-upgrade.azurewebsites.net/api/get_doctor_sso_token.php`,
  sso_to_pm_username: `PM_40d30f01184aedc47`,
  sso_to_pm_password: `487154d8-b9ad-4314-a0e3-a72d5se84x14`,
  doctor_website_url: `https://pms-upgrade.azurewebsites.net/doctor_website/`,
  vaccination_url: `https://pm-vaccination-uat.mytatva.in/`,
};

const uat = {
  appointment_api_url: `https://master-uat-webservice.azurewebsites.net`,
  symptoms_api_url: `https://symptoms-uat.azurewebsites.net`,
  examination_api_url: `https://examination-uat.azurewebsites.net`,
  diagnosis_api_url: `https://diagnosis-uat.azurewebsites.net`,
  advice_api_url: `https://advice-uat.azurewebsites.net`,
  investigation_api_url: `https://investigation-uat.azurewebsites.net`,
  medication_api_url: `https://medicine-uat.azurewebsites.net/`,
  vitals_api_url: `https://vital-uat.azurewebsites.net`,
  casemanager_api_url: `https://casemanager-uat.azurewebsites.net`,
  printsettings_api_url: `https://printsetting-uat.azurewebsites.net`,
  sso_to_pm_url: `https://pm-uat-dhspl-2.tatvacare.in/api/get_doctor_sso_token.php`,
  sso_to_pm_username: `PM_40d30f01184aedc47`,
  sso_to_pm_password: `487154d8-b9ad-4314-a0e3-a72d5se84x14`,
  doctor_website_url: `https://pm-uat-dhspl-2.tatvacare.in/doctor_website/`,
  vaccination_url: `https://pm-vaccination-uat.mytatva.in/`,
};

const prod = {
  appointment_api_url: `https://master-prod-webservice.azurewebsites.net`,
  symptoms_api_url: `https://symptoms-prod.azurewebsites.net`,
  examination_api_url: `https://examination-prod.azurewebsites.net`,
  diagnosis_api_url: `https://diagnosis-prod.azurewebsites.net`,
  advice_api_url: `https://advice-prod.azurewebsites.net`,
  investigation_api_url: `https://investigation-prod.azurewebsites.net`,
  medication_api_url: `https://medicine-prod.azurewebsites.net/`,
  vitals_api_url: `https://vital-prod.azurewebsites.net`,
  casemanager_api_url: `https://casemanager-prod.azurewebsites.net`,
  printsettings_api_url: `https://printsetting-prod.azurewebsites.net`,
  sso_to_pm_url: `https://practice.tatvacare.in/api/get_doctor_sso_token.php`,
  sso_to_pm_username: `PM_45dy48vh8sc4i1dum`,
  sso_to_pm_password: `481541at-j4xc-4817-q5xz-a4rt48c69bt1`,
  doctor_website_url: `https://practice.tatvacare.in/doctor_website/`,
  vaccination_url: `https://pm-vaccination-uat.mytatva.in/`,
};

const getEnv = () => {
  // console.log("process.env",process.env);
  // console.log("process.env.REACT_APP_ENV",process.env.REACT_APP_ENV);
  switch (process.env.REACT_APP_ENV) {
    case "dev":
      return prod;
    case "qa":
      return qa;
    case "uat":
      return uat;
    case "prod":
      return prod;
    default:
      break;
  }
};
export const env = getEnv();
