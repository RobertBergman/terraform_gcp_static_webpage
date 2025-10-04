export type DietType =
  | 'carnivore'
  | 'mediterranean'
  | 'keto'
  | 'paleo'
  | 'vegan'
  | 'vegetarian'
  | 'pescatarian'
  | 'whole30'
  | 'gluten-free'
  | 'low-carb'
  | 'balanced';

export type Store = 'yokes' | 'safeway' | 'walmart' | 'target' | 'costco';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface UserPreferences {
  dietType: DietType;
  location: string;
  preferredStores: Store[];
  budget?: number;
  servingSize: number;
  restrictions?: string[];
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  category: 'protein' | 'produce' | 'dairy' | 'pantry' | 'other';
  estimatedPrice?: number;
  onSale?: boolean;
  store?: Store;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  mealType: MealType;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  savedAt?: Date;
}

export interface MealPlan {
  id: string;
  userId?: string;
  week: string;
  recipes: Recipe[];
  totalEstimatedCost: number;
  createdAt: Date;
}

export interface ShoppingListItem extends Ingredient {
  recipeId: string;
  recipeName: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  mealPlanId: string;
  items: ShoppingListItem[];
  groupedByStore: Record<Store, ShoppingListItem[]>;
  totalEstimatedCost: number;
}

export interface AppSettings {
  openRouterApiKey?: string;
  userPreferences?: UserPreferences;
  aiModel?: string;
}

export interface MealSlot {
  recipeId: string | null;
  recipe: Recipe | null;
}

export interface DayMeals {
  date: string;
  breakfast: MealSlot;
  lunch: MealSlot;
  dinner: MealSlot;
}

export interface WeeklyMealPlan {
  id: string;
  startDate: string;
  days: DayMeals[];
  createdAt: Date;
}