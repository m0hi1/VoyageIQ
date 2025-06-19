# VoyageIQ Developer Onboarding Guide

## Introduction

Welcome to the VoyageIQ development team! This guide will help you set up your development environment, understand the project structure, and follow the established coding patterns and practices.

## Project Overview

VoyageIQ is a MERN stack application for a travel booking platform that allows users to:

- Browse and search for tours
- Book tours
- Leave reviews
- Manage their bookings and profile

The application consists of:

1. **Backend**: Node.js + Express.js API with MongoDB
2. **Frontend**: React application with modern UI components

## Getting Started

### Prerequisites

- Node.js (v16.x or later)
- npm (v8.x or later)
- MongoDB (v5.x or later)
- Git

### Clone the Repository

```bash
git clone https://github.com/your-org/voyageiq.git
cd voyageiq
```

### Setup Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your local configuration:

```
# Server Configuration
PORT=3050
NODE_ENV=development

# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/voyageiq

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Email Configuration (for password reset, etc.)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@voyageiq.com

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Install Dependencies

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### Initialize the Database

1. Seed the database with initial data:

```bash
# From the backend directory
node seed.js --clear --with-users --with-reviews --with-bookings
```

This will create:

- Admin user (email: admin@voyageiq.com, password: Admin123!)
- Regular users (email: user1@example.com, password: User1123!, etc.)
- Tours, reviews, and bookings

2. Optimize database with indexes:

```bash
node optimize-db.js
```

### Start Development Servers

1. Start the backend server:

```bash
# From the backend directory
npm run dev
```

This will start the server with nodemon for automatic reloading.

2. Start the frontend development server:

```bash
# From the frontend directory
npm run dev
```

The application should now be running at:

- Backend API: http://localhost:3050/api/v1
- Frontend: http://localhost:5173

## Project Structure

### Backend Structure

```
backend/
├── config/               # Configuration files
│   └── index.js          # Central configuration
├── controllers/          # API controllers
├── middleware/           # Express middleware
├── models/               # Mongoose models
├── routes/               # API routes
├── utils/                # Helper utilities
├── app.js                # Express app setup
├── index.js              # Server entry point
├── seed.js               # Database seeder
└── optimize-db.js        # Database optimization
```

### Frontend Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable components
│   ├── config/           # Frontend configuration
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── router/           # Routing
│   ├── services/         # API services
│   ├── utils/            # Helper functions
│   ├── lib/              # External libraries/utilities
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
├── index.html            # HTML template
└── vite.config.js        # Vite configuration
```

## Development Workflow

### Git Workflow

We follow a feature branch workflow:

1. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, commit frequently with clear messages:

   ```bash
   git commit -m "feat: add user profile image upload"
   ```

3. Push your branch and create a pull request:
   ```bash
   git push -u origin feature/your-feature-name
   ```

### Commit Message Format

We follow the Conventional Commits specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### Pull Request Process

1. Update the README.md or documentation if necessary
2. Make sure all tests pass
3. Get at least one code review approval
4. Merge only after CI/CD pipeline succeeds

## Coding Standards

### Backend

- Use ES modules (import/export) syntax
- Utilize the error handling middleware for consistent error responses
- Follow RESTful API principles
- Document all API endpoints
- Use the baseController for standard CRUD operations
- Validate all request data using Joi validators

### Frontend

- Use functional components with hooks
- Keep components small and focused
- Use the custom hooks (useApiCall, useForm, etc.) for common patterns
- Follow the container/presentational component pattern when appropriate
- Use React Context for global state management
- Use lazy loading for route components to improve initial load time

## Authentication and Authorization

VoyageIQ uses JWT (JSON Web Token) for authentication:

1. **Authentication Flow**:

   - User logs in with email/password or OAuth
   - Backend validates credentials and returns a JWT
   - Frontend stores the JWT in localStorage
   - JWT is included in the Authorization header of subsequent requests

2. **Authorization**:
   - Protected routes use auth middleware on the backend to validate JWT
   - User roles (user, admin, guide) determine access to specific endpoints
   - Frontend uses route protection components (ProtectedRoute, AdminRoute)

## Error Handling

### Backend Error Handling

We use a custom AppError class and centralized error handling middleware:

```javascript
// Example of using catchAsync utility
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});
```

### Frontend Error Handling

We use:

- Global error boundary for React component errors
- try/catch blocks in API calls
- Toast notifications for user-friendly error messages

## Testing

### Running Tests

Backend tests:

```bash
cd backend
npm test
```

Frontend tests:

```bash
cd frontend
npm test
```

### Writing Tests

- Backend: Jest + Supertest for API endpoints
- Frontend: Vitest + React Testing Library

## Deployment

We use Docker for containerization and deployment:

1. Build Docker images:

```bash
docker-compose build
```

2. Run the application:

```bash
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:

   - Check your MongoDB connection string
   - Ensure MongoDB service is running

2. **Authentication Problems**:

   - Check JWT secret in environment variables
   - Verify token expiration configuration

3. **Frontend API Calls Failing**:
   - Check that CORS is properly configured
   - Verify API base URL in frontend configuration

### Debugging Tools

- Backend: Use the logger utility for consistent logging
- Frontend: Use the browser developer tools and React DevTools

## Additional Resources

- [API Documentation](./API-DOCUMENTATION.md)
- [Project Structure Details](./PROJECT-STRUCTURE.md)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)

## Getting Help

If you need assistance, please reach out to:

- Project Lead: [project-lead@example.com](mailto:project-lead@example.com)
- Backend Team: [backend-team@example.com](mailto:backend-team@example.com)
- Frontend Team: [frontend-team@example.com](mailto:frontend-team@example.com)

Welcome aboard, and happy coding!
