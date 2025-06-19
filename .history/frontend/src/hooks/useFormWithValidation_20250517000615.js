import { useState, useCallback } from 'react';
import useValidation from './useValidation';

/**
 * Custom hook that combines form state management with validation
 * 
 * @param {Object} schema - Joi validation schema
 * @param {Object} initialValues - Initial form values
 * @returns {Object} - Form state and helper functions
 */
const useFormWithValidation = (schema, initialValues = {}) => {
  // Form values state
  const [values, setValues] = useState(initialValues);
  
  // Get validation methods from useValidation hook
  const { 
    errors, 
    touched, 
    isValid,
    validateField, 
    validateAll, 
    touchField, 
    resetValidation 
  } = useValidation(schema);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const inputValue = type === 'checkbox' ? checked : value;
    
    // Update form values
    setValues(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Mark field as touched and validate
    touchField(name);
    validateField(name, inputValue);
  }, [touchField, validateField]);

  // Set a field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate the field with new value
    validateField(name, value);
  }, [validateField]);

  // Reset the form to initial values
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    resetValidation();
  }, [initialValues, resetValidation]);

  // Validate all fields and return result
  const validateForm = useCallback(() => {
    const result = validateAll(values);
    
    // Mark all fields as touched when validating the entire form
    if (!result.isValid) {
      Object.keys(values).forEach(field => touchField(field));
    }
    
    return result;
  }, [validateAll, values, touchField]);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    setFieldValue,
    resetForm,
    validateForm
  };
};

export default useFormWithValidation;
