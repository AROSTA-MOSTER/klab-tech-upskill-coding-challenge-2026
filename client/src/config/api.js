// Centralized API configuration
// In development, defaults to backend at http://localhost:5000
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const TASKS_API = `${API_BASE_URL}/tasks`;
export const USER_API = `${API_BASE_URL}/api/user`;
