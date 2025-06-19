# VoyageIQ API Documentation

## Overview

This document provides detailed information about the VoyageIQ API endpoints, authentication requirements, and data models.

## Base URL

```
http://localhost:3050/api/v1
```

## Authentication

Most API endpoints require authentication. The API uses JWT (JSON Web Token) for authentication.

### Authentication Headers

```
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### Register a new user

```
POST /auth/register
```

Request body:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```
POST /auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Forgot Password

```
POST /auth/forgot-password
```

Request body:

```json
{
  "email": "john@example.com"
}
```

Response:

```json
{
  "status": "success",
  "message": "Password reset email sent"
}
```

#### Reset Password

```
POST /auth/reset-password/:token
```

Request body:

```json
{
  "password": "NewPassword123!",
  "passwordConfirm": "NewPassword123!"
}
```

Response:

```json
{
  "status": "success",
  "message": "Password reset successful"
}
```

## User Endpoints

#### Get Current User

```
GET /users/me
```

Response:

```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "photo": "default.jpg",
      "createdAt": "2021-06-22T09:30:22.000Z"
    }
  }
}
```

#### Update User Profile

```
PATCH /users/update-me
```

Request body:

```json
{
  "username": "john_smith",
  "email": "john.smith@example.com"
}
```

Response:

```json
{
  "status": "success",
  "message": "User profile updated successfully",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "john_smith",
      "email": "john.smith@example.com",
      "role": "user",
      "photo": "default.jpg",
      "createdAt": "2021-06-22T09:30:22.000Z"
    }
  }
}
```

#### Update Password

```
PATCH /users/update-password
```

Request body:

```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!",
  "newPasswordConfirm": "NewPassword123!"
}
```

Response:

```json
{
  "status": "success",
  "message": "Password updated successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Admin User Endpoints

#### Get All Users (Admin Only)

```
GET /users
```

Response:

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "users": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "username": "john_smith",
        "email": "john.smith@example.com",
        "role": "user",
        "photo": "default.jpg",
        "createdAt": "2021-06-22T09:30:22.000Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "username": "admin",
        "email": "admin@voyageiq.com",
        "role": "admin",
        "photo": "admin.jpg",
        "createdAt": "2021-06-22T09:30:22.000Z"
      }
    ]
  }
}
```

#### Get User by ID (Admin Only)

```
GET /users/:id
```

Response:

```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "john_smith",
      "email": "john.smith@example.com",
      "role": "user",
      "photo": "default.jpg",
      "createdAt": "2021-06-22T09:30:22.000Z"
    }
  }
}
```

#### Update User (Admin Only)

```
PATCH /users/:id
```

Request body:

```json
{
  "username": "john_doe_updated",
  "role": "guide"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "username": "john_doe_updated",
      "email": "john.smith@example.com",
      "role": "guide",
      "photo": "default.jpg",
      "createdAt": "2021-06-22T09:30:22.000Z"
    }
  }
}
```

#### Delete User (Admin Only)

```
DELETE /users/:id
```

Response:

```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

## Tour Endpoints

#### Get All Tours

```
GET /tours
```

Query Parameters:

- `page`: Page number (default: 1)
- `limit`: Number of tours per page (default: 10)
- `sort`: Sort field (default: -createdAt)
- `fields`: Fields to include (comma-separated)
- `price[gte]`: Price greater than or equal to
- `price[lte]`: Price less than or equal to
- `city`: Filter by city
- `featured`: Filter by featured status (true/false)

Response:

```json
{
  "status": "success",
  "results": 8,
  "data": {
    "tours": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "title": "Parisian Dream Tour",
        "city": "Paris",
        "address": "Eiffel Tower, Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
        "distance": 15,
        "photo": "https://picsum.photos/seed/paris/800/600",
        "desc": "Experience the magic of Paris...",
        "price": 10120,
        "maxGroupSize": 10,
        "reviews": [],
        "featured": true,
        "rating": 4.5,
        "createdAt": "2021-06-22T09:30:22.000Z"
      }
      // More tour objects...
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalResults": 8,
    "limit": 10
  }
}
```

#### Get Tour by ID

```
GET /tours/:id
```

Response:

```json
{
  "status": "success",
  "data": {
    "tour": {
      "_id": "60d21b4667d0d8992e610c87",
      "title": "Parisian Dream Tour",
      "city": "Paris",
      "address": "Eiffel Tower, Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
      "distance": 15,
      "photo": "https://picsum.photos/seed/paris/800/600",
      "desc": "Experience the magic of Paris...",
      "price": 10120,
      "maxGroupSize": 10,
      "reviews": [],
      "featured": true,
      "rating": 4.5,
      "createdAt": "2021-06-22T09:30:22.000Z"
    }
  }
}
```

#### Search Tours

```
GET /tours/search
```

Query Parameters:

- `city`: Search by city
- `title`: Search by title
- `distance`: Filter by maximum distance
- `maxGroupSize`: Filter by maximum group size
- `price[gte]`: Price greater than or equal to
- `price[lte]`: Price less than or equal to

Response: Same as Get All Tours

#### Featured Tours

```
GET /tours/featured
```

Response:

```json
{
  "status": "success",
  "results": 5,
  "data": {
    "tours": [
      // Featured tour objects
    ]
  }
}
```

#### Tours Count by City

```
GET /tours/city-count
```

Response:

```json
{
  "status": "success",
  "data": {
    "counts": [
      {
        "city": "Paris",
        "count": 1
      },
      {
        "city": "Rome",
        "count": 1
      }
      // More city counts...
    ]
  }
}
```

### Admin Tour Endpoints

#### Create Tour (Admin Only)

```
POST /tours
```

Request body:

```json
{
  "title": "New Tour",
  "city": "Berlin",
  "address": "Brandenburg Gate, Pariser Platz, 10117 Berlin, Germany",
  "distance": 22,
  "photo": "https://example.com/tour-image.jpg",
  "desc": "Explore the history and culture of Berlin...",
  "price": 10200,
  "maxGroupSize": 10,
  "featured": true
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "tour": {
      "_id": "60d21b4667d0d8992e610c90",
      "title": "New Tour",
      "city": "Berlin",
      "address": "Brandenburg Gate, Pariser Platz, 10117 Berlin, Germany",
      "distance": 22,
      "photo": "https://example.com/tour-image.jpg",
      "desc": "Explore the history and culture of Berlin...",
      "price": 10200,
      "maxGroupSize": 10,
      "featured": true,
      "reviews": [],
      "rating": 0,
      "createdAt": "2021-06-22T09:30:22.000Z"
    }
  }
}
```

#### Update Tour (Admin Only)

```
PATCH /tours/:id
```

Request body:

```json
{
  "price": 10250,
  "featured": false
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "tour": {
      "_id": "60d21b4667d0d8992e610c90",
      "title": "New Tour",
      "city": "Berlin",
      "price": 10250,
      "featured": false
      // Other tour properties...
    }
  }
}
```

#### Delete Tour (Admin Only)

```
DELETE /tours/:id
```

Response:

```json
{
  "status": "success",
  "message": "Tour deleted successfully"
}
```

## Booking Endpoints

#### Create Booking

```
POST /bookings
```

Request body:

```json
{
  "tourId": "60d21b4667d0d8992e610c87",
  "guestSize": 2,
  "bookAt": "2023-12-15T10:00:00.000Z",
  "phone": "123-456-7890"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "booking": {
      "_id": "60d21b4667d0d8992e610c91",
      "tourId": "60d21b4667d0d8992e610c87",
      "userId": "60d21b4667d0d8992e610c85",
      "userEmail": "john.smith@example.com",
      "fullName": "John Smith",
      "guestSize": 2,
      "phone": "123-456-7890",
      "bookAt": "2023-12-15T10:00:00.000Z",
      "status": "pending",
      "createdAt": "2021-06-22T09:30:22.000Z"
    }
  }
}
```

#### Get User Bookings

```
GET /bookings/my-bookings
```

Response:

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "bookings": [
      {
        "_id": "60d21b4667d0d8992e610c91",
        "tourId": {
          "_id": "60d21b4667d0d8992e610c87",
          "title": "Parisian Dream Tour",
          "city": "Paris",
          "photo": "https://picsum.photos/seed/paris/800/600",
          "price": 10120
        },
        "guestSize": 2,
        "phone": "123-456-7890",
        "bookAt": "2023-12-15T10:00:00.000Z",
        "status": "pending",
        "createdAt": "2021-06-22T09:30:22.000Z"
      }
      // More booking objects...
    ]
  }
}
```

### Admin Booking Endpoints

#### Get All Bookings (Admin Only)

```
GET /bookings
```

Response:

```json
{
  "status": "success",
  "results": 5,
  "data": {
    "bookings": [
      // Booking objects with tour and user information
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalResults": 5,
    "limit": 10
  }
}
```

#### Update Booking Status (Admin Only)

```
PATCH /bookings/:id
```

Request body:

```json
{
  "status": "confirmed"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "booking": {
      // Updated booking object
    }
  }
}
```

#### Delete Booking (Admin Only)

```
DELETE /bookings/:id
```

Response:

```json
{
  "status": "success",
  "message": "Booking deleted successfully"
}
```

## Review Endpoints

#### Create Review

```
POST /reviews
```

Request body:

```json
{
  "tour": "60d21b4667d0d8992e610c87",
  "rating": 5,
  "text": "This was an amazing tour! Highly recommended."
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "review": {
      "_id": "60d21b4667d0d8992e610c92",
      "tour": "60d21b4667d0d8992e610c87",
      "user": "60d21b4667d0d8992e610c85",
      "rating": 5,
      "text": "This was an amazing tour! Highly recommended.",
      "createdAt": "2021-06-22T09:30:22.000Z"
    }
  }
}
```

#### Get Reviews by Tour ID

```
GET /reviews/:tourId
```

Response:

```json
{
  "status": "success",
  "results": 3,
  "data": {
    "reviews": [
      {
        "_id": "60d21b4667d0d8992e610c92",
        "tour": "60d21b4667d0d8992e610c87",
        "user": {
          "_id": "60d21b4667d0d8992e610c85",
          "username": "john_smith",
          "photo": "default.jpg"
        },
        "rating": 5,
        "text": "This was an amazing tour! Highly recommended.",
        "createdAt": "2021-06-22T09:30:22.000Z"
      }
      // More review objects...
    ]
  }
}
```

### Admin Review Endpoints

#### Get All Reviews (Admin Only)

```
GET /reviews
```

Response:

```json
{
  "status": "success",
  "results": 8,
  "data": {
    "reviews": [
      // Review objects with tour and user information
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalResults": 8,
    "limit": 10
  }
}
```

#### Delete Review (Admin Only)

```
DELETE /reviews/:id
```

Response:

```json
{
  "status": "success",
  "message": "Review deleted successfully"
}
```

## Error Responses

### Example error response:

```json
{
  "status": "error",
  "message": "Tour not found with the specified ID",
  "code": 404
}
```

## Rate Limiting

The API implements rate limiting to protect against abuse:

- Standard endpoints: 100 requests per IP per hour
- Authentication endpoints: 10 requests per IP per 15 minutes

When rate limit is exceeded:

```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again in an hour",
  "code": 429
}
```

## API Versioning

The current API version is v1, accessible at `/api/v1`.

## Data Models

### User

```javascript
{
  username: String,
  email: String,
  password: String,
  photo: String,
  role: String, // "user", "admin", "guide"
  createdAt: Date,
  updatedAt: Date
}
```

### Tour

```javascript
{
  title: String,
  city: String,
  address: String,
  distance: Number,
  photo: String,
  desc: String,
  price: Number,
  maxGroupSize: Number,
  reviews: [ObjectId],
  featured: Boolean,
  createdBy: ObjectId,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Review

```javascript
{
  tour: ObjectId,
  user: ObjectId,
  rating: Number,
  text: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking

```javascript
{
  tourId: ObjectId,
  userId: ObjectId,
  userEmail: String,
  fullName: String,
  guestSize: Number,
  phone: String,
  bookAt: Date,
  status: String, // "pending", "confirmed", "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```
