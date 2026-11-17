// API Configuration
// Update this URL to point to your FastAPI backend

export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: 'http://localhost:8000/api',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Enable/disable request logging
  ENABLE_LOGGING: true,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  
  // Donors
  DONORS: {
    LIST: '/donors',
    DETAIL: (id: string) => `/donors/${id}`,
    CREATE: '/donors',
    UPDATE: (id: string) => `/donors/${id}`,
    DELETE: (id: string) => `/donors/${id}`,
  },
  
  // Blood Requests
  REQUESTS: {
    LIST: '/requests',
    DETAIL: (id: string) => `/requests/${id}`,
    USER_REQUESTS: (userId: string) => `/requests/user/${userId}`,
    CREATE: '/requests',
    UPDATE_STATUS: (id: string) => `/requests/${id}/status`,
    DELETE: (id: string) => `/requests/${id}`,
  },
  
  // Donations
  DONATIONS: {
    LIST: '/donations',
    DETAIL: (id: string) => `/donations/${id}`,
    DONOR_DONATIONS: (donorId: string) => `/donations/donor/${donorId}`,
    CREATE: '/donations',
    STATS: '/donations/stats',
  },
  
  // Inventory
  INVENTORY: {
    LIST: '/inventory',
    BY_TYPE: (bloodType: string) => `/inventory/${bloodType}`,
    UPDATE: (bloodType: string) => `/inventory/${bloodType}`,
    STATS: '/inventory/stats',
  },
};

// Helper function to build URL with query parameters
export const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params) return baseUrl;
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  
  const query = queryParams.toString();
  return query ? `${baseUrl}?${query}` : baseUrl;
};
