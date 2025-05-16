import React from 'react';

/**
 * A reusable form input component with validation support
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, password, etc)
 * @param {string} props.name - Input name and id
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Input change handler
 * @param {Object} props.validation - Validation state
 * @param {Object} props.validation.errors - Validation errors
 * @param {Object} props.validation.touched - Touched state
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether the field is required
 */
const FormInput = ({ 
  type = 'text', 
  name, 
  label, 
  placeholder, 
  value, 
  onChange, 
  validation = {}, 
  className = '',
  required = false,
  ...props 
}) => {
  const { errors = {}, touched = {} } = validation;
  
  // Determine if the field has an error
  const hasError = touched[name] && errors[name];
  
  // Determine if the field is valid
  const isValid = touched[name] && !errors[name];

  return (
    <div className={`form-input-group ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent transition-all duration-200 shadow-sm placeholder-slate-400 
          ${hasError 
            ? 'border-red-500 bg-red-50' 
            : isValid 
              ? 'border-green-500 bg-green-50' 
              : 'border-slate-300'}`}
          {...props}
        />
        
        {/* Success indicator */}
        {isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {hasError && (
        <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
      )}
    </div>
  );
};

export default FormInput;
