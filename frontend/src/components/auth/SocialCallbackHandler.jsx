import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setError } from '../../store/slices/uiSlice';
import authAPI from '../../api/authAPI';
import Spinner from '../ui/Spinner';

/**
 * Component để xử lý callback sau khi đăng nhập từ mạng xã hội
 */
const SocialCallbackHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(true);
  
  useEffect(() => {
    const handleSocialCallback = async () => {
      try {
        // Lấy token từ query parameter
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');
        
        if (error) {
          throw new Error(error);
        }
        
        if (!token) {
          throw new Error('Token not found in the URL');
        }
        
        // Xử lý token từ social login
        await authAPI.handleSocialLoginCallback(token);
        
        // Redirect về trang chủ hoặc trang được chỉ định
        const redirectUrl = urlParams.get('redirect') || '/';
        navigate(redirectUrl);
      } catch (error) {
        console.error('Social login callback error:', error);
        dispatch(setError(error.message || 'Authentication failed. Please try again.'));
        navigate('/login');
      } finally {
        setProcessing(false);
      }
    };
    
    handleSocialCallback();
  }, [dispatch, navigate, location]);
  
  if (processing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Processing your login, please wait...</p>
      </div>
    );
  }
  
  return null;
};

export default SocialCallbackHandler; 