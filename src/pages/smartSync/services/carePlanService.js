import api from '../../../api/services/axiosService';
import { env } from "../../../EnvironmentConfig";
const defaultBaseUrl = { customBaseUrl: env.upload_doc_api_url };
// GET /api/v1/care-plans/fetch-plans - Get all care plan names
export const getCarePlanNames = async (options = {}) => {
  const base = options.baseUrl || defaultBaseUrl;
  
  
  const authToken = localStorage.getItem('PERSISTANT_STORAGE_KEY_AUTH_TOKEN');
  if (authToken) {
    try {
      const parsedToken = JSON.parse(authToken);
      
    } catch (e) {
      
    }
  }
  
  try {
    const response = await api.get(`/api/v1/care-plans/fetch-plans`, base);
    
    return response;
  } catch (error) {
    
    
    if (error.response?.status === 401) {
      
      try {
        const authToken = localStorage.getItem('PERSISTANT_STORAGE_KEY_AUTH_TOKEN');
        if (authToken) {
          const parsedToken = JSON.parse(authToken);
          const directResponse = await fetch(`${base.customBaseUrl}/api/v1/care-plans/fetch-plans`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${parsedToken}`,
            },
          });
          
          if (directResponse.ok) {
            const data = await directResponse.json();
            
            return data;
          } else {
            
          }
        }
      } catch (fetchError) {
        console.error('CarePlanService: Direct fetch with token error:', fetchError);
      }
    }
    
    
    if (error.message.includes('CORS') || error.message.includes('Network Error') || !error.response) {
      console.log('CarePlanService: Trying direct fetch as fallback...');
      try {
        const directResponse = await fetch(`${base.customBaseUrl}/api/v1/care-plans/names`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
       
        if (directResponse.ok) {
          const data = await directResponse.json();
         
          return data;
        } else {
          console.error('CarePlanService: Direct fetch failed:', directResponse.status, directResponse.statusText);
        }
      } catch (fetchError) {
        console.error('CarePlanService: Direct fetch error:', fetchError);
      }
    }
    
    throw error;
  }
};




export const assignCarePlan = async (payload, options = {}) => {
  const base = options.baseUrl || defaultBaseUrl;
  
  // Transform payload to match backend expectations
  const transformedPayload = {
    care_plan_id: payload.plan_id,  // Backend expects care_plan_id, not plan_id
    um_id: payload.um_id,
    patient_unique_id: payload.patient_unique_id,
    hm_id: payload.hm_id
  };
  
  console.log('CarePlanService: Assigning care plan with payload:', transformedPayload);
  return api.post(`/api/v1/care-plans/assign`, transformedPayload, base);
};



