import axios from "axios";
import Constants from "expo-constants";

// Get the local IP address for development
const getApiUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();
  return debuggerHost
    ? `http://${debuggerHost}:5000/api`
    : "http://localhost:5000/api";
};

const API_BASE_URL = getApiUrl();

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(
          "API Response Error:",
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck() {
    const response = await this.api.get("/health");
    return response.data;
  }

  // Location endpoints
  async getLocations() {
    const response = await this.api.get("/locations");
    return response.data;
  }

  async createLocation(locationData: {
    name: string;
    description?: string;
    video_source?: string;
  }) {
    const response = await this.api.post("/locations", locationData);
    return response.data;
  }

  async updateLocation(
    id: string,
    locationData: Partial<{
      name: string;
      description: string;
      video_source: string;
      status: string;
    }>
  ) {
    const response = await this.api.put(`/locations/${id}`, locationData);
    return response.data;
  }

  async deleteLocation(id: string) {
    const response = await this.api.delete(`/locations/${id}`);
    return response.data;
  }

  // Violation endpoints
  async getViolations() {
    const response = await this.api.get("/violations");
    return response.data;
  }

  async acknowledgeViolation(id: number) {
    const response = await this.api.put(`/violations/${id}`);
    return response.data;
  }
}

export default new ApiService();
