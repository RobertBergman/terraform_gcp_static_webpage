# Quick Deployment Guide

## Step-by-Step Deployment to Firebase Hosting (Cheapest Option)

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Firebase Tools
```bash
npm install -g firebase-tools
```

### 3. Login to Firebase
```bash
firebase login
```

### 4. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: `fatesblind-landing` (or your choice)
4. Disable Google Analytics (optional, saves setup time)
5. Click "Create project"

### 5. Initialize Firebase
```bash
firebase init hosting
```

Answer the prompts:
- **Use an existing project**: Select the project you just created
- **Public directory**: `dist`
- **Single-page app**: `Yes`
- **GitHub deploys**: `No` (unless you want CI/CD)
- **Overwrite index.html**: `No`

### 6. Update Project ID
Edit `.firebaserc` and replace `your-project-id` with your actual Firebase project ID:
```json
{
  "projects": {
    "default": "fatesblind-landing"
  }
}
```

### 7. Build and Deploy
```bash
# One command to build and deploy
npm run deploy

# Or do it manually:
npm run build
firebase deploy
```

### 8. Access Your Site
After deployment completes, you'll see:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/fatesblind-landing/overview
Hosting URL: https://fatesblind-landing.web.app
```

Visit the Hosting URL to see your live site!

## Cost Breakdown

### Firebase Hosting (Recommended - FREE tier)
- **Storage**: 10 GB (plenty for this small site)
- **Transfer**: 360 MB/day (~10.8 GB/month)
- **SSL**: Included free
- **CDN**: Included free
- **Custom domain**: Free
- **Expected cost**: **$0/month**

Even if you exceed the free tier:
- Extra storage: $0.026/GB/month
- Extra bandwidth: $0.15/GB
- **Realistic cost with traffic**: $0-2/month

### Comparison with Other Google Cloud Options

| Service | Monthly Cost | Best For |
|---------|-------------|----------|
| Firebase Hosting | **$0-1** | Static sites (RECOMMENDED) |
| Cloud Storage | $0.50-2 | Static sites with custom setup |
| Cloud Run | $5-10 | Dynamic applications |
| App Engine | $10-20 | Enterprise applications |
| Compute Engine | $20+ | Full VMs (overkill) |

## Custom Domain Setup (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Enter your domain (e.g., `fatesblind.com`)
4. Verify ownership (add TXT record to DNS)
5. Update A/CNAME records as instructed
6. Firebase auto-provisions free SSL certificate
7. Wait for DNS propagation (up to 24 hours)

## Continuous Deployment (Optional)

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: fatesblind-landing
```

## Monitoring

### Firebase Console
- View analytics: https://console.firebase.google.com/
- Check hosting metrics: Storage, bandwidth, requests
- View deployment history
- Monitor errors

### Google Cloud Console
- More detailed billing: https://console.cloud.google.com/billing
- Usage reports and forecasts
- Set up billing alerts

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Deploy Fails
```bash
# Check Firebase login
firebase logout
firebase login

# Verify project
firebase projects:list
```

### Site Not Updating
```bash
# Clear Firebase cache
firebase deploy --only hosting --force
```

## Updating the Site

```bash
# 1. Make your changes to the code
# 2. Build and deploy
npm run deploy

# That's it! Changes are live in ~30 seconds
```

## Rollback

```bash
# View deployment history
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION DESTINATION_SITE_ID
```

## Support

- Firebase Documentation: https://firebase.google.com/docs/hosting
- Pricing Calculator: https://firebase.google.com/pricing
- Community Support: https://stackoverflow.com/questions/tagged/firebase-hosting
