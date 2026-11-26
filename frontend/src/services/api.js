import axios from "axios";

const rawBaseURL =
  import.meta.env.VITE_API_URL || "https://namla-38vr.onrender.com/api";

const baseURL = rawBaseURL.endsWith("/api")
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
