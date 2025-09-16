#!/bin/bash

echo "========================================"
echo "Getting Organization ID"
echo "========================================"
echo ""

# Check current active account
CURRENT_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
echo "Current active account: $CURRENT_ACCOUNT"
echo ""

# Check if we need to switch accounts
if [[ "$CURRENT_ACCOUNT" != *"fatesblind.com" ]]; then
    echo "You need to authenticate with your Cloud Identity account."
    echo ""
    echo "Run this command:"
    echo "  gcloud auth login rbergman@fatesblind.com"
    echo ""
    echo "After authentication, run this script again."
    exit 1
fi

# Get organization ID
echo "Checking for organizations..."
ORG_COUNT=$(gcloud organizations list --format="value(name)" 2>/dev/null | wc -l)

if [ "$ORG_COUNT" -eq "0" ]; then
    echo "❌ No organization found for account: $CURRENT_ACCOUNT"
    echo ""
    echo "Make sure you're logged in with rbergman@fatesblind.com"
else
    echo "✅ Organization found!"
    echo ""
    gcloud organizations list
    echo ""
    ORG_ID=$(gcloud organizations list --format="value(name)" | head -1)
    echo "========================================"
    echo "Your Organization ID is: $ORG_ID"
    echo "========================================"
    echo ""
    echo "Copy this ID and provide it to continue setup!"
fi