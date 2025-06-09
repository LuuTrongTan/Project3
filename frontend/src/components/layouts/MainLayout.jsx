import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './Navbar';
import Footer from './Footer';
import { clearNotification } from '../../store/slices/uiSlice';
import { getCurrentUser } from '../../store/slices/authSlice';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { notification, error } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Kiểm tra nếu người dùng đã đăng nhập, lấy thông tin user
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);
  
  // Tự động xóa thông báo sau 3 giây
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default MainLayout; 