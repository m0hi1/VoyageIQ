# Node.js Backend Dockerfile

# Use official Node.js image as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3050

# Expose port
EXPOSE 3050

# Start the application
CMD ["npm", "start"]
