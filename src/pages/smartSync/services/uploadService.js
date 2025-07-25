import api from '../../../api/services/axiosService';
import config from '../../../config';

const baseUrl = { customBaseUrl: 'https://pm-digitization-qa.tatvacare.in' };

export const getCustomSyncPadTemplates = async () => {
  try {
    const response = await api.get('/api/v1/custom-smart-sync-pad/get-files', baseUrl);
    return {
      success: true,
      data: response.data || response
    };
  } catch (error) {
    console.error('Failed to fetch templates:', error.message);
    return {
      success: false,
      error: 'Unable to fetch templates. Please try again.'
    };
  }
};

export const uploadCustomSyncPadTemplate = async (templateData, onProgress) => {
  try {
    if (!templateData) {
      throw new Error('Template data is undefined');
    }
    
    if (!templateData.title) {
      throw new Error('Template title is missing');
    }
    
    if (!templateData.files || !Array.isArray(templateData.files)) {
      throw new Error('Template files array is missing or invalid');
    }
    
    if (templateData.files.length === 0) {
      throw new Error('No files provided for upload');
    }

    const formData = new FormData();
    formData.append('title', templateData.title);
    
    if (templateData.description) {
      formData.append('description', templateData.description);
    }

    templateData.files.forEach((file, index) => {
      if (!file.uploadFile) {
        throw new Error(`File ${index + 1} is missing upload data`);
      }
      
      formData.append(`files`, file.uploadFile);
      formData.append(`orders`, file.order || index);
    });

    const response = await api.post('/api/v1/custom-smart-sync-pad/upload-files', formData, {
      ...baseUrl,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    const responseData = response.data || response;

    if (responseData && (responseData.id || responseData.data?.id)) {
      return {
        success: true,
        data: responseData,
        templateId: responseData.id || responseData.data?.id,
        message: 'Template uploaded successfully!'
      };
    } else if (responseData && responseData.message) {
      return {
        success: false,
        error: responseData.message
      };
    } else {
      return {
        success: false,
        error: 'Upload completed but received unexpected response format'
      };
    }

  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Upload failed. Please try again.'
    };
  }
};

export const updateCustomSyncPadTemplate = async (templateId, templateData, onProgress) => {
  try {
    if (!templateData) {
      throw new Error('Template data is undefined');
    }
    
    if (!templateData.title) {
      throw new Error('Template title is missing');
    }
    
    if (!templateData.files || !Array.isArray(templateData.files)) {
      throw new Error('Template files array is missing or invalid');
    }

    const formData = new FormData();
    formData.append('title', templateData.title);
    
    if (templateData.description) {
      formData.append('description', templateData.description);
    }

    templateData.files.forEach((file, index) => {
      if (!file.uploadFile) {
        throw new Error(`File ${index + 1} is missing upload data`);
      }
      
      formData.append(`files`, file.uploadFile);
      formData.append(`orders`, file.order || index);
    });

    const response = await api.post(`/api/v1/custom-smart-sync-pad/update-files/${templateId}`, formData, {
      ...baseUrl,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    const responseData = response.data || response;
    
    return {
      success: true,
      data: responseData,
      message: 'Template updated successfully!'
    };

  } catch (error) {
    console.error('Update failed:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Update failed. Please try again.'
    };
  }
};

export const deleteCustomSyncPadTemplate = async (templateId) => {
  try {
    const response = await api.delete(`/api/v1/custom-smart-sync-pad/delete-files/${templateId}`, baseUrl);
    
    return {
      success: true,
      message: 'Template deleted successfully!'
    };
  } catch (error) {
    console.error('Delete failed:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Delete failed. Please try again.'
    };
  }
}; 