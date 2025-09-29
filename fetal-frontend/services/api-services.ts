import { API_CONFIG, apiRequest } from "./config"

// Define interfaces for API data structures
// You should update these to match your actual backend API contracts

interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

// Authentication Services
export const authService = {
  login: async (email: string, password: string) => {
    return apiRequest<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  signup: async (name: string, email: string, password: string) => {
    return apiRequest<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  },

  googleAuth: async (token: string) => {
    return apiRequest<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.GOOGLE_AUTH, {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  },

  forgotPassword: async (email: string) => {
    return apiRequest<{ message: string }>(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },
}

interface PredictionResponse {
  class_index: 1 | 2 | 3; // Corresponds to Normal, Suspect, Pathological
  probability: number;
}

// CTG Analysis Services
export const analysisService = {
  // This function now calls the backend's /predict endpoint
  submitManualEntry: async (features: number[]) => {
    // The backend has a /predict endpoint, not /analysis/manual
    return apiRequest<PredictionResponse>("/predict", {
      method: "POST",
      // The backend expects the data in a specific format: { features: [...] }
      body: JSON.stringify({ features }),
    })
  },

  uploadImages: async (formData: FormData) => {
    return apiRequest<any>(API_CONFIG.ENDPOINTS.ANALYSIS.IMAGE_UPLOAD, {
      method: "POST",
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    })
  },

  getResults: async (analysisId: string) => {
    return apiRequest<any>(`${API_CONFIG.ENDPOINTS.ANALYSIS.GET_RESULTS}/${analysisId}`)
  },

  getDetails: async (analysisId: string) => {
    return apiRequest<any>(`${API_CONFIG.ENDPOINTS.ANALYSIS.GET_DETAILS}/${analysisId}`)
  },
}

// User Profile Services
export const userService = {
  getProfile: async () => {
    return apiRequest<UserProfile>(API_CONFIG.ENDPOINTS.USER.PROFILE)
  },

  updateProfile: async (profileData: any) => {
    return apiRequest<UserProfile>(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  },

  uploadAvatar: async (formData: FormData) => {
    return apiRequest<{ avatarUrl: string }>(API_CONFIG.ENDPOINTS.USER.UPLOAD_AVATAR, {
      method: "POST",
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    })
  },
}

// Patient Services
export const patientService = {
  verifyPatient: async (name: string, patientId: string) => {
    return apiRequest<{ verified: boolean }>(API_CONFIG.ENDPOINTS.PATIENT.VERIFY, {
      method: "POST",
      body: JSON.stringify({ name, patientId }),
    })
  },

  getReports: async (patientId: string) => {
    return apiRequest<any[]>(`${API_CONFIG.ENDPOINTS.PATIENT.REPORTS}/${patientId}`)
  },
}
