import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VoyageIQ API',
      version: '1.0.0',
      description: 'API documentation for VoyageIQ',
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://voyageiq-backend.onrender.com/api/v1'
            : 'http://localhost:3050/api/v1',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = app => {
  app.use('/', swaggerUi.serve, swaggerUi.setup(specs));
};
