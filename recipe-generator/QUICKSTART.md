# Quick Start Guide

## Setup (5 minutes)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Get an OpenRouter API key**
   - Visit https://openrouter.ai/keys
   - Sign up for free (they offer free credits)
   - Create a new API key

3. **Start the app**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

4. **Configure settings**
   - Click "Configure Settings"
   - Paste your OpenRouter API key
   - Select diet type (e.g., Mediterranean, Keto, Vegan)
   - Enter your location (e.g., "Spokane, WA")
   - Choose serving size (number of people)
   - Select preferred stores
   - Click "Save Settings"

5. **Generate your first meal plan**
   - Click "Generate Meal Plan"
   - Wait 10-30 seconds for AI to create your meals
   - Browse the recipe cards
   - Click any card to see full details

6. **Create shopping list**
   - Click "Shopping List" button
   - View ingredients organized by category
   - Check off items as you shop
   - Print or copy to clipboard

## Tips

- **Dietary Restrictions**: Add allergies or restrictions in settings (e.g., "nuts, shellfish, dairy")
- **Budget**: Currently informational - future version will enforce budget limits
- **Regenerate**: Don't like the suggestions? Click "Regenerate" for new ideas
- **Multiple Plans**: Generate different plans by changing diet type in settings

## Troubleshooting

**"OpenRouter API error"**
- Check that your API key is correct
- Ensure you have credits remaining at openrouter.ai

**Meal plan takes too long**
- First generation can take 20-30 seconds
- Check your internet connection
- Try regenerating if it times out

**No recipes showing**
- Open browser console (F12) to check for errors
- Verify your settings are saved
- Try refreshing the page

## What's Next?

The app generates meal plans based on your preferences. In future versions, we'll integrate real store sales data from Yokes, Safeway, Walmart, Target, and Costco to find the best deals automatically.

For now, the AI will suggest recipes using commonly available and typically sale-friendly ingredients based on your selected stores and location.