import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../../api/authAPI';
import { setError, clearError, startLoading, stopLoading } from './uiSlice';
import jwt_decode from 'jwt-decode';

// Lấy thông tin user từ local storage
const getStoredUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      // Kiểm tra token đã hết hạn chưa
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        return null;
      }
      
      const userData = JSON.parse(localStorage.getItem('user'));
      return { token, user: userData };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  }
  return null;
};

// Thunk action để đăng ký
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      dispatch(clearError());
      const response = await authAPI.register(userData);
      
      // Lưu token và user vào localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch(stopLoading());
      return response;
    } catch (error) {
      dispatch(stopLoading());
      dispatch(setError(error.response?.data?.error || 'Registration failed'));
      return rejectWithValue(error.response?.data || { error: 'Registration failed' });
    }
  }
);

// Thunk action để đăng nhập
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      dispatch(clearError());
      const response = await authAPI.login(credentials);
      
      // Lưu token và user vào localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch(stopLoading());
      return response;
    } catch (error) {
      dispatch(stopLoading());
      dispatch(setError(error.response?.data?.error || 'Login failed'));
      return rejectWithValue(error.response?.data || { error: 'Login failed' });
    }
  }
);

// Thunk action để lấy thông tin user hiện tại
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const { auth } = getState();
      
      if (!auth.token) {
        dispatch(stopLoading());
        return rejectWithValue('Not authenticated');
      }
      
      const response = await authAPI.getCurrentUser();
      dispatch(stopLoading());
      return response.user;
    } catch (error) {
      dispatch(stopLoading());
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(error.response?.data || { error: 'Failed to get user info' });
    }
  }
);

// Thunk action để gửi yêu cầu reset password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      dispatch(clearError());
      const response = await authAPI.forgotPassword(email);
      dispatch(stopLoading());
      return response;
    } catch (error) {
      dispatch(stopLoading());
      dispatch(setError(error.response?.data?.error || 'Failed to send reset email'));
      return rejectWithValue(error.response?.data || { error: 'Failed to send reset email' });
    }
  }
);

// Thunk action để reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ resetToken, password }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      dispatch(clearError());
      const response = await authAPI.resetPassword(resetToken, password);
      dispatch(stopLoading());
      return response;
    } catch (error) {
      dispatch(stopLoading());
      dispatch(setError(error.response?.data?.error || 'Failed to reset password'));
      return rejectWithValue(error.response?.data || { error: 'Failed to reset password' });
    }
  }
);

// Initial state
const initialState = {
  ...getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  loading: false,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
      })
      
      // Login
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      
      // Get current user
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer; 