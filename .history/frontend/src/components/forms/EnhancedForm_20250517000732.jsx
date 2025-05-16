import React from 'react';
import useFormWithValidation from '../../hooks/useFormWithValidation';
import { FormInput, FormButton } from './index';

/**
 * An enhanced form component with built-in validation
 * Supports various input types including text, email, password, textarea, select, checkbox, etc.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.schema - Joi validation schema
 * @param {Object} props.initialValues - Initial form values
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Array} props.fields - Array of field configurations
 * @param {String} props.submitButton - Label for submit button
 * @param {String} props.loadingText - Text to show during submission
 * @param {Boolean} props.isLoading - Loading state
 * @param {React.ReactNode} props.children - Additional content to render
 */
const EnhancedForm = ({
  schema,
  initialValues,
  onSubmit,
  fields = [],
  submitButton = 'Submit',
  loadingText = 'Processing...',
  isLoading = false,
  children,
  className = '',
  ...props
}) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    validateForm
  } = useFormWithValidation(schema, initialValues);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const { isValid } = validateForm();
    
    if (isValid) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className} {...props}>
      {fields.map(field => (
        <FormInput
          key={field.name}
          type={field.type || 'text'}
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          value={values[field.name] || (field.type === 'checkbox' ? false : '')}
          onChange={handleChange}
          validation={{ errors, touched }}
          required={field.required}
          options={field.options}
          className={field.className || 'mb-4'}
          {...field.props}
        />
      ))}
      
      {children}
      
      <FormButton
        type="submit"
        text={submitButton}
        loadingText={loadingText}
        isLoading={isLoading}
        className="mt-4"
      />
    </form>
  );
};

export default EnhancedForm;
