import axios from "axios";
import { config } from "../config/config";

const apiClient = axios.create({
  baseURL: config.basePath, // Base URL for the API
  timeout: 10000, // Request timeout
});

export { apiClient };
