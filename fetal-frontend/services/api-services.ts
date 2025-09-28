import { API_CONFIG, apiRequest } from "./config";
import { FEATURES_22 } from "../constants/features"; // 👈 correct path

// --- Authentication Services ---
export const authService = {
  login: async (email: string, password: string) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (name: string, email: string, password: string) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  googleAuth: async (token: string) => {
    return apiRequest("/auth/google", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  forgotPassword: async (email: string) => {
    return apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

// --- CTG Analysis Services ---
export const analysisService = {
  submitManualEntry: async (data: number[]) => {
    // Map array → feature object (backend expects keys, not just values)
    const payload: Record<string, number> = {};
    FEATURES_22.forEach((name, i) => {
      payload[name] = data[i];
    });

    return apiRequest("/predict", {
      method: "POST",
      body: JSON.stringify(payload), // ✅ correct format
    });
  },

  uploadImages: async (formData: FormData) => {
    return apiRequest("/analysis/upload", {
      method: "POST",
      headers: {}, // browser sets content-type for FormData
      body: formData,
    });
  },

  getResults: async (analysisId: string) => {
    return apiRequest(`/analysis/results/${analysisId}`);
  },

  getDetails: async (analysisId: string) => {
    return apiRequest(`/analysis/details/${analysisId}`);
  },
};

// --- User Profile Services ---
export const userService = {
  getProfile: async () => apiRequest("/user/profile"),

  updateProfile: async (profileData: any) =>
    apiRequest("/user/update", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  uploadAvatar: async (formData: FormData) =>
    apiRequest("/user/avatar", {
      method: "POST",
      headers: {}, // browser handles FormData
      body: formData,
    }),
};

// --- Patient Services ---
export const patientService = {
  verifyPatient: async (name: string, patientId: string) =>
    apiRequest("/patient/verify", {
      method: "POST",
      body: JSON.stringify({ name, patientId }),
    }),

  getReports: async (patientId: string) =>
    apiRequest(`/patient/reports/${patientId}`),
};
