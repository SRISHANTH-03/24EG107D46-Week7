import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5001" : undefined);

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
