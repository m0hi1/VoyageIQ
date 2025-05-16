# Node.js Frontend Dockerfile

# Build stage
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
