import React from 'react';

/**
 * A reusable form input component with validation support
 * Supports different input types including text, email, password, textarea, select, etc.
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, password, textarea, select, etc)
 * @param {string} props.name - Input name and id
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Input placeholder
 * @param {string|number|boolean} props.value - Input value
 * @param {function} props.onChange - Input change handler
 * @param {Object} props.validation - Validation state
 * @param {Object} props.validation.errors - Validation errors
 * @param {Object} props.validation.touched - Touched state
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether the field is required
 * @param {Array} props.options - Options for select input
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
  options = [],
  ...props 
}) => {
  const { errors = {}, touched = {} } = validation;
  
  // Determine if the field has an error
  const hasError = touched[name] && errors[name];
  
  // Determine if the field is valid
  const isValid = touched[name] && !errors[name];

  // Common class for inputs
  const inputClass = `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent transition-all duration-200 shadow-sm placeholder-slate-400 
    ${hasError 
      ? 'border-red-500 bg-red-50' 
      : isValid 
        ? 'border-green-500 bg-green-50' 
        : 'border-slate-300'}`;

  // Render success indicator
  const renderSuccessIndicator = () => {
    if (isValid) {
      return (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    return null;
  };

  // Render the appropriate input type
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            className={inputClass}
            {...props}
          />
        );
      
      case 'select':
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClass}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={value}
              onChange={onChange}
              className="h-4 w-4 rounded border-slate-300 text-BaseColor focus:ring-BaseColor"
              {...props}
            />
            {label && (
              <label 
                htmlFor={name}
                className="ml-2 block text-sm text-slate-700"
              >
                {label} {required && <span className="text-red-500">*</span>}
              </label>
            )}
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${name}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  className="h-4 w-4 border-slate-300 text-BaseColor focus:ring-BaseColor"
                  {...props}
                />
                <label 
                  htmlFor={`${name}-${option.value}`}
                  className="ml-2 block text-sm text-slate-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="relative">
            <input
              type={type}
              id={name}
              name={name}
              value={value}
              placeholder={placeholder}
              onChange={onChange}
              className={inputClass}
              {...props}
            />
            {renderSuccessIndicator()}
          </div>
        );
    }
  };

  return (
    <div className={`form-input-group ${className}`}>
      {label && type !== 'checkbox' && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {/* Error message */}
      {hasError && (
        <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
      )}
    </div>
  );
};

export default FormInput;
