#!/bin/bash

echo "========================================"
echo "Checking for Google Cloud Organization"
echo "========================================"
echo ""

# Check for organizations
echo "Checking for organizations..."
ORG_COUNT=$(gcloud organizations list --format="value(name)" 2>/dev/null | wc -l)

if [ "$ORG_COUNT" -eq "0" ]; then
    echo "❌ No organization found yet."
    echo ""
    echo "Please complete Cloud Identity setup at:"
    echo "https://workspace.google.com/gcpidentity/signup"
    echo ""
    echo "After setup, you may need to:"
    echo "1. Wait 5-10 minutes for propagation"
    echo "2. Re-authenticate: gcloud auth login admin@fatesblind.com"
    echo "3. Run this script again"
else
    echo "✅ Organization found!"
    echo ""
    gcloud organizations list
    echo ""
    ORG_ID=$(gcloud organizations list --format="value(name)" | head -1)
    echo "Your Organization ID is: $ORG_ID"
    echo ""
    echo "Next steps:"
    echo "1. Update terraform.tfvars with:"
    echo "   organization_id = \"$ORG_ID\""
    echo ""
    echo "2. Move your project to the organization:"
    echo "   gcloud projects move web-page-8ce1f44f --organization=$ORG_ID"
    echo ""
    echo "3. Run Terraform to deploy OAuth2:"
    echo "   terraform plan"
    echo "   terraform apply"
fi

echo ""
echo "========================================"