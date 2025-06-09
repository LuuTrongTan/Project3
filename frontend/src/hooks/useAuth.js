import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../store/slices/authSlice';

/**
 * Custom hook để xử lý authentication
 * @param {boolean} requireAuth - Nếu true, redirect đến login nếu chưa đăng nhập
 * @param {string} redirectTo - Đường dẫn redirect sau khi đăng nhập (mặc định là trang hiện tại)
 * @param {Array<string>} allowedRoles - Mảng các role được phép truy cập, nếu không có thì cho phép tất cả
 * @returns {Object} - Trả về thông tin auth và các functions liên quan
 */
const useAuth = (requireAuth = false, redirectTo = '', allowedRoles = []) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  
  // Nếu đã đăng nhập thì lấy thông tin user
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, dispatch]);
  
  // Kiểm tra quyền truy cập
  useEffect(() => {
    // Nếu không yêu cầu đăng nhập thì không cần kiểm tra
    if (!requireAuth) return;
    
    // Nếu đang loading thì chưa kiểm tra
    if (loading) return;
    
    // Nếu chưa đăng nhập, redirect đến trang login
    if (!isAuthenticated) {
      // Lưu lại đường dẫn hiện tại để sau khi đăng nhập sẽ quay lại
      const currentPath = location.pathname + location.search;
      navigate(`/login?redirect=${encodeURIComponent(redirectTo || currentPath)}`);
      return;
    }
    
    // Nếu không có danh sách role được phép hoặc danh sách rỗng thì cho phép truy cập
    if (!allowedRoles || allowedRoles.length === 0) return;
    
    // Kiểm tra xem user có quyền truy cập không
    const hasPermission = user && user.role && allowedRoles.includes(user.role);
    
    // Nếu không có quyền, redirect đến trang không có quyền truy cập
    if (!hasPermission) {
      navigate('/unauthorized');
    }
  }, [requireAuth, isAuthenticated, user, loading, navigate, location, redirectTo, allowedRoles]);
  
  return {
    isAuthenticated,
    user,
    loading,
    isAdmin: user?.role === 'admin',
  };
};

export default useAuth; 