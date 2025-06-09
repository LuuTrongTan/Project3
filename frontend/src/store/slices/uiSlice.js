import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  notification: null,
  navbarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setNotification: (state, action) => {
      state.notification = {
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    toggleNavbar: (state) => {
      state.navbarOpen = !state.navbarOpen;
    },
    closeNavbar: (state) => {
      state.navbarOpen = false;
    },
  },
});

export const {
  startLoading,
  stopLoading,
  setError,
  clearError,
  setNotification,
  clearNotification,
  toggleNavbar,
  closeNavbar,
} = uiSlice.actions;

export default uiSlice.reducer; 