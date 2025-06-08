import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "/api" : "https://chitchat-qe8b.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
