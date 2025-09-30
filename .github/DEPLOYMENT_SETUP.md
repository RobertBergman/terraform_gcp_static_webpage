# GitHub Actions Deployment Setup

This repository uses GitHub Actions to automatically deploy the Next.js application to Google App Engine when changes are pushed to the `main` branch.

## Prerequisites

You need to set up a GitHub Secret with Google Cloud credentials.

## Setup Instructions

### 1. Create a Service Account for GitHub Actions

Run these commands to create a service account with the necessary permissions:

```bash
# Set your project ID
PROJECT_ID="web-page-d9ec622e"

# Create service account
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer" \
  --project=$PROJECT_ID

# Grant necessary roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/appengine.appAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.builder"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create and download the key
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com \
  --project=$PROJECT_ID
```

### 2. Add the Service Account Key to GitHub Secrets

1. Copy the contents of the `github-actions-key.json` file:
   ```bash
   cat github-actions-key.json
   ```

2. Go to your GitHub repository
3. Navigate to **Settings** → **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `GCP_SA_KEY`
6. Value: Paste the entire contents of `github-actions-key.json`
7. Click **Add secret**

### 3. Clean Up the Key File

⚠️ **Important**: Delete the local key file after adding it to GitHub:
```bash
rm github-actions-key.json
```

## How It Works

The workflow (`.github/workflows/deploy.yml`) will:

1. **Trigger** on:
   - Push to `main` branch (only when files in `nextjs-site/` change)
   - Manual dispatch from GitHub Actions UI

2. **Build Steps**:
   - Checkout code
   - Install Node.js 20
   - Install npm dependencies
   - Build the Next.js application

3. **Deploy Steps**:
   - Authenticate with Google Cloud
   - Deploy to App Engine with timestamped version

## Manual Deployment

You can still manually deploy if needed:

```bash
cd nextjs-site
gcloud app deploy app.yaml --project=web-page-d9ec622e
```

## Troubleshooting

### Permission Denied Errors
- Verify the service account has all required roles
- Check that the `GCP_SA_KEY` secret is properly set in GitHub

### Build Failures
- Check the GitHub Actions logs in the **Actions** tab
- Ensure all environment variables are set in `app.yaml`

### Deployment Timeouts
- App Engine deployments can take 5-10 minutes
- Check Cloud Build logs in GCP Console

## Monitoring

- **GitHub Actions**: Check deployment status in the Actions tab
- **App Engine**: View logs at https://console.cloud.google.com/appengine
- **Live Site**: https://fatesblind.com