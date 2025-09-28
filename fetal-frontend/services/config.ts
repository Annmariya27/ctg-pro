export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
};

// Helper to build full URL
export const buildApiUrl = (endpoint: string) =>
  `${API_CONFIG.BASE_URL}${endpoint}`;

// Central API request function
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = buildApiUrl(endpoint);
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("API request failed:", err);
    throw err;
  }
};
