import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook để xử lý form
 * @param {Object} initialValues - Giá trị ban đầu của form
 * @param {Function} validate - Hàm validate form
 * @param {Function} onSubmit - Hàm xử lý khi submit form
 * @returns {Object} - Trả về các giá trị và hàm xử lý form
 */
const useForm = (initialValues, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Set giá trị form
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);
  
  // Xử lý khi thay đổi giá trị input
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);
  
  // Xử lý blur input
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);
  
  // Xử lý submit form
  const handleSubmit = useCallback((e) => {
    e && e.preventDefault();
    
    // Đánh dấu tất cả các field là đã touched
    const touchedAll = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(touchedAll);
    
    // Validate form
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);
    
    // Nếu không có lỗi thì submit
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      onSubmit && onSubmit(values);
    }
  }, [values, validate, onSubmit]);
  
  // Validate form mỗi khi values thay đổi
  useEffect(() => {
    if (validate && Object.keys(touched).length > 0) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [values, validate, touched]);
  
  // Reset isSubmitting sau khi submit
  useEffect(() => {
    if (isSubmitting) {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues
  };
};

export default useForm; 