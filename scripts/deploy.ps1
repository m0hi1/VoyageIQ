$ErrorActionPreference = "Stop"

# Deploy script for VoyageIQ application (Windows PowerShell version)

# Function to log messages
function Log-Message {
    param([string]$message)
    Write-Host "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] $message"
}

# Function for error handling
function Handle-Error {
    param([string]$message)
    Log-Message "ERROR: $message"
    exit 1
}

# Update repository
Log-Message "Pulling latest changes from repository..."
try {
    git pull origin main
}
catch {
    Handle-Error "Failed to pull latest changes: $_"
}

# Install backend dependencies
Log-Message "Installing backend dependencies..."
try {
    Push-Location backend
    npm ci --only=production
    Pop-Location
}
catch {
    Pop-Location
    Handle-Error "Failed to install backend dependencies: $_"
}

# Install frontend dependencies and build
Log-Message "Installing frontend dependencies and building..."
try {
    Push-Location frontend
    npm ci
    npm run build
    Pop-Location
}
catch {
    Pop-Location
    Handle-Error "Failed to build frontend: $_"
}

# Optional: Restart backend service if using PM2 on Windows
Log-Message "Restarting backend service..."
try {
    if (Get-Command pm2 -ErrorAction SilentlyContinue) {
        pm2 restart voyageiq-backend
        if ($LASTEXITCODE -ne 0) {
            pm2 start backend/index.js --name voyageiq-backend
        }
    }
    else {
        Log-Message "PM2 not found. Please restart the backend service manually."
    }
}
catch {
    Log-Message "Warning: Failed to restart backend service: $_"
}

Log-Message "Deployment completed successfully!"
