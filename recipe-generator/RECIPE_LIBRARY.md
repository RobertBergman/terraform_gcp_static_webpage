# Recipe Library Feature

## Overview

The Recipe Library allows you to save and organize recipes by meal type (breakfast, lunch, dinner, snack) so you don't have to regenerate them every time.

## Features

### 1. **Save Recipes**
- Click the bookmark icon on any recipe card to save it to your library
- Recipes are stored locally in your browser
- Saved recipes show a filled bookmark icon

### 2. **Meal Type Categorization**
All recipes are categorized by meal type:
- 🟠 **Breakfast** - Morning meals
- 🔵 **Lunch** - Midday meals
- 🟣 **Dinner** - Evening meals
- 🟢 **Snacks** - Small bites and snacks

### 3. **Browse Your Library**
- Click "Library" button in the header
- View all your saved recipes organized by category
- Filter by meal type to find specific recipes quickly

### 4. **Search Recipes**
- Search by recipe name, description, tags, or ingredients
- Real-time filtering as you type
- Combine search with meal type filters

### 5. **Recipe Management**
- View full recipe details by clicking any card
- Delete recipes from your library when you no longer need them
- Recipes show when they were saved

## How to Use

### Saving Recipes

1. Generate a meal plan
2. Click the bookmark icon on any recipe you like
3. The recipe is instantly saved to your library

### Browsing Saved Recipes

1. Click **Library** button in the header
2. Use the filter buttons to view specific meal types:
   - "All" - View everything
   - "Breakfast" - Morning recipes only
   - "Lunch" - Midday recipes only
   - "Dinner" - Evening recipes only
   - "Snacks" - Snack recipes only

### Searching

1. Open the Recipe Library
2. Type in the search box
3. Results update instantly
4. Combine with meal type filters for precise results

### Deleting Recipes

1. Open Recipe Library
2. Click the X button on any recipe card
3. Confirm deletion
4. Recipe is removed from your library

## Storage

- All recipes are stored in your browser's localStorage
- No account required
- Data persists across browser sessions
- Stays on your device (privacy-friendly)
- Clear browser data will remove saved recipes

## Tips

### Building Your Collection
- Save recipes from multiple meal plans
- Mix and match different diet types
- Build a diverse library over time

### Organization
- Use meal type filters to plan your week
- Search by ingredients you have on hand
- Save variations of favorite recipes

### Meal Planning
1. Generate new recipes when needed
2. Browse your library for favorites
3. Mix generated and saved recipes
4. Create shopping lists from both

## Technical Details

### Meal Type Generation
- AI automatically assigns meal types during generation
- Mix of breakfast, lunch, and dinner recipes in each plan
- Appropriate recipes for each meal time

### Recipe Structure
Each recipe includes:
- Unique ID
- Name and description
- **Meal type** (breakfast/lunch/dinner/snack)
- Ingredients with categories
- Step-by-step instructions
- Prep and cook times
- Serving sizes
- Nutrition information
- Tags for filtering
- **Save timestamp**

### Storage Limits
- localStorage typically allows 5-10MB
- Each recipe is ~2-5KB
- Can store hundreds of recipes
- Browser will warn if quota exceeded

## Future Enhancements

Planned features:
- Export recipes to PDF or text
- Share recipes with friends
- Recipe ratings and favorites
- Custom tags and notes
- Recipe history and analytics
- Meal plan templates from saved recipes
- Grocery list from multiple recipes
- Recipe variations and substitutions

## Troubleshooting

**Recipes not saving?**
- Check browser localStorage is enabled
- Check if incognito/private mode (doesn't persist)
- Check available storage space

**Recipes disappeared?**
- Check if browser data was cleared
- Check if using same browser/device
- localStorage is device-specific

**Can't find a recipe?**
- Check spelling in search
- Try different keywords
- Check meal type filter is set to "All"

**Library not loading?**
- Refresh the page
- Check browser console for errors
- Try clearing cache and refreshing