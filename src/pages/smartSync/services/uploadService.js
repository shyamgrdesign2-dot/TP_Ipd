import api from '../../../api/services/axiosService';
import config from '../../../config';

// Base URL for custom smart sync API calls - using the URL from your working cURL
const baseUrl = { customBaseUrl: 'https://pm-digitization-qa.tatvacare.in' };

// Get all custom smart sync pad templates
export const getCustomSyncPadTemplates = async () => {
  console.log('🔍 Fetching custom sync pad templates...');
  try {
    const response = await api.get('/api/v1/custom-smart-sync-pad/get-files', baseUrl);
    console.log('✅ Templates fetched successfully:', { hasData: !!response, dataLength: response?.length });
    return {
      success: true,
      data: response.data || response // Handle different response structures
    };
  } catch (error) {
    console.error('❌ Failed to fetch templates:', error.message);
    return {
      success: false,
      error: 'Unable to fetch templates. Please try again.'
    };
  }
};

// Upload new custom smart sync pad template
export const uploadCustomSyncPadTemplate = async (templateData, onProgress) => {
  try {
    console.log('🚀 Starting upload for template:', templateData.title);
    
    // Validate templateData structure
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
    
    console.log(`📎 Processing ${templateData.files.length} files for upload...`);
    templateData.files.forEach((file, index) => {
      if (!file) {
        throw new Error(`File at index ${index} is undefined`);
      }
      
      if (!file.uploadFile) {
        throw new Error(`uploadFile property missing at index ${index}`);
      }
      
      if (!(file.uploadFile instanceof File) && !(file.uploadFile instanceof Blob)) {
        throw new Error(`uploadFile at index ${index} is not a File or Blob object, got: ${typeof file.uploadFile}`);
      }
      
      formData.append('uploaded_files', file.uploadFile);
    });
    
    const metadata = templateData.files.map((file, index) => {
      if (!file?.uploadFile) {
        throw new Error(`Cannot create metadata: uploadFile missing at index ${index}`);
      }
      
      if (!file.uploadFile.name) {
        throw new Error(`Cannot create metadata: uploadFile.name missing at index ${index}`);
      }
      
      return {
        fileName: file.uploadFile.name,
        order: file.order || index + 1
      };
    });
    
    formData.append('metadata', JSON.stringify(metadata));
    
    const requestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.lengthComputable) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
      ...baseUrl
    };
    
    console.log('🌐 Making API request to upload files...');
    
    try {
      const responseData = await api.post('/api/v1/custom-smart-sync-pad/upload-files', formData, requestConfig);
      
      console.log('✅ API Response received (data only due to interceptor):', responseData);
      
      // Check if we have valid response data - the API returns an object with id, uploaded_files, and title
      if (responseData && responseData.id && responseData.uploaded_files && responseData.title) {
        console.log('✅ Upload successful! Template created with:', {
          id: responseData.id,
          title: responseData.title,
          filesCount: responseData.uploaded_files.length,
          files: responseData.uploaded_files.map(file => ({
            id: file.id,
            order: file.order,
            unique_id: file.unique_id,
            hasFileUrl: !!file.file_url
          }))
        });
        
        return {
          success: true,
          data: responseData
        };
      } else if (responseData) {
        // We got some response but it doesn't match expected structure
        console.log('⚠️ API returned unexpected response structure:', responseData);
        return {
          success: true, // Still consider it successful since we got a response
          data: responseData
        };
      } else {
        console.log('⚠️ API returned empty response');
        return {
          success: false,
          error: 'API returned empty response'
        };
      }
    } catch (apiError) {
      console.error('🚨 API Call failed:', apiError.message);
      // Re-throw the error to be caught by outer catch block
      throw apiError;
    }
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    
    let errorMessage = 'Upload failed. Please try again.';
    if (error.response?.data?.message) errorMessage = error.response.data.message;
    else if (error.message) errorMessage = error.message;
    return { success: false, error: errorMessage };
  }
};

// Update existing custom smart sync pad template
export const updateCustomSyncPadTemplate = async (templateId, templateData, onProgress) => {
  try {
    console.log('🔄 Starting template update for ID:', templateId, 'with title:', templateData.title);
    
    const formData = new FormData();
    formData.append('title', templateData.title);
    
    console.log(`📎 Processing ${templateData.files.length} files for update...`);
    templateData.files.forEach((file, index) => {
      formData.append('uploaded_files', file.uploadFile);
      console.log(`📄 File ${index + 1}: ${file.uploadFile.name} (${file.uploadFile.size} bytes)`);
    });
    
    const metadata = templateData.files.map((file, index) => ({
      fileName: file.uploadFile.name,
      order: file.order || index + 1
    }));
    formData.append('metadata', JSON.stringify(metadata));
    
    // Debug: Log FormData entries
    console.log('📦 FormData entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    const requestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.lengthComputable) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    };
    
    console.log('🌐 Making API request to update template...');
    const responseData = await api.put(`/api/v1/custom-smart-sync-pad/update-files/${templateId}`, formData, { ...requestConfig, ...baseUrl });
    
    console.log('✅ Template updated successfully:', responseData);
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error('❌ Template update failed:', error);
    let errorMessage = 'Update failed. Please try again.';
    if (error.response?.data?.message) errorMessage = error.response.data.message;
    else if (error.message) errorMessage = error.message;
    return { success: false, error: errorMessage };
  }
};

// Delete custom smart sync pad template
export const deleteCustomSyncPadTemplate = async (templateId) => {
  try {
    console.log('🗑️ Starting template deletion for ID:', templateId);
    console.log('🌐 Making DELETE request to:', `/api/v1/custom-smart-sync-pad/delete-files/${templateId}`);
    
    const response = await api.delete(`/api/v1/custom-smart-sync-pad/delete-files/${templateId}`, baseUrl);
    
    console.log('✅ Template deleted successfully:', response);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Delete failed:', error);
    console.error('❌ Error response:', error.response);
    console.error('❌ Error status:', error.response?.status);
    console.error('❌ Error data:', error.response?.data);
    
    let errorMessage = 'Unable to delete template. Please try again.';
    
    if (error.response?.status === 404) {
      errorMessage = 'Template not found. It may have already been deleted.';
    } else if (error.response?.status === 403) {
      errorMessage = 'You do not have permission to delete this template.';
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error occurred while deleting template.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    return { success: false, error: errorMessage };
  }
}; 