import api from '../../../api/services/axiosService';
import config from '../../../config';

export const uploadCustomCanvas = async (file, userId, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('canvas_file', file);
    formData.append('user_id', userId);
    formData.append('canvas_type', 'custom_rx');
    formData.append('upload_timestamp', new Date().toISOString());
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.lengthComputable) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    };
    const response = await api.post('/canvas/upload', formData, config);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    let errorMessage = 'Failed to upload canvas. Please try again.';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      error: errorMessage
    };
  }
};

export const getUserCanvasTemplates = async (userId) => {
  try {
    const response = await api.get(`/canvas/user/${userId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch canvas templates'
    };
  }
};

export const setActiveCanvas = async (userId, canvasId) => {
  try {
    const response = await api.post('/canvas/set-active', {
      user_id: userId,
      canvas_id: canvasId
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to set active canvas'
    };
  }
};

export const deleteCanvas = async (canvasId) => {
  try {
    await api.delete(`/canvas/${canvasId}`);
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to delete canvas'
    };
  }
};

export const getCanvasFileUrl = async (canvasId) => {
  try {
    const response = await api.get(`/canvas/${canvasId}/file`);
    return {
      success: true,
      url: response.data.file_url
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get canvas file'
    };
  }
}; 