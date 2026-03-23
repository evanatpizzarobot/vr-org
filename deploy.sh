#!/bin/bash
# VR.org deployment script for Ubuntu 24.04 VPS
# Usage: ./deploy.sh

set -e

echo "=== VR.org Deployment ==="

# Pull latest code
echo "Pulling latest code..."
git pull origin master

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build
echo "Building Next.js app..."
npm run build

# Restart with PM2 (if using PM2)
if command -v pm2 &> /dev/null; then
    echo "Restarting with PM2..."
    pm2 restart vr-org 2>/dev/null || pm2 start npm --name "vr-org" -- start
    pm2 save
    echo "Running with PM2"
else
    echo ""
    echo "PM2 not found. To install:"
    echo "  npm install -g pm2"
    echo "  pm2 start npm --name 'vr-org' -- start"
    echo "  pm2 startup  # auto-start on reboot"
    echo "  pm2 save"
    echo ""
    echo "Or start manually:"
    echo "  npm start"
fi

echo ""
echo "=== Deploy complete ==="
echo "App running on port ${PORT:-3000}"
