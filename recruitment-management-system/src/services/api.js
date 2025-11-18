// src/services/api.js
import axios from 'axios';

// Use relative path when using Vite proxy in development
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://localhost:5051/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout for development
});

// Remove the process.env line completely - it's not needed with the proxy
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Enhanced error interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.config.url);
    return response;
  },
  (error) => {
    const errorDetails = {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText
    };
    
    console.error('❌ API Error:', errorDetails);
    
    // Specific error handling
    if (error.code === 'NETWORK_ERROR') {
      error.message = 'Cannot connect to backend server. Please ensure it is running on https://localhost:5051';
    } else if (error.response?.status === 404) {
      error.message = 'API endpoint not found. Check if the backend routes are correct.';
    } else if (error.response?.status >= 500) {
      error.message = 'Server error. Please check the backend logs.';
    }
    
    return Promise.reject(error);
  }
);

// Export APIs
export const authAPI = {
  createTestUsers: () => api.post('/Auth/create-test-users'),
  getUsers: () => api.get('/Auth/users'),
  getActiveUsers: () => api.get('/Auth/active-users'),
};

export const clientsAPI = {
  getAll: (params = {}) => api.get('/Clients', { params }),
  getById: (id) => api.get(`/Clients/${id}`),
  create: (clientData) => api.post('/Clients', clientData),
  update: (id, clientData) => api.put(`/Clients/${id}`, clientData),
  delete: (id) => api.delete(`/Clients/${id}`),
};

export const projectsAPI = {
  getAll: (params = {}) => api.get('/Projects', { params }),
  getById: (id) => api.get(`/Projects/${id}`),
  create: (projectData) => api.post('/Projects', projectData),
  update: (id, projectData) => api.put(`/Projects/${id}`, projectData),
  updateProgress: (id, progressData) => api.put(`/Projects/${id}/progress`, progressData),
  delete: (id) => api.delete(`/Projects/${id}`),
  
  // If backend expects different field names, modify the API call:
addTeamMember: (projectId, memberData) => 
  api.post(`/Projects/${projectId}/team-members`, {
    // Map to backend expected fields if different
    fullName: memberData.name,
    emailAddress: memberData.email,
    jobRole: memberData.role
  }),
  addModule: (projectId, moduleData) => 
    api.post(`/Projects/${projectId}/modules`, moduleData),
  getModules: (projectId) => api.get(`/Projects/${projectId}/modules`),
};

export default api;