import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling with validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validateFn - Validation function
 * @param {Function} onSubmit - Submit handler function
 * @returns {Object} - Form state and handlers
 */
const useForm = (initialValues, validateFn, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const inputValue = type === 'checkbox' ? checked : value;
    
    setValues((prev) => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Handle input blur for field-level validation
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));
    
    // Only validate if we have a validation function
    if (validateFn) {
      const validationErrors = validateFn({ [name]: values[name] });
      setErrors((prev) => ({
        ...prev,
        ...validationErrors
      }));
    }
  }, [validateFn, values]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    setIsSubmitting(true);
    
    // Validate all fields
    if (validateFn) {
      const validationErrors = validateFn(values);
      setErrors(validationErrors);
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      
      setTouched(allTouched);
      
      // If we have validation errors, don't submit
      if (Object.keys(validationErrors).length > 0) {
        setIsSubmitting(false);
        return;
      }
    }
    
    // Call onSubmit function if provided
    if (onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  }, [validateFn, values, onSubmit]);

  // Set a specific field value programmatically
  const setFieldValue = useCallback((field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Set multiple field values at once
  const setMultipleValues = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setMultipleValues,
    resetForm
  };
};

export default useForm;
