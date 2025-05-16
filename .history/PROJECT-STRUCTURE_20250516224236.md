## VoyageIQ Project Structure

### Backend Structure

```
backend/
├── config/               # Configuration files
│   └── index.js          # Central configuration
├── controllers/          # API controllers
│   ├── authController.js
│   ├── bookingController.js
│   ├── reviewController.js
│   ├── tourController.js
│   ├── tripController.js
│   └── userController.js
├── middleware/           # Express middleware
│   ├── authMiddleware.js
│   ├── cacheMiddleware.js
│   ├── errorHandler.js
│   ├── notFound.js
│   └── securityMiddleware.js
├── models/               # Mongoose models
│   ├── Booking.js
│   ├── Review.js
│   ├── Tour.js
│   ├── Trip.js
│   └── User.js
├── routes/               # API routes
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── reviewRoutes.js
│   ├── tourRoutes.js
│   ├── tripRoutes.js
│   └── userRoutes.js
├── utils/                # Helper utilities
│   ├── appError.js
│   ├── baseController.js
│   ├── catchAsync.js
│   ├── email.js
│   ├── logger.js
│   ├── responseFormatter.js
│   ├── serverConfig.js
│   ├── swagger.js
│   └── validators.js
├── app.js                # Express app setup
├── index.js              # Server entry point
├── seed.js               # Database seeder
├── migration.js          # Database migrations
├── Dockerfile            # Docker configuration
└── vercel.json           # Vercel deployment config
```

### Frontend Structure

```
frontend/
├── public/               # Static assets
│   ├── icon.png
│   ├── logo3.png
│   └── trip-placeholder.webp
├── src/
│   ├── assets/           # Images, fonts, etc.
│   │   ├── images/
│   │   └── data/
│   ├── components/       # Reusable components
│   │   ├── Admin/
│   │   ├── Booking/
│   │   ├── Footer/
│   │   ├── Header/
│   │   ├── Layout/
│   │   ├── Search/
│   │   ├── ui/
│   │   └── ...
│   ├── config/           # Frontend configuration
│   │   └── constants.js
│   ├── contexts/         # React contexts
│   │   └── AuthContext.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useApiCall.js
│   │   ├── useForm.js
│   │   ├── useFetch.jsx
│   │   └── useSearch.js
│   ├── pages/            # Page components
│   │   ├── Admin/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Tours.jsx
│   │   └── ...
│   ├── router/           # Routing
│   │   └── Router.jsx
│   ├── services/         # API services
│   │   ├── apiService.js
│   │   ├── authService.js
│   │   ├── tourService.js
│   │   ├── bookingService.js
│   │   └── index.js
│   ├── utils/            # Helper functions
│   │   ├── token.js
│   │   ├── formatters.js
│   │   └── validationSchema.js
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
├── .env.example          # Environment variables example
├── Dockerfile            # Docker configuration
├── nginx.conf            # Nginx configuration
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind CSS config
└── vite.config.js        # Vite build config
```

### Project Root

```
voyagiq/
├── .github/              # GitHub workflow configs
│   └── workflows/
│       └── ci-cd.yml
├── scripts/              # Utility scripts
│   ├── deploy.sh         # Deployment script (Unix)
│   └── deploy.ps1        # Deployment script (Windows)
├── backend/              # Backend application
├── frontend/             # Frontend application
├── docker-compose.yml    # Docker compose config
├── .env.example          # Environment variables example
└── README.md             # Project documentation
```
