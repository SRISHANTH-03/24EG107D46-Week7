import axios from "axios";

const api = axios.create({
  baseURL: "https://two4eg107d46-capstrone.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
