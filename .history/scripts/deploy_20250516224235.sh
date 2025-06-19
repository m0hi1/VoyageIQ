#!/bin/bash

# Deploy script for VoyageIQ application
# This script can be run on your production server

# Load environment variables
if [ -f .env ]; then
  source .env
else
  echo "Error: .env file not found"
  exit 1
fi

# Function to log messages
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function for error handling
handle_error() {
  log "ERROR: $1"
  exit 1
}

# Update repository
log "Pulling latest changes from repository..."
git pull origin main || handle_error "Failed to pull latest changes"

# Install backend dependencies
log "Installing backend dependencies..."
cd backend
npm ci --only=production || handle_error "Failed to install backend dependencies"
cd ..

# Install frontend dependencies and build
log "Installing frontend dependencies and building..."
cd frontend
npm ci || handle_error "Failed to install frontend dependencies"
npm run build || handle_error "Failed to build frontend"
cd ..

# Restart backend service
log "Restarting backend service..."
pm2 restart voyageiq-backend || pm2 start backend/index.js --name voyageiq-backend

# Deploy frontend (example for nginx)
log "Deploying frontend..."
if [ -d "/var/www/html/voyageiq" ]; then
  rm -rf /var/www/html/voyageiq/* || handle_error "Failed to clean frontend deployment directory"
  cp -r frontend/dist/* /var/www/html/voyageiq/ || handle_error "Failed to copy frontend files"
else
  mkdir -p /var/www/html/voyageiq
  cp -r frontend/dist/* /var/www/html/voyageiq/ || handle_error "Failed to copy frontend files"
fi

# Verify deployment
log "Verifying deployment..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3050/health | grep 200 > /dev/null
if [ $? -eq 0 ]; then
  log "Backend is running successfully"
else
  log "Warning: Backend health check failed"
fi

log "Deployment completed successfully"
