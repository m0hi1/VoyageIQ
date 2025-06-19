import { useState, useCallback } from 'react';

/**
 * Custom hook for form validation
 * @param {Object} schema - Joi validation schema
 * @returns {Object} - Validation state and functions
 */
const useValidation = (schema) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Validate a single field
  const validateField = useCallback((name, value) => {
    if (!schema) return '';

    // Create a subset schema for single field validation
    const fieldSchema = schema.extract(name);
    
    if (!fieldSchema) return '';

    const { error } = fieldSchema.validate(value);
    return error ? error.message : '';
  }, [schema]);

  // Validate all fields
  const validateAll = useCallback((data) => {
    if (!schema) return { isValid: true, errors: {} };

    const { error } = schema.validate(data, { 
      abortEarly: false,
      allowUnknown: true
    });

    if (!error) {
      setIsValid(true);
      setErrors({});
      return { isValid: true, errors: {} };
    }

    const validationErrors = {};
    error.details.forEach(detail => {
      const path = detail.path[0];
      validationErrors[path] = detail.message;
    });

    setErrors(validationErrors);
    setIsValid(false);
    
    return { 
      isValid: false, 
      errors: validationErrors 
    };
  }, [schema]);

  // Mark a field as touched
  const touchField = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  // Reset validation state
  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
    setIsValid(false);
  }, []);

  return {
    errors,
    touched,
    isValid,
    validateField,
    validateAll,
    touchField,
    resetValidation
  };
};

export default useValidation;
