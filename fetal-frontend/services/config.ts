// API Configuration for Fetal Health Analysis System
export const API_CONFIG = {
  // Base API URL - will use environment variable or fallback to localhost
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",

  // API Endpoints
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      LOGIN: "/auth/login",
      SIGNUP: "/auth/signup",
      FORGOT_PASSWORD: "/auth/forgot-password",
      GOOGLE_AUTH: "/auth/google",
    },

    // CTG Analysis endpoints
    ANALYSIS: {
      MANUAL_ENTRY: "/analysis/manual",
      IMAGE_UPLOAD: "/analysis/upload",
      GET_RESULTS: "/analysis/results",
      GET_DETAILS: "/analysis/details",
    },

    // User management endpoints
    USER: {
      PROFILE: "/user/profile",
      UPDATE_PROFILE: "/user/update",
      UPLOAD_AVATAR: "/user/avatar",
    },

    // Patient endpoints
    PATIENT: {
      REPORTS: "/patient/reports",
      VERIFY: "/patient/verify",
    },
  },
}

// Helper function to build complete API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// API request helper with error handling
export const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const url = buildApiUrl(endpoint)
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return (await response.json()) as T
  } catch (error) {
    console.error("API Request failed:", error)
    throw error
  }
}
