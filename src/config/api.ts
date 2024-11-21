// API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'mock',
  ENDPOINTS: {
    MEDICAL_RECORDS: '/api/medical-records',
    USERS: '/api/users',
    ANNOUNCEMENTS: '/api/announcements',
    EVENTS: '/api/events',
    NOTIFICATIONS: '/api/notifications',
  },
  TIMEOUT: 5000, // 5 seconds
};

// API endpoints configuration
export const API_ENDPOINTS = {
  // User endpoints
  USERS: {
    LIST: '/users',
    STATS: '/users/stats',
    UPDATE_STATUS: (userId: string) => `/users/${userId}/status`,
    DELETE: (userId: string) => `/users/${userId}`,
  },
  
  // Medical records endpoints
  MEDICAL_RECORDS: {
    LIST: '/medical-records',
    DETAIL: (id: string) => `/medical-records/${id}`,
    CREATE: '/medical-records',
    UPDATE: (id: string) => `/medical-records/${id}`,
    DELETE: (id: string) => `/medical-records/${id}`,
    SEARCH: '/medical-records/search',
  },

  // Announcements endpoints
  ANNOUNCEMENTS: {
    LIST: '/announcements',
    CREATE: '/announcements',
    UPDATE: (id: string) => `/announcements/${id}`,
    DELETE: (id: string) => `/announcements/${id}`,
    TOGGLE_PIN: (id: string) => `/announcements/${id}/pin`,
  },

  // Medical timeline endpoints
  MEDICAL_TIMELINE: {
    LIST: (patientId: string) => `/medical-timeline/${patientId}`,
    CREATE: '/medical-timeline',
    UPDATE: (id: string) => `/medical-timeline/${id}`,
    DELETE: (id: string) => `/medical-timeline/${id}`,
  },
};

// API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Helper to determine if we should use mock data
export const useMockData = () => API_CONFIG.BASE_URL === 'mock';
