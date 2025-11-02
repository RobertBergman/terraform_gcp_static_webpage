#!/bin/bash
# Quick deployment script - Run this ON THE VM after initial setup
# Assumes VM environment is already configured (vm-setup.sh has been run)

set -e

APP_DIR="/var/www/app"

echo "=========================================="
echo "Quick Deploy Script"
echo "=========================================="

# Check if app files exist
if [ ! -f "${APP_DIR}/package.json" ]; then
    echo "ERROR: No package.json found in ${APP_DIR}"
    echo "Please copy your app files to ${APP_DIR} first"
    echo "From local machine: gcloud compute scp /tmp/nextjs-app.tar.gz nextjs-vm:/tmp/"
    echo "Then: cd ${APP_DIR} && tar -xzf /tmp/nextjs-app.tar.gz"
    exit 1
fi

cd ${APP_DIR}

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build Next.js
echo "Building Next.js app..."
npm run build

# Stop existing PM2 process
echo "Stopping existing app..."
pm2 delete nextjs-app 2>/dev/null || true

# Start app
echo "Starting app with PM2..."
pm2 start "npx next start -p 3000" --name nextjs-app

# Save PM2 config
pm2 save

# Show status
echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
pm2 status
echo ""
echo "Check logs: pm2 logs nextjs-app"
echo "Test locally: curl http://localhost:3000"
echo "Test externally: curl https://fatesblind.com"
