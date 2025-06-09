import axiosInstance from './axiosInstance';

const authAPI = {
  // Đăng ký tài khoản mới
  register: async (userData) => {
    return await axiosInstance.post('/auth/register', userData);
  },
  
  // Đăng nhập
  login: async (credentials) => {
    return await axiosInstance.post('/auth/login', credentials);
  },
  
  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    return await axiosInstance.get('/auth/me');
  },
  
  // Gửi yêu cầu reset password
  forgotPassword: async (email) => {
    return await axiosInstance.post('/auth/forgot-password', { email });
  },
  
  // Reset password
  resetPassword: async (resetToken, password) => {
    return await axiosInstance.put(`/auth/reset-password/${resetToken}`, { password });
  },

  // Đăng nhập bằng Google (chỉ lấy URL để redirect)
  getGoogleAuthUrl: () => {
    return `${axiosInstance.defaults.baseURL}/auth/google`;
  },
  
  // Đăng nhập bằng Facebook (chỉ lấy URL để redirect)
  getFacebookAuthUrl: () => {
    return `${axiosInstance.defaults.baseURL}/auth/facebook`;
  },
  
  // Xử lý callback sau khi đăng nhập bằng Google hoặc Facebook
  handleSocialLoginCallback: async (token) => {
    // Token được trả về từ URL callback
    localStorage.setItem('token', token);
    // Lấy thông tin user từ token
    const userInfo = await axiosInstance.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(userInfo.user));
    return { token, user: userInfo.user };
  }
};

export default authAPI; 