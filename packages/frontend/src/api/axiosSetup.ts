import axios from 'axios';
import store from '../store';
import { logout } from '../store/authSlice';

// Configure Axios interceptor
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
            window.location.href = '/'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default axios;
