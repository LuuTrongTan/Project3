import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../ui/Spinner';

/**
 * Component bảo vệ route, chỉ cho phép truy cập khi đã đăng nhập và có quyền
 * @param {boolean} requireAuth - Yêu cầu đăng nhập
 * @param {Array<string>} allowedRoles - Danh sách các role được phép truy cập
 */
const ProtectedRoute = ({ requireAuth = true, allowedRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);
  
  // Nếu đang loading, hiển thị spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Nếu chưa đăng nhập và yêu cầu đăng nhập
  if (!isAuthenticated && requireAuth) {
    // Redirect đến trang login và lưu lại đường dẫn hiện tại để quay lại sau khi đăng nhập
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  // Nếu đã đăng nhập nhưng yêu cầu role cụ thể
  if (isAuthenticated && allowedRoles.length > 0) {
    // Kiểm tra xem user có quyền truy cập không
    const hasRequiredRole = user && allowedRoles.includes(user.role);
    
    // Nếu không có quyền, redirect đến trang unauthorized
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Nếu đã đăng nhập và có quyền, render component con
  return <Outlet />;
};

export default ProtectedRoute; 