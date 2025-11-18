import axios from 'axios';

// Base URL: prefer Vite env var, otherwise fallback to localhost:8080
//const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true, // enable if your backend uses cookies/sessions
});

// Attach token automatically if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    // ignore
  }
  return config;
});

// Global response handler: handle 401 to logout
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAdmin');
      // optionally redirect to login
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
