import Joi from 'joi';

/**
 * Validation schemas for forms
 * Uses Joi validation library for consistent validation between frontend and backend
 */

// Newsletter subscription schema
export const newsletterSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required'
    })
});

// Tour schema for form validation
export const tourSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(5)
    .max(100)
    .messages({
      'string.empty': 'Tour title is required',
      'string.min': 'Tour title should be at least 5 characters',
      'string.max': 'Tour title should not exceed 100 characters'
    }),
  city: Joi.string()
    .required()
    .messages({
      'string.empty': 'City is required'
    }),
  desc: Joi.string()
    .required()
    .min(20)
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description should be at least 20 characters'
    }),
  address: Joi.string()
    .required()
    .messages({
      'string.empty': 'Address is required'
    }),
  price: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.base': 'Price is required and must be a number',
      'number.min': 'Price cannot be negative'
    }),
  maxGroupSize: Joi.number()
    .required()
    .integer()
    .min(1)
    .messages({
      'number.base': 'Group size is required and must be a number',
      'number.integer': 'Group size must be a whole number',
      'number.min': 'Group size must be at least 1'
    }),
  photo: Joi.string()
    .required()
    .messages({
      'string.empty': 'Photo URL is required'
    }),
  distance: Joi.number()
    .required()
    .min(0)
    .messages({
      'number.base': 'Distance is required and must be a number',
      'number.min': 'Distance cannot be negative'
    }),
  featured: Joi.boolean()
});

// Contact form schema
export const contactSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name should be at least 2 characters',
      'string.max': 'Name should not exceed 50 characters'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required'
    }),
  subject: Joi.string()
    .required()
    .min(5)
    .max(100)
    .messages({
      'string.empty': 'Subject is required',
      'string.min': 'Subject should be at least 5 characters',
      'string.max': 'Subject should not exceed 100 characters'
    }),
  message: Joi.string()
    .required()
    .min(20)
    .max(1000)
    .messages({
      'string.empty': 'Message is required',
      'string.min': 'Message should be at least 20 characters',
      'string.max': 'Message should not exceed 1000 characters'
    })
});

// User login schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .min(8)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password should be at least 8 characters'
    })
});

// User registration schema
export const registerSchema = Joi.object({
  username: Joi.string()
    .required()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username should be at least 3 characters',
      'string.max': 'Username should not exceed 30 characters',
      'string.pattern.base': 'Username can only contain letters, numbers and underscores'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password should be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password'
    }),
  fullName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name should be at least 2 characters',
      'string.max': 'Full name should not exceed 50 characters'
    })
});

// User profile update schema
export const profileUpdateSchema = Joi.object({
  fullName: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Full name should be at least 2 characters',
      'string.max': 'Full name should not exceed 50 characters'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Please enter a valid email address'
    }),
  phone: Joi.string()
    .allow('')
    .pattern(/^[0-9+\-\s]*$/)
    .messages({
      'string.pattern.base': 'Phone number can only contain numbers, +, -, and spaces'
    }),
  address: Joi.string()
    .allow('')
    .max(100)
    .messages({
      'string.max': 'Address should not exceed 100 characters'
    }),
  bio: Joi.string()
    .allow('')
    .max(500)
    .messages({
      'string.max': 'Bio should not exceed 500 characters'
    })
});

// Tour search schema
export const tourSearchSchema = Joi.object({
  city: Joi.string()
    .allow(''),
  distance: Joi.number()
    .allow(''),
  maxGroupSize: Joi.number()
    .allow('')
    .integer()
    .min(1),
  priceMin: Joi.number()
    .allow('')
    .min(0),
  priceMax: Joi.number()
    .allow('')
    .min(0)
    .greater(Joi.ref('priceMin'))
});

// Booking schema
export const bookingSchema = Joi.object({
  tourId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Tour ID is required'
    }),
  userId: Joi.string()
    .required()
    .messages({
      'string.empty': 'User ID is required'
    }),
  fullName: Joi.string()
    .required()
    .messages({
      'string.empty': 'Full name is required'
    }),
  guestSize: Joi.number()
    .required()
    .integer()
    .min(1)
    .messages({
      'number.base': 'Number of guests is required',
      'number.integer': 'Number of guests must be an integer',
      'number.min': 'At least 1 guest is required'
    }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9+\-\s]*$/)
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number can only contain numbers, +, -, and spaces'
    }),
  bookingDate: Joi.date()
    .required()
    .min('now')
    .messages({
      'date.base': 'Please select a valid booking date',
      'date.min': 'Booking date must be in the future'
    })
});

// Helper function to validate with Joi and return friendly error messages
export const validateWithJoi = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  
  if (!error) {
    return {};
  }
  
  return error.details.reduce((acc, curr) => {
    const key = curr.path[0];
    acc[key] = curr.message;
    return acc;
  }, {});
};

// Validator comment to maintain file structure

// Validator functions for components using the above schemas
export const validateLogin = (data) => validateWithJoi(loginSchema, data);
export const validateRegister = (data) => validateWithJoi(registerSchema, data);
export const validateProfileUpdate = (data) => validateWithJoi(profileUpdateSchema, data);
export const validateTourSearch = (data) => validateWithJoi(tourSearchSchema, data);
export const validateBooking = (data) => validateWithJoi(bookingSchema, data);
export const validateNewsletter = (data) => validateWithJoi(newsletterSchema, data);
export const validateContact = (data) => validateWithJoi(contactSchema, data);
export const validateTour = (data) => validateWithJoi(tourSchema, data);
export const validateTour = (data) => validateWithJoi(tourSchema, data);
