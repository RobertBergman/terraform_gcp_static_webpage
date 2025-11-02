#!/bin/bash
# Complete deployment script for Next.js app on GCE VM
# Run this from your LOCAL machine to deploy to the VM

set -e

# Configuration
PROJECT_ID="web-page-d9ec622e"
ZONE="us-central1-a"
VM_NAME="nextjs-vm"
APP_DIR="/var/www/app"
LOCAL_APP_DIR="../nextjs-site"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Starting deployment to GCE VM${NC}"
echo -e "${BLUE}========================================${NC}"

# Step 1: Build app locally
echo -e "\n${BLUE}Step 1: Building Next.js app locally...${NC}"
cd ${LOCAL_APP_DIR}
npm ci
npm run build
cd -

# Step 2: Create deployment package
echo -e "\n${BLUE}Step 2: Creating deployment package...${NC}"
tar -czf /tmp/nextjs-app.tar.gz \
    --exclude='node_modules' \
    --exclude='.next/cache' \
    --exclude='.git' \
    --exclude='.terraform' \
    --exclude='terraform.tfstate*' \
    -C ${LOCAL_APP_DIR} .

echo -e "${GREEN}Package created: $(du -h /tmp/nextjs-app.tar.gz | cut -f1)${NC}"

# Step 3: Copy to VM
echo -e "\n${BLUE}Step 3: Copying files to VM...${NC}"
gcloud compute scp /tmp/nextjs-app.tar.gz ${VM_NAME}:/tmp/nextjs-app.tar.gz \
    --zone=${ZONE} \
    --project=${PROJECT_ID}

# Step 4: Deploy on VM
echo -e "\n${BLUE}Step 4: Deploying on VM...${NC}"
gcloud compute ssh ${VM_NAME} \
    --zone=${ZONE} \
    --project=${PROJECT_ID} \
    --command="bash -s" << 'ENDSSH'
set -e

APP_DIR="/var/www/app"

echo "Extracting files..."
cd ${APP_DIR}
tar -xzf /tmp/nextjs-app.tar.gz
rm /tmp/nextjs-app.tar.gz

echo "Installing dependencies..."
npm ci --production=false

echo "Generating Prisma client..."
npx prisma generate

echo "Building Next.js app..."
npm run build

echo "Restarting application..."
pm2 delete nextjs-app 2>/dev/null || true
pm2 start "npx next start -p 3000" --name nextjs-app
pm2 save

echo "Deployment complete!"
pm2 status
ENDSSH

# Step 5: Verify deployment
echo -e "\n${BLUE}Step 5: Verifying deployment...${NC}"
sleep 5

VM_IP=$(gcloud compute instances describe ${VM_NAME} \
    --zone=${ZONE} \
    --project=${PROJECT_ID} \
    --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo -e "\n${GREEN}Testing VM directly...${NC}"
curl -I http://${VM_IP} | head -5

echo -e "\n${GREEN}Testing via load balancer...${NC}"
curl -I https://fatesblind.com | head -5

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment successful!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Site: https://fatesblind.com${NC}"
echo -e "${BLUE}SSH: gcloud compute ssh ${VM_NAME} --zone=${ZONE}${NC}"
echo -e "${BLUE}Logs: gcloud compute ssh ${VM_NAME} --zone=${ZONE} --command='pm2 logs'${NC}"
