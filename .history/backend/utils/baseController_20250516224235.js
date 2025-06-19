/**
 * Base Controller class with common CRUD operations
 * Provides standard implementations for common operations that can be extended by specific controllers
 */

import mongoose from 'mongoose';
import AppError from './appError.js';
import catchAsync from './catchAsync.js';
import {
  successResponse,
  paginatedResponse,
  notFoundResponse
} from './responseFormatter.js';

class BaseController {
  constructor(Model, modelName) {
    this.Model = Model;
    this.modelName = modelName || this.getModelName();
  }

  // Extract model name from the Model
  getModelName() {
    return this.Model.modelName || 'Resource';
  }

  // Create a new document
  create = catchAsync(async (req, res) => {
    const doc = await this.Model.create(req.body);
    return res.status(201).json(
      successResponse(doc, `${this.modelName} created successfully`, 201)
    );
  });

  // Get all documents with pagination and filtering
  getAll = catchAsync(async (req, res) => {
    // Build query
    let query = { ...req.query };

    // Remove special fields from query
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete query[field]);

    // Advanced filtering
    let queryStr = JSON.stringify(query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    query = JSON.parse(queryStr);

    // Find documents
    let dbQuery = this.Model.find(query);

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      dbQuery = dbQuery.sort(sortBy);
    } else {
      dbQuery = dbQuery.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      dbQuery = dbQuery.select(fields);
    } else {
      dbQuery = dbQuery.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    dbQuery = dbQuery.skip(skip).limit(limit);

    // Execute query
    const [docs, totalItems] = await Promise.all([
      dbQuery.exec(),
      this.Model.countDocuments(query)
    ]);

    return res.status(200).json(
      paginatedResponse(
        docs,
        page,
        limit,
        totalItems,
        `${this.modelName} retrieved successfully`
      )
    );
  });

  // Get a single document by ID
  getOne = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Validate object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(`Invalid ${this.modelName} ID`, 400));
    }

    const doc = await this.Model.findById(id);

    if (!doc) {
      return next(new AppError(`${this.modelName} not found`, 404));
    }

    return res.status(200).json(
      successResponse(doc, `${this.modelName} retrieved successfully`)
    );
  });

  // Update a document by ID
  update = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Validate object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(`Invalid ${this.modelName} ID`, 400));
    }

    const doc = await this.Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError(`${this.modelName} not found`, 404));
    }

    return res.status(200).json(
      successResponse(doc, `${this.modelName} updated successfully`)
    );
  });

  // Delete a document by ID
  delete = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Validate object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError(`Invalid ${this.modelName} ID`, 400));
    }

    const doc = await this.Model.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError(`${this.modelName} not found`, 404));
    }

    return res.status(200).json(
      successResponse(null, `${this.modelName} deleted successfully`)
    );
  });
}

export default BaseController;
