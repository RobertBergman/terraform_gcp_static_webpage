import { AppSettings, MealPlan, Recipe, MealType, WeeklyMealPlan } from '@/lib/types';

const SETTINGS_KEY = 'recipe-generator-settings';
const MEAL_PLANS_KEY = 'recipe-generator-meal-plans';
const RECIPE_LIBRARY_KEY = 'recipe-generator-library';
const WEEKLY_CALENDAR_KEY = 'recipe-generator-weekly-calendar';
const CURRENT_MEAL_PLAN_KEY = 'recipe-generator-current-meal-plan';

export const storage = {
  getSettings: (): AppSettings | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveSettings: (settings: AppSettings): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  getApiKey: (): string | null => {
    const settings = storage.getSettings();
    return settings?.openRouterApiKey || null;
  },

  saveApiKey: (apiKey: string): void => {
    const settings = storage.getSettings() || {};
    storage.saveSettings({ ...settings, openRouterApiKey: apiKey });
  },

  getMealPlans: (): MealPlan[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(MEAL_PLANS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveMealPlan: (mealPlan: MealPlan): void => {
    if (typeof window === 'undefined') return;
    const plans = storage.getMealPlans();
    plans.push(mealPlan);
    localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
  },

  deleteMealPlan: (id: string): void => {
    if (typeof window === 'undefined') return;
    const plans = storage.getMealPlans().filter(p => p.id !== id);
    localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
  },

  // Recipe Library Management
  getRecipeLibrary: (): Recipe[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(RECIPE_LIBRARY_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRecipe: (recipe: Recipe): void => {
    if (typeof window === 'undefined') return;
    const recipes = storage.getRecipeLibrary();

    // Check if recipe already exists
    const existingIndex = recipes.findIndex(r => r.id === recipe.id);

    if (existingIndex >= 0) {
      // Update existing recipe
      recipes[existingIndex] = { ...recipe, savedAt: new Date() };
    } else {
      // Add new recipe
      recipes.push({ ...recipe, savedAt: new Date() });
    }

    localStorage.setItem(RECIPE_LIBRARY_KEY, JSON.stringify(recipes));
  },

  deleteRecipe: (id: string): void => {
    if (typeof window === 'undefined') return;
    const recipes = storage.getRecipeLibrary().filter(r => r.id !== id);
    localStorage.setItem(RECIPE_LIBRARY_KEY, JSON.stringify(recipes));
  },

  getRecipesByMealType: (mealType: MealType): Recipe[] => {
    return storage.getRecipeLibrary().filter(r => r.mealType === mealType);
  },

  isRecipeSaved: (id: string): boolean => {
    return storage.getRecipeLibrary().some(r => r.id === id);
  },

  searchRecipes: (query: string): Recipe[] => {
    const recipes = storage.getRecipeLibrary();
    const lowerQuery = query.toLowerCase();

    return recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(lowerQuery))
    );
  },

  // Weekly Meal Calendar Management
  getWeeklyCalendar: (): WeeklyMealPlan | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(WEEKLY_CALENDAR_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveWeeklyCalendar: (calendar: WeeklyMealPlan): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(WEEKLY_CALENDAR_KEY, JSON.stringify(calendar));
  },

  assignMealToDay: (dayIndex: number, mealType: MealType, recipe: Recipe): void => {
    const calendar = storage.getWeeklyCalendar();
    if (!calendar || dayIndex >= calendar.days.length) return;

    // Only allow breakfast, lunch, dinner (not snack) for calendar
    if (mealType === 'breakfast' || mealType === 'lunch' || mealType === 'dinner') {
      calendar.days[dayIndex][mealType] = {
        recipeId: recipe.id,
        recipe: recipe,
      };
      storage.saveWeeklyCalendar(calendar);
    }
  },

  removeMealFromDay: (dayIndex: number, mealType: MealType): void => {
    const calendar = storage.getWeeklyCalendar();
    if (!calendar || dayIndex >= calendar.days.length) return;

    // Only allow breakfast, lunch, dinner (not snack) for calendar
    if (mealType === 'breakfast' || mealType === 'lunch' || mealType === 'dinner') {
      calendar.days[dayIndex][mealType] = {
        recipeId: null,
        recipe: null,
      };
      storage.saveWeeklyCalendar(calendar);
    }
  },

  clearWeeklyCalendar: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(WEEKLY_CALENDAR_KEY);
  },

  // Current Meal Plan Management (for display on home page)
  getCurrentMealPlan: (): Recipe[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CURRENT_MEAL_PLAN_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCurrentMealPlan: (recipes: Recipe[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CURRENT_MEAL_PLAN_KEY, JSON.stringify(recipes));
  },

  clearCurrentMealPlan: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CURRENT_MEAL_PLAN_KEY);
  },
};