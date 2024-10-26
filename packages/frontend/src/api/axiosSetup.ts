import axios from 'axios';
import  store  from '../store';
import { logout } from '../store/authSlice';

// Configure Axios instance
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Make sure this matches your backend API base URL
});

// Request interceptor to add Authorization header
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Attach token as Bearer token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle unauthorized errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403) {
            store.dispatch(logout());
            window.location.href = '/'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default instance;
