#!/bin/bash
# Check current infrastructure status
# Shows which backend is serving traffic and health of all components

set -e

PROJECT_ID="web-page-d9ec622e"
ZONE="us-central1-a"
VM_NAME="nextjs-vm"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Infrastructure Status Check${NC}"
echo -e "${BLUE}========================================${NC}"

# Check which backend is active
echo -e "\n${BLUE}Active Backend:${NC}"
ACTIVE_BACKEND=$(gcloud compute url-maps describe website-url-map \
  --global \
  --format="get(defaultService)" \
  --project=${PROJECT_ID} 2>/dev/null || echo "ERROR")

if [[ $ACTIVE_BACKEND == *"nextjs-backend"* ]]; then
  echo -e "${GREEN}✅ Compute Engine (Primary)${NC}"
  echo "   Backend: nextjs-backend"
elif [[ $ACTIVE_BACKEND == *"app-engine"* ]] || [[ $ACTIVE_BACKEND == *"appengine"* ]]; then
  echo -e "${YELLOW}⚠️  App Engine (Fallback)${NC}"
  echo "   Backend: $ACTIVE_BACKEND"
else
  echo -e "${RED}❌ Unknown or Error${NC}"
  echo "   Backend: $ACTIVE_BACKEND"
fi

# Check Compute Engine VM
echo -e "\n${BLUE}Compute Engine VM:${NC}"
VM_STATUS=$(gcloud compute instances describe ${VM_NAME} \
  --zone=${ZONE} \
  --format="get(status)" \
  --project=${PROJECT_ID} 2>/dev/null || echo "NOT_FOUND")

if [ "$VM_STATUS" == "RUNNING" ]; then
  echo -e "${GREEN}✅ Running${NC}"

  # Check PM2 app status
  echo -e "\n${BLUE}Application Status:${NC}"
  PM2_STATUS=$(gcloud compute ssh ${VM_NAME} \
    --zone=${ZONE} \
    --project=${PROJECT_ID} \
    --command="pm2 jlist" 2>/dev/null || echo "ERROR")

  if [[ $PM2_STATUS == *"online"* ]]; then
    echo -e "${GREEN}✅ Application running (PM2)${NC}"
  else
    echo -e "${RED}❌ Application not running${NC}"
  fi
else
  echo -e "${RED}❌ VM not running (Status: $VM_STATUS)${NC}"
fi

# Check backend health
echo -e "\n${BLUE}Load Balancer Health:${NC}"
HEALTH=$(gcloud compute backend-services get-health nextjs-backend \
  --global \
  --project=${PROJECT_ID} 2>/dev/null || echo "ERROR")

if [[ $HEALTH == *"HEALTHY"* ]]; then
  echo -e "${GREEN}✅ Healthy${NC}"
elif [[ $HEALTH == *"UNHEALTHY"* ]]; then
  echo -e "${RED}❌ Unhealthy${NC}"
else
  echo -e "${YELLOW}⚠️  Unknown${NC}"
fi

# Check App Engine (fallback)
echo -e "\n${BLUE}App Engine (Fallback):${NC}"
APP_ENGINE_VERSION=$(gcloud app versions list \
  --service=default \
  --format="get(version.id)" \
  --project=${PROJECT_ID} 2>/dev/null | head -1)

if [ -n "$APP_ENGINE_VERSION" ]; then
  echo -e "${GREEN}✅ Available (version: $APP_ENGINE_VERSION)${NC}"

  # Test App Engine URL
  APP_ENGINE_TEST=$(curl -s -o /dev/null -w "%{http_code}" https://web-page-d9ec622e.uc.r.appspot.com 2>/dev/null || echo "000")
  if [ "$APP_ENGINE_TEST" == "200" ]; then
    echo -e "${GREEN}✅ Responding to requests${NC}"
  else
    echo -e "${YELLOW}⚠️  Not responding (HTTP $APP_ENGINE_TEST)${NC}"
  fi
else
  echo -e "${RED}❌ Not found${NC}"
fi

# Check production site
echo -e "\n${BLUE}Production Site:${NC}"
PROD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://fatesblind.com 2>/dev/null || echo "000")
if [ "$PROD_STATUS" == "200" ]; then
  echo -e "${GREEN}✅ https://fatesblind.com (HTTP 200)${NC}"
else
  echo -e "${RED}❌ https://fatesblind.com (HTTP $PROD_STATUS)${NC}"
fi

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}Quick Actions:${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Deploy app:        ${GREEN}cd scripts && ./deploy-to-vm.sh${NC}"
echo -e "Emergency restore: ${YELLOW}cd scripts && ./emergency-restore.sh${NC}"
echo -e "Failover to App:   ${RED}See FAILOVER.md${NC}"
echo -e "View logs:         ${GREEN}gcloud compute ssh ${VM_NAME} --zone=${ZONE} --command='pm2 logs'${NC}"
