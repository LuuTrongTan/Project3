import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { register } from '../../store/slices/authSlice';
import authAPI from '../../api/authAPI';
import Spinner from '../ui/Spinner';

// Schema validation với Yup
const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name is too short')
    .max(50, 'First name is too long')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name is too short')
    .max(50, 'Last name is too long')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector((state) => ({
    loading: state.ui.loading,
    isAuthenticated: state.auth.isAuthenticated,
    error: state.ui.error,
  }));
  
  const [formError, setFormError] = useState(null);
  
  // Nếu đã đăng nhập, chuyển hướng đến trang chủ
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Xử lý khi submit form
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setFormError(null);
      // Loại bỏ confirmPassword và acceptTerms trước khi gửi lên server
      const { confirmPassword, acceptTerms, ...userData } = values;
      await dispatch(register(userData)).unwrap();
      navigate('/');
    } catch (error) {
      setFormError(error.error || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Xử lý đăng nhập với Google
  const handleGoogleLogin = () => {
    window.location.href = authAPI.getGoogleAuthUrl();
  };
  
  // Xử lý đăng nhập với Facebook
  const handleFacebookLogin = () => {
    window.location.href = authAPI.getFacebookAuthUrl();
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your account
          </Link>
        </p>
      </div>
      
      {formError && (
        <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
          {formError}
        </div>
      )}
      
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          acceptTerms: false
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Field
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                <ErrorMessage name="firstName" component="p" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Field
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                <ErrorMessage name="lastName" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`mt-1 block w-full px-3 py-2 border ${
                  touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className={`mt-1 block w-full px-3 py-2 border ${
                  touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`mt-1 block w-full px-3 py-2 border ${
                  touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-600" />
            </div>
            
            <div className="flex items-center">
              <Field
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </a>
              </label>
            </div>
            <ErrorMessage name="acceptTerms" component="p" className="mt-1 text-sm text-red-600" />
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? <Spinner size="sm" /> : 'Sign up'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaGoogle className="h-5 w-5 text-red-500" />
            <span className="ml-2">Google</span>
          </button>
          
          <button
            onClick={handleFacebookLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaFacebook className="h-5 w-5 text-blue-600" />
            <span className="ml-2">Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;