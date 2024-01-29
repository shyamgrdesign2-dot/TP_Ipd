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
};

const prod = {
    appointment_api_url: `https://master-uat-webservice.azurewebsites.net`,
    symptoms_api_url: `https://symptoms-uat.azurewebsites.net`,
    examination_api_url: `https://examination-uat.azurewebsites.net`,
    diagnosis_api_url: `https://diagnosis-uat.azurewebsites.net`,
    advice_api_url: `https://advice-uat.azurewebsites.net`,
    investigation_api_url: `https://investigation-uat.azurewebsites.net`,
    medication_api_url: `https://medicine-uat.azurewebsites.net/`,
    vitals_api_url: `https://vital-uat.azurewebsites.net`,
    casemanager_api_url: `https://casemanager-uat.azurewebsites.net`,
};

const getEnv = () => {
    console.log("process.env",process.env);
    console.log("process.env.REACT_APP_ENV",process.env.REACT_APP_ENV);
    switch (process.env.REACT_APP_ENV) {
        case 'dev':
            return dev
        case 'qa':
            return qa
        case 'uat':
            return uat
        case 'prod':
            return prod
        default:
            break;
    }
}
export const env = getEnv()