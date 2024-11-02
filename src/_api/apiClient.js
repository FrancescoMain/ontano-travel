import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com", // Base URL for the API
  timeout: 10000, // Request timeout
});

export { apiClient };
