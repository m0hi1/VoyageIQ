# VoyageIQ - Travel Booking Platform

VoyageIQ is a full-stack MERN (MongoDB, Express, React, Node.js) application for booking travel experiences and tours. This platform allows users to browse tours, make bookings, leave reviews, and utilizes AI to help users plan custom trips.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

- **User Authentication & Authorization**: Secure login, registration, and profile management
- **Tour Management**: Browse, search, and filter tours by various criteria
- **Booking System**: Book tours and manage reservations
- **Reviews & Ratings**: Leave reviews and ratings for tours
- **Admin Panel**: Comprehensive dashboard for administrators
- **AI Trip Planning**: Use AI to create custom travel itineraries
- **Responsive Design**: Mobile-friendly interface using React and Tailwind CSS

## Technology Stack

### Backend

- **Node.js & Express**: Server and API framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication
- **Joi**: Input validation
- **Winston**: Logging
- **Swagger**: API documentation
- **Firebase**: Storage and authentication integration

### Frontend

- **React**: UI library
- **Vite**: Build tool
- **React Router**: Navigation
- **Tailwind CSS**: Styling
- **React Context API**: State management
- **Axios**: API requests
- **React-Toastify**: Notifications
- **Framer Motion**: Animations

## Project Structure

```
voyagiq/
├── backend/                # Backend application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   ├── app.js              # Express app setup
│   └── index.js            # Server entry point
│
├── frontend/               # Frontend application
│   ├── public/             # Static assets
│   └── src/
│       ├── assets/         # Images, fonts, etc.
│       ├── components/     # Reusable components
│       ├── config/         # Frontend configuration
│       ├── contexts/       # React contexts
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       ├── services/       # API service modules
│       └── utils/          # Helper functions
```

## Setup & Installation

### Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/voyagiq.git
   cd voyagiq
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend folders
   - Fill in the required environment variables (see Environment Variables section)

## Environment Variables

### Backend

- `PORT`: Server port (default: 3050)
- `NODE_ENV`: Environment (development, production, test)
- `MONGO_URL`: MongoDB connection string
- `JWT_SECRET`: Secret for signing JWT tokens
- `CLIENT_URL`: Frontend URL for CORS

### Frontend

- `VITE_API_URL`: Backend API URL
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `VITE_FIREBASE_*`: Firebase configuration

## Running the Application

### Development Mode

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3050

### Production Mode

1. Build the frontend:

   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend server in production mode:
   ```bash
   cd backend
   npm start
   ```

## API Documentation

API documentation is available through Swagger UI at `/api-docs` endpoint when running the backend server.

## Deployment

The application is configured for deployment on Vercel:

- Frontend: Deploy the `/frontend` directory
- Backend: Deploy the `/backend` directory with the Node.js server template

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
