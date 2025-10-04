'use client';

import { useState, useEffect } from 'react';
import { Recipe, MealType, WeeklyMealPlan } from '@/lib/types';
import { storage } from '@/lib/utils/storage';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, X, Plus, Trash2, Coffee, Utensils, Moon, ShoppingCart } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Ingredient } from '@/lib/types';

interface MealCalendarProps {
  recipes: Recipe[];
  onClose: () => void;
  fullPage?: boolean;
}

const MEAL_TYPE_ICONS = {
  breakfast: <Coffee className="w-4 h-4" />,
  lunch: <Utensils className="w-4 h-4" />,
  dinner: <Moon className="w-4 h-4" />,
  snack: <Utensils className="w-4 h-4" />,
};

export function MealCalendar({ recipes, onClose, fullPage = false }: MealCalendarProps) {
  const [calendar, setCalendar] = useState<WeeklyMealPlan | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ dayIndex: number; mealType: MealType } | null>(null);

  useEffect(() => {
    initializeCalendar();
  }, []);

  const initializeCalendar = () => {
    let existingCalendar = storage.getWeeklyCalendar();

    if (!existingCalendar) {
      // Create new 4-day calendar starting today
      const startDate = new Date();
      existingCalendar = {
        id: `calendar-${Date.now()}`,
        startDate: startDate.toISOString(),
        days: Array.from({ length: 4 }, (_, i) => ({
          date: addDays(startDate, i).toISOString(),
          breakfast: { recipeId: null, recipe: null },
          lunch: { recipeId: null, recipe: null },
          dinner: { recipeId: null, recipe: null },
        })),
        createdAt: new Date(),
      };
      storage.saveWeeklyCalendar(existingCalendar);
    }

    setCalendar(existingCalendar);
  };

  const handleAssignMeal = (dayIndex: number, mealType: MealType, recipe: Recipe) => {
    storage.assignMealToDay(dayIndex, mealType, recipe);
    setCalendar(storage.getWeeklyCalendar());
    setSelectedSlot(null);
  };

  const handleRemoveMeal = (dayIndex: number, mealType: MealType) => {
    storage.removeMealFromDay(dayIndex, mealType);
    setCalendar(storage.getWeeklyCalendar());
  };

  const handleAutoAssign = () => {
    if (!calendar) return;

    const breakfasts = recipes.filter(r => r.mealType === 'breakfast');
    const lunches = recipes.filter(r => r.mealType === 'lunch');
    const dinners = recipes.filter(r => r.mealType === 'dinner');

    calendar.days.forEach((day, index) => {
      if (breakfasts[index]) handleAssignMeal(index, 'breakfast', breakfasts[index]);
      if (lunches[index]) handleAssignMeal(index, 'lunch', lunches[index]);
      if (dinners[index]) handleAssignMeal(index, 'dinner', dinners[index]);
    });
  };

  const handleClearCalendar = () => {
    if (confirm('Clear all meals from the calendar?')) {
      storage.clearWeeklyCalendar();
      initializeCalendar();
    }
  };

  const getAvailableRecipes = (mealType: MealType): Recipe[] => {
    return recipes.filter(r => r.mealType === mealType);
  };

  const getDayIngredients = (dayIndex: number): Record<string, Ingredient[]> => {
    if (!calendar) return {};

    const day = calendar.days[dayIndex];
    const dayRecipes: Recipe[] = [];

    if (day.breakfast.recipe) dayRecipes.push(day.breakfast.recipe);
    if (day.lunch.recipe) dayRecipes.push(day.lunch.recipe);
    if (day.dinner.recipe) dayRecipes.push(day.dinner.recipe);

    const itemsByCategory: Record<string, Ingredient[]> = {};

    dayRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const category = ingredient.category;
        if (!itemsByCategory[category]) {
          itemsByCategory[category] = [];
        }

        // Check if ingredient already exists
        const existing = itemsByCategory[category].find(
          (item) => item.name.toLowerCase() === ingredient.name.toLowerCase()
        );

        if (existing) {
          existing.amount = `${existing.amount} + ${ingredient.amount}`;
        } else {
          itemsByCategory[category].push({ ...ingredient });
        }
      });
    });

    return itemsByCategory;
  };

  if (!calendar) return null;

  const content = (
    <Card className={fullPage ? "w-full" : "max-w-6xl w-full max-h-[90vh] overflow-y-auto"}>
      <CardHeader className={`flex flex-row items-center justify-between ${fullPage ? '' : 'sticky top-0 bg-card z-10'}`}>
        <div className="flex items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            4-Day Meal Calendar
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleAutoAssign}>
              Auto-Assign
            </Button>
            <Button size="sm" variant="outline" onClick={handleClearCalendar}>
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        {!fullPage && (
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        )}
      </CardHeader>

        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-4 gap-4">
            {calendar.days.map((day, dayIndex) => (
              <div key={dayIndex} className="border border-border rounded-lg p-3">
                <h3 className="font-bold text-center mb-3">
                  Day {dayIndex + 1}
                  <div className="text-sm font-normal text-gray-600 dark:text-gray-400">
                    {format(new Date(day.date), 'MMM d')}
                  </div>
                </h3>

                {/* Breakfast Slot */}
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1 text-sm font-medium">
                    {MEAL_TYPE_ICONS.breakfast}
                    Breakfast
                  </div>
                  {day.breakfast.recipe ? (
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded relative group">
                      <div className="text-sm font-medium">{day.breakfast.recipe.name}</div>
                      <button
                        onClick={() => handleRemoveMeal(dayIndex, 'breakfast')}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedSlot({ dayIndex, mealType: 'breakfast' })}
                      className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded hover:border-primary transition-colors flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  )}
                </div>

                {/* Lunch Slot */}
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1 text-sm font-medium">
                    {MEAL_TYPE_ICONS.lunch}
                    Lunch
                  </div>
                  {day.lunch.recipe ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded relative group">
                      <div className="text-sm font-medium">{day.lunch.recipe.name}</div>
                      <button
                        onClick={() => handleRemoveMeal(dayIndex, 'lunch')}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedSlot({ dayIndex, mealType: 'lunch' })}
                      className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded hover:border-primary transition-colors flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  )}
                </div>

                {/* Dinner Slot */}
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-1 text-sm font-medium">
                    {MEAL_TYPE_ICONS.dinner}
                    Dinner
                  </div>
                  {day.dinner.recipe ? (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded relative group">
                      <div className="text-sm font-medium">{day.dinner.recipe.name}</div>
                      <button
                        onClick={() => handleRemoveMeal(dayIndex, 'dinner')}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedSlot({ dayIndex, mealType: 'dinner' })}
                      className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded hover:border-primary transition-colors flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  )}
                </div>

                {/* Shopping List for Day */}
                {(() => {
                  const dayIngredients = getDayIngredients(dayIndex);
                  const hasIngredients = Object.keys(dayIngredients).length > 0;

                  if (!hasIngredients) return null;

                  return (
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex items-center gap-1 mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                        <ShoppingCart className="w-3 h-3" />
                        Shopping List
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {Object.entries(dayIngredients).map(([category, ingredients]) => (
                          <div key={category}>
                            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 capitalize">
                              {category}
                            </div>
                            <ul className="space-y-1">
                              {ingredients.map((ingredient, idx) => (
                                <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 pl-2">
                                  • {ingredient.amount} {ingredient.unit} {ingredient.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>

          {/* Recipe Selection Modal */}
          {selectedSlot && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <Card className="max-w-2xl w-full max-h-[70vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    Select {selectedSlot.mealType} for Day {selectedSlot.dayIndex + 1}
                  </CardTitle>
                  <button onClick={() => setSelectedSlot(null)}>
                    <X className="w-6 h-6" />
                  </button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getAvailableRecipes(selectedSlot.mealType).map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => handleAssignMeal(selectedSlot.dayIndex, selectedSlot.mealType, recipe)}
                        className="w-full p-3 border border-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
                      >
                        <div className="font-medium">{recipe.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{recipe.description}</div>
                      </button>
                    ))}
                    {getAvailableRecipes(selectedSlot.mealType).length === 0 && (
                      <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                        No {selectedSlot.mealType} recipes available. Generate a meal plan first.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
  );

  if (fullPage) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {content}
    </div>
  );
}