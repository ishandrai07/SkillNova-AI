import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    withCredentials: true,
});

// Request interceptor: Attach Authorization Bearer token from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Clear token on 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const isAuthRoute = error.config?.url?.includes("/api/auth/login") || error.config?.url?.includes("/api/auth/register");
            if (!isAuthRoute) {
                localStorage.removeItem("token");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
