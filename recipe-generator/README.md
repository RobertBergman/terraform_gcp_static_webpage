# Recipe Generator - AI-Powered Meal Planning

A modern full-stack application that generates personalized meal plans based on your dietary preferences and local store sales using AI. Like HelloFresh, but you shop for the ingredients yourself!

## Features

- 🍳 **AI-Powered Meal Planning**: Uses OpenRouter API to generate custom meal plans
- 🥗 **Multiple Diet Types**: Supports carnivore, Mediterranean, keto, paleo, vegan, vegetarian, and more
- 🏪 **Store Integration**: Plans meals based on sales at Yokes, Safeway, Walmart, Target, and Costco
- 📋 **Smart Shopping Lists**: Auto-generated shopping lists grouped by category
- 🎨 **Beautiful Recipe Cards**: View detailed recipes with ingredients, instructions, and nutrition info
- 💾 **Local Storage**: All settings and API keys stored securely in your browser
- 🌙 **Dark Mode**: Automatic dark mode support

## Getting Started

### Prerequisites

- Node.js 20 or higher
- An OpenRouter API key ([get one here](https://openrouter.ai/keys)) - optional if deploying with server-side key

### Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Configure server-side API key:
```bash
cp .env.example .env.local
# Edit .env.local and add your OpenRouter API key
```

If you configure a server-side API key in `.env.local`, users can use the app without providing their own key. The API key will be kept secure on the server and never exposed to clients.

3. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:8060](http://localhost:8060) in your browser

### First Time Setup

When you first visit the app, you'll see a welcome screen. Here's how to get started:

1. **Click the "Settings" button** in the top-right corner of the navigation bar (gear icon)
2. **Enter your OpenRouter API key** in the settings modal
   - Get your API key at [https://openrouter.ai/keys](https://openrouter.ai/keys)
   - Your key is stored **only in your browser's localStorage** - it never leaves your machine except when making API calls
   - Each user brings their own API key, keeping costs and data private
3. **Configure your preferences**:
   - Select your diet type (Mediterranean, Keto, Vegan, etc.)
   - Set your serving size
   - Add any dietary restrictions (optional)
   - Enter your location (optional)
4. **Click "Save Settings"**

> **Privacy Note**: Your API key and all data are stored locally in your browser. The app never saves your key to any backend database. This makes the app secure for multiple users - each person uses their own API key and keeps their data private.

### Using the App

1. Click "Generate Meal Plan" to create 7 meals based on your preferences
2. Click on any recipe card to view full details
3. Click "Shopping List" to see all ingredients organized by category
4. Check off items as you shop
5. Print or copy the shopping list to your clipboard

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: OpenRouter API (Claude 3.5 Sonnet)
- **Icons**: Lucide React
- **Storage**: Browser localStorage

## Supported Diet Types

- Balanced
- Carnivore
- Mediterranean
- Keto
- Paleo
- Vegan
- Vegetarian
- Pescatarian
- Whole30
- Gluten-Free
- Low-Carb

## Supported Stores

- Yokes
- Safeway
- Walmart
- Target
- Costco

## Security & Multi-User Architecture

This app is designed to be secure for multiple users without requiring user accounts or databases:

### How It Works

1. **Client-Side Storage**: Each user's API key, preferences, recipes, and meal plans are stored in their browser's localStorage
2. **No Backend Database**: The app has no database - all data stays on the user's machine
3. **Stateless API**: The backend only proxies API calls to OpenRouter and doesn't store any user data
4. **Bring Your Own Key (BYOK)**: Each user provides their own OpenRouter API key
5. **Cost Isolation**: Each user pays for their own API usage through their OpenRouter account
6. **Data Privacy**: User data never leaves their browser except for temporary API calls

### Where Your Data Lives

- **API Key**: Stored in browser localStorage (never sent to backend except per-request)
- **Preferences**: Stored in browser localStorage
- **Recipes**: Stored in browser localStorage
- **Meal Calendar**: Stored in browser localStorage
- **Shopping Lists**: Generated on-the-fly from calendar data

### Benefits

- ✅ No user accounts or authentication needed
- ✅ No database costs or management
- ✅ Complete data privacy (data never leaves user's machine)
- ✅ Each user pays for their own AI usage
- ✅ Can be deployed as a static site
- ✅ Works offline (after initial load)

### For Deployment

This app can be:
- Deployed to any static hosting (Vercel, Netlify, etc.)
- Used by unlimited users simultaneously
- Each user's data remains isolated to their browser
- No server-side storage or databases required

## Future Enhancements

- Real-time store sales data integration
- User accounts with cloud storage
- Meal plan history and favorites
- Recipe ratings and reviews
- Nutritional goal tracking
- Meal prep instructions
- Multi-week meal planning
- Recipe customization and substitutions
