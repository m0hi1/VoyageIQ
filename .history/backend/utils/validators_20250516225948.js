import Joi from 'joi';
import mongoose from 'mongoose';
import AppError from './appError.js';

/**
 * Tour validator schema
 */
export const tourValidator = Joi.object({
  title: Joi.string().min(3).max(100).required()
    .messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least {#limit} characters long',
      'string.max': 'Title cannot be longer than {#limit} characters',
      'any.required': 'Title is required'
    }),
  city: Joi.string().required()
    .messages({
      'string.base': 'City must be a string',
      'string.empty': 'City is required',
      'any.required': 'City is required'
    }),
  desc: Joi.string().min(20).required()
    .messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least {#limit} characters long',
      'any.required': 'Description is required'
    }),
  maxGroupSize: Joi.number().integer().min(1).required()
    .messages({
      'number.base': 'Maximum group size must be a number',
      'number.integer': 'Maximum group size must be an integer',
      'number.min': 'Maximum group size must be at least {#limit}',
      'any.required': 'Maximum group size is required'
    }),
  photo: Joi.string().required()
    .messages({
      'string.base': 'Photo must be a string',
      'string.empty': 'Photo is required',
      'any.required': 'Photo is required'
    }),
  address: Joi.string().required()
    .messages({
      'string.base': 'Address must be a string',
      'string.empty': 'Address is required',
      'any.required': 'Address is required'
    }),
  price: Joi.number().min(0).required()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required'
    }),
  distance: Joi.number().min(0).required()
    .messages({
      'number.base': 'Distance must be a number',
      'number.min': 'Distance cannot be negative',
      'any.required': 'Distance is required'
    }),
  featured: Joi.boolean(),
  reviews: Joi.array(),
});

/**
 * User validator schema
 */
export const userValidator = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required()
    .messages({
      'string.base': 'Username must be a string',
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be at least {#limit} characters long',
      'string.max': 'Username cannot be longer than {#limit} characters',
      'any.required': 'Username is required'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.base': 'Email must be a string',
      'string.email': 'Email must be a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least {#limit} characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),
  photo: Joi.string(),
  role: Joi.string().valid('user', 'admin', 'guide'),
});

/**
 * Review validator schema
 */
export const reviewValidator = Joi.object({
  rating: Joi.number().min(1).max(5).required()
    .messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least {#limit}',
      'number.max': 'Rating cannot be greater than {#limit}',
      'any.required': 'Rating is required'
    }),
  text: Joi.string().min(10).required()
    .messages({
      'string.base': 'Review text must be a string',
      'string.empty': 'Review text is required',
      'string.min': 'Review text must be at least {#limit} characters long',
      'any.required': 'Review text is required'
    }),
  tour: Joi.string().required()
    .messages({
      'string.base': 'Tour ID must be a string',
      'string.empty': 'Tour ID is required',
      'any.required': 'Tour ID is required'
    }),
});

/**
 * Booking validator schema
 */
export const bookingValidator = Joi.object({
  tourId: Joi.string().required()
    .messages({
      'string.base': 'Tour ID must be a string',
      'string.empty': 'Tour ID is required',
      'any.required': 'Tour ID is required'
    }),
  userId: Joi.string().required()
    .messages({
      'string.base': 'User ID must be a string',
      'string.empty': 'User ID is required',
      'any.required': 'User ID is required'
    }),
  date: Joi.date().iso().min('now').required()
    .messages({
      'date.base': 'Date must be a valid date',
      'date.format': 'Date must be in ISO format',
      'date.min': 'Date cannot be in the past',
      'any.required': 'Date is required'
    }),
  guestSize: Joi.number().integer().min(1).required()
    .messages({
      'number.base': 'Guest size must be a number',
      'number.integer': 'Guest size must be an integer',
      'number.min': 'Guest size must be at least {#limit}',
      'any.required': 'Guest size is required'
    }),
  paymentInfo: Joi.object(),
});

/**
 * Check if a string is a valid MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} - Whether ID is valid
 */
export const isValidObjectId = id => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Middleware to validate request body against a schema
 * @param {Object} schema - Joi schema to validate against
 * @returns {Function} - Express middleware function
 */
export const validateRequest = schema => {
  return (req, res, next) => {    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(errorMessages, 400));
    }
    next();
  };
};

/**
 * Middleware to validate request query parameters against a schema
 * @param {Object} schema - Joi schema to validate against
 * @returns {Function} - Express middleware function
 */
export const validateQuery = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(errorMessages, 400));
    }
    next();
  };
};

/**
 * Middleware to validate request parameters against a schema
 * @param {Object} schema - Joi schema to validate against
 * @returns {Function} - Express middleware function
 */
export const validateParams = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(errorMessages, 400));
    }
    next();
  };
};

/**
 * Validation schema for ID parameters
 */
export const idParamSchema = Joi.object({
  id: Joi.string().custom((value, helpers) => {
    if (!isValidObjectId(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'MongoDB ObjectId validation').required()
    .messages({
      'any.invalid': 'Invalid ID format',
      'string.empty': 'ID is required',
      'any.required': 'ID is required'
    })
});

/**
 * Common pagination query schema
 */
export const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least {#limit}'
    }),
  limit: Joi.number().integer().min(1).max(100).default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least {#limit}',
      'number.max': 'Limit cannot be greater than {#limit}'
    }),
  sort: Joi.string().default('-createdAt'),
  fields: Joi.string()
});
