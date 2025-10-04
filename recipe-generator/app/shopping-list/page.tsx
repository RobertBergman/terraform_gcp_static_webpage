'use client';

import { useState, useEffect } from 'react';
import { ShoppingList } from '@/components/ShoppingList';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { storage } from '@/lib/utils/storage';
import { Recipe } from '@/lib/types';

export default function ShoppingListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // Get recipes from the weekly calendar
    const calendar = storage.getWeeklyCalendar();

    if (calendar) {
      const calendarRecipes: Recipe[] = [];

      calendar.days.forEach((day) => {
        if (day.breakfast.recipe) calendarRecipes.push(day.breakfast.recipe);
        if (day.lunch.recipe) calendarRecipes.push(day.lunch.recipe);
        if (day.dinner.recipe) calendarRecipes.push(day.dinner.recipe);
      });

      setRecipes(calendarRecipes);
    }
  }, []);

  if (recipes.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Shopping List</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Your shopping list is empty because you haven&apos;t assigned any meals to your calendar yet.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Go to the Calendar page to assign recipes to your meal plan, and your shopping list will be automatically generated.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ShoppingList recipes={recipes} onClose={() => {}} fullPage />
    </main>
  );
}