# Fatesblind Landing Page

A modern, responsive landing page built with React and Vite, showcasing life in Washington Wine Country and mountain biking adventures.

## Features

- ⚛️ Built with React 18 and Vite for blazing-fast performance
- 🎨 Modern, responsive design
- 🏗️ Follows SOLID principles for maintainable code
- 🚀 Optimized for deployment on Google Cloud (Firebase Hosting)
- 📱 Mobile-first responsive design

## Project Structure

```
fatesblind/
├── src/
│   ├── components/         # React components (SOLID principles)
│   │   ├── Hero.jsx       # Hero section component
│   │   ├── Features.jsx   # Features container component
│   │   ├── FeatureCard.jsx # Individual feature card
│   │   ├── CallToAction.jsx # CTA section with external link
│   │   └── Footer.jsx     # Footer component
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── firebase.json          # Firebase hosting configuration
├── vite.config.js         # Vite configuration
└── package.json           # Project dependencies
```

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)
Each component has one clear responsibility:
- `Hero`: Display hero section
- `Features`: Manage and display feature cards
- `FeatureCard`: Display individual feature
- `CallToAction`: Display CTA section
- `Footer`: Display footer information

### Open/Closed Principle (OCP)
Components are open for extension but closed for modification:
- `Features` component can easily add new features through the data array
- Components accept props for customization

### Liskov Substitution Principle (LSP)
Components can be replaced with variants without breaking the application:
- `FeatureCard` can be swapped with alternative implementations

### Interface Segregation Principle (ISP)
Components only require the props they need:
- `FeatureCard` only needs `title`, `description`, and `icon`
- No fat interfaces with unused props

### Dependency Inversion Principle (DIP)
Components depend on abstractions (props) rather than concrete implementations:
- Components receive data through props rather than hardcoded values
- Easy to test and modify

## Local Development

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Build for Production

```bash
# Create optimized production build
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Deployment to Google Cloud (Firebase Hosting)

Firebase Hosting is the cheapest option for deploying static sites on Google Cloud, with a generous free tier that includes:
- 10 GB storage
- 360 MB/day upload limit
- Custom domain support
- Free SSL certificate
- Global CDN

### Prerequisites

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

### Initial Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name (e.g., "fatesblind-landing")
   - Follow the setup wizard
   - You can disable Google Analytics if you don't need it

2. **Initialize Firebase in Your Project**
   ```bash
   firebase init hosting
   ```

   When prompted:
   - Select "Use an existing project" and choose your project
   - Set public directory to: `dist`
   - Configure as single-page app: `Yes`
   - Set up automatic builds with GitHub: `No` (optional)
   - Don't overwrite index.html: `No`

3. **Update `.firebaserc`**
   ```bash
   # Replace "your-project-id" with your actual Firebase project ID
   ```

### Deploy

```bash
# Build and deploy in one command
npm run deploy

# Or manually:
npm run build
firebase deploy
```

After deployment, Firebase will provide you with:
- Hosting URL: `https://your-project-id.web.app`
- Console URL for management

### Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the instructions to verify domain ownership
4. Firebase will automatically provision an SSL certificate

### Cost Estimate

**Firebase Hosting Free Tier:**
- Storage: 10 GB (more than enough for this site)
- Data transfer: 360 MB/day (~10 GB/month)
- **Cost: $0/month** for typical small site traffic

If you exceed free tier:
- Storage: $0.026/GB/month
- Data transfer: $0.15/GB

**Expected cost for this landing page: $0-1/month** even with moderate traffic.

## Alternative Deployment Options

### Google Cloud Storage (Static Website)
Another cheap option:
```bash
# Enable Cloud Storage
gsutil mb gs://fatesblind.com

# Upload files
gsutil -m rsync -r dist/ gs://fatesblind.com

# Make bucket public
gsutil iam ch allUsers:objectViewer gs://fatesblind.com

# Configure as website
gsutil web set -m index.html gs://fatesblind.com
```

Cost: ~$0.026/GB/month storage + $0.12/GB egress

### Cloud Run (Overkill for static site)
Not recommended for static sites, but if needed:
- Cost: ~$0.40/month minimum
- Better suited for dynamic applications

## Performance Optimization

The site is optimized for performance with:
- Vite's fast build system
- Code splitting and lazy loading
- Minified assets
- Optimized images
- CDN delivery via Firebase
- Cache headers configured

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers

## License

© 2025 Fatesblind. All rights reserved.

## Contact

For questions or support, visit [Easy Eats Plan](https://easyeatsplan.com/)
