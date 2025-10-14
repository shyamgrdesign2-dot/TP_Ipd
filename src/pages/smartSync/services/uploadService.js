import api from '../../../api/services/axiosService';
import config from '../../../config';
import { env } from "../../../EnvironmentConfig";
import { PERSISTANT_STORAGE_KEY_AUTH_TOKEN } from '../../../utils/constants';
import { getDecodedToken } from '../../../utils/localStorage';

// Base URL for custom smart sync API calls - using the URL from your working cURL
const baseUrl = { customBaseUrl: env.digitization_api_url };

const token = localStorage.getItem(PERSISTANT_STORAGE_KEY_AUTH_TOKEN);
const cleanedToken = token?.replace(/['"]+/g, "");
const decodedToken = getDecodedToken();
const doctorId = decodedToken?.result?.user_id;

// Get all custom smart sync pad templates
export const getCustomSyncPadTemplates = async () => {
  try {
    const response = await api.get('/api/v1/custom-smart-sync-pad/get-files', baseUrl);
    return {
      success: true,
      data: response.data || response // Handle different response structures
    };
  } catch (error) {
    console.error('Failed to fetch templates:', error.message);
    return {
      success: false,
      error: 'Unable to fetch templates. Please try again.'
    };
  }
};

// Helper function to compress image data
const compressImage = (dataUrl, quality = 0.7, maxWidth = 1200) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.src = dataUrl;
  });
};

// Helper function to calculate total payload size
const calculatePayloadSize = (files) => {
  let totalSize = 0;
  files.forEach(file => {
    if (file.uploadFile && file.uploadFile.size) {
      totalSize += file.uploadFile.size;
    }
  });
  return totalSize;
};

// Upload new custom smart sync pad template with chunked upload support
export const uploadCustomSyncPadTemplate = async (templateData, onProgress) => {
  try {
    
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

    // Calculate total payload size
    const totalSize = calculatePayloadSize(templateData.files);
    const MAX_PAYLOAD_SIZE = 10 * 1024 * 1024; // 10MB limit
    
    // If payload is too large, use chunked upload
    if (totalSize > MAX_PAYLOAD_SIZE) {
      return await uploadInChunks(templateData, onProgress);
    }

    // Original single request upload for smaller payloads
    const formData = new FormData();
    formData.append('title', templateData.title);
    
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
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${cleanedToken}`},
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.lengthComputable) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
      ...baseUrl
    };
        
    try {
      const responseData = await api.post('/api/v1/custom-smart-sync-pad/upload-files', formData, requestConfig);
            
      // Check if we have valid response data - the API returns an object with id, uploaded_files, and title
      if (responseData && responseData.id && responseData.uploaded_files && responseData.title) {
        
        return {
          success: true,
          data: responseData
        };
      } else if (responseData) {
        // We got some response but it doesn't match expected structure
        return {
          success: true, // Still consider it successful since we got a response
          data: responseData
        };
      } else {
        return {
          success: false,
          error: 'API returned empty response'
        };
      }
    } catch (apiError) {
      console.error('API Call failed:', apiError.message);
      // Re-throw the error to be caught by outer catch block
      throw apiError;
    }
  } catch (error) {
    console.error('Upload failed:', error.message);
    
    let errorMessage = 'Upload failed. Please try again.';
    if (error.response?.data?.message) errorMessage = error.response.data.message;
    else if (error.message) errorMessage = error.message;
    return { success: false, error: errorMessage };
  }
};

// Chunked upload implementation for large files with retry mechanism
const uploadInChunks = async (templateData, onProgress) => {
  const CHUNK_SIZE = 5; // Upload 5 files at a time
  const MAX_RETRIES = 3; // Maximum retry attempts per chunk
  const files = templateData.files;
  const chunks = [];
  
  // Split files into chunks
  for (let i = 0; i < files.length; i += CHUNK_SIZE) {
    chunks.push(files.slice(i, i + CHUNK_SIZE));
  }
  
  let uploadedFiles = [];
  let totalProgress = 0;
  
  try {
    // Upload each chunk with retry mechanism
    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];
      let chunkUploaded = false;
      let retryCount = 0;
      
      while (!chunkUploaded && retryCount < MAX_RETRIES) {
        try {
          // Compress images in this chunk to reduce size
          const compressedChunk = await Promise.all(
            chunk.map(async (file, index) => {
              if (file.uploadFile && file.uploadFile.type.startsWith('image/')) {
                try {
                  // Convert file to data URL for compression
                  const dataUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(file.uploadFile);
                  });
                  
                  // Compress the image
                  const compressedDataUrl = await compressImage(dataUrl, 0.6, 1000);
                  
                  // Convert back to File
                  const response = await fetch(compressedDataUrl);
                  const buffer = await response.arrayBuffer();
                  const compressedFile = new File([buffer], file.uploadFile.name, { 
                    type: 'image/jpeg' 
                  });
                  
                  return {
                    ...file,
                    uploadFile: compressedFile
                  };
                } catch (error) {
                  console.warn(`Failed to compress file ${index}, using original:`, error);
                  return file;
                }
              }
              return file;
            })
          );
          
          // Create form data for this chunk
          const formData = new FormData();
          formData.append('title', templateData.title);
          formData.append('chunk_index', chunkIndex);
          formData.append('total_chunks', chunks.length);
          
          compressedChunk.forEach((file, index) => {
            formData.append('uploaded_files', file.uploadFile);
          });
          
          const metadata = compressedChunk.map((file, index) => ({
            fileName: file.uploadFile.name,
            order: file.order || (chunkIndex * CHUNK_SIZE + index + 1)
          }));
          
          formData.append('metadata', JSON.stringify(metadata));
          
          const requestConfig = {
            headers: { 
              'Content-Type': 'multipart/form-data', 
              Authorization: `Bearer ${cleanedToken}`
            },
            onUploadProgress: (progressEvent) => {
              if (onProgress && progressEvent.lengthComputable) {
                const chunkProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                const overallProgress = Math.round(
                  ((chunkIndex * 100 + chunkProgress) / chunks.length)
                );
                onProgress(overallProgress);
              }
            },
            ...baseUrl
          };
          
          // Upload this chunk
          const responseData = await api.post('/api/v1/custom-smart-sync-pad/upload-files', formData, requestConfig);
          
          if (responseData && responseData.id) {
            uploadedFiles.push(...compressedChunk);
            totalProgress = Math.round(((chunkIndex + 1) / chunks.length) * 100);
            onProgress && onProgress(totalProgress);
            chunkUploaded = true;
          } else {
            throw new Error(`Invalid response for chunk ${chunkIndex + 1}`);
          }
          
        } catch (chunkError) {
          retryCount++;
          console.warn(`Chunk ${chunkIndex + 1} upload failed (attempt ${retryCount}/${MAX_RETRIES}):`, chunkError);
          
          if (retryCount >= MAX_RETRIES) {
            throw new Error(`Failed to upload chunk ${chunkIndex + 1} after ${MAX_RETRIES} attempts: ${chunkError.message}`);
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        }
      }
    }
    
    // Return success with the final response
    return {
      success: true,
      data: {
        id: `chunked_upload_${Date.now()}`,
        title: templateData.title,
        uploaded_files: uploadedFiles,
        total_files: uploadedFiles.length
      }
    };
    
  } catch (error) {
    console.error('Chunked upload failed:', error);
    throw error;
  }
};

// Update existing custom smart sync pad template
export const updateCustomSyncPadTemplate = async (templateId, templateData, onProgress) => {
  try {
    
    const formData = new FormData();
    formData.append('title', templateData.title);
    
    templateData.files.forEach((file, index) => {
      formData.append('uploaded_files', file.uploadFile);
    });
    
    const metadata = templateData.files.map((file, index) => ({
      fileName: file.uploadFile.name,
      order: file.order || index + 1
    }));
    formData.append('metadata', JSON.stringify(metadata));
    
    const requestConfig = {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${cleanedToken}`},
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.lengthComputable) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    };
    
    const responseData = await api.put(`/api/v1/custom-smart-sync-pad/update-files/${templateId}`, formData, { ...requestConfig, ...baseUrl });
    
    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error('Template update failed:', error);
    let errorMessage = 'Update failed. Please try again.';
    if (error.response?.data?.message) errorMessage = error.response.data.message;
    else if (error.message) errorMessage = error.message;
    return { success: false, error: errorMessage };
  }
};

// Delete custom smart sync pad template
export const deleteCustomSyncPadTemplate = async (templateId) => {
  try {
    
    const response = await api.delete(`/api/v1/custom-smart-sync-pad/delete-files/${templateId}`, baseUrl);
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Delete failed:', error);
    
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

// Set custom smart sync pad template as default
export const setDefaultCustomSyncPadTemplate = async (templateId) => {
  try {
    const requestConfig = {
      headers: { Authorization: `Bearer ${cleanedToken}` },
      ...baseUrl
    };
    
    const response = await api.get(`/api/v1/custom-smart-sync-pad/set-default/${templateId}`, requestConfig);
    
    return { 
      success: true, 
      data: response.data || response,
      message: 'Template set as default successfully'
    };
  } catch (error) {
    console.error('Set default failed:', error);
    
    // let errorMessage = 'Unable to set template as default. Please try again.';
    
    // if (error.response?.status === 404) {
    //   errorMessage = 'Template not found.';
    // } else if (error.response?.status === 403) {
    //   errorMessage = 'You do not have permission to modify this template.';
    // } else if (error.response?.status === 500) {
    //   errorMessage = 'Server error occurred while setting template as default.';
    // } else if (error.response?.data?.message) {
    //   errorMessage = error.response.data.message;
    // }
  }
}; 

