#!/bin/bash
# Emergency restore script
# Use this if the spot instance is terminated and needs to be recreated

set -e

PROJECT_ID="web-page-d9ec622e"
ZONE="us-central1-a"
VM_NAME="nextjs-vm"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${RED}========================================${NC}"
echo -e "${RED}Emergency Restore Procedure${NC}"
echo -e "${RED}========================================${NC}"

# Check if VM exists
echo -e "\n${BLUE}Checking VM status...${NC}"
if gcloud compute instances describe ${VM_NAME} --zone=${ZONE} --project=${PROJECT_ID} &>/dev/null; then
    echo -e "${GREEN}VM exists. Proceeding with restore...${NC}"
else
    echo -e "${RED}VM does not exist!${NC}"
    echo -e "${BLUE}Run 'terraform apply' to recreate infrastructure first.${NC}"
    exit 1
fi

# Wait for VM to be ready
echo -e "\n${BLUE}Waiting for VM to be ready...${NC}"
sleep 30

# Run VM setup
echo -e "\n${BLUE}Step 1: Setting up VM environment...${NC}"
gcloud compute scp vm-setup.sh ${VM_NAME}:/tmp/ --zone=${ZONE} --project=${PROJECT_ID}
gcloud compute ssh ${VM_NAME} --zone=${ZONE} --project=${PROJECT_ID} \
    --command="bash /tmp/vm-setup.sh"

# Build and copy app
echo -e "\n${BLUE}Step 2: Building and copying application...${NC}"
cd ../nextjs-site
npm ci
npm run build
cd -

tar -czf /tmp/nextjs-app.tar.gz \
    --exclude='node_modules' \
    --exclude='.next/cache' \
    --exclude='.git' \
    -C ../nextjs-site .

gcloud compute scp /tmp/nextjs-app.tar.gz ${VM_NAME}:/tmp/ \
    --zone=${ZONE} --project=${PROJECT_ID}

# Deploy app
echo -e "\n${BLUE}Step 3: Deploying application...${NC}"
gcloud compute scp quick-deploy.sh ${VM_NAME}:/tmp/ --zone=${ZONE} --project=${PROJECT_ID}

gcloud compute ssh ${VM_NAME} --zone=${ZONE} --project=${PROJECT_ID} \
    --command="cd /var/www/app && tar -xzf /tmp/nextjs-app.tar.gz && bash /tmp/quick-deploy.sh"

# Verify
echo -e "\n${BLUE}Step 4: Verifying deployment...${NC}"
sleep 10

echo -e "\n${BLUE}Checking health status...${NC}"
gcloud compute backend-services get-health nextjs-backend --global --project=${PROJECT_ID}

echo -e "\n${BLUE}Testing site...${NC}"
curl -I https://fatesblind.com | head -10

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Emergency Restore Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Site: https://fatesblind.com${NC}"
echo -e "${BLUE}Monitor: gcloud compute ssh ${VM_NAME} --zone=${ZONE} --command='pm2 monit'${NC}"
