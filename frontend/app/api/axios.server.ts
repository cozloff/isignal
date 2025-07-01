import axios from "axios";
import https from "https";

const BASE_URL = process.env.VITE_BACKEND_URL;

let apiClient = axios.create({
  baseURL: BASE_URL,
});

if (process.env.VITE_ENVIORNMENT === "development") {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Disables SSL verification
  });
  apiClient.defaults.httpsAgent = httpsAgent;
}

export default apiClient;
