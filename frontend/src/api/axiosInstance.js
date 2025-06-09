import axios from 'axios';
import store from '../store';
import { logout } from '../store/slices/authSlice';

// Tạo instance axios với baseURL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ store
    const { auth } = store.getState();
    
    // Nếu có token, thêm vào header
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Xử lý lỗi 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Nếu token hết hạn, logout
      store.dispatch(logout());
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 