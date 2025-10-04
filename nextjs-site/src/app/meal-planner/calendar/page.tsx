'use client';

import { useState, useEffect } from 'react';
import { MealCalendar } from '@/components/MealCalendar';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { storage } from '@/lib/utils/storage';
import { Recipe } from '@/lib/types';

export default function CalendarPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // Load saved recipes from library
    const savedRecipes = storage.getRecipeLibrary();
    setRecipes(savedRecipes);
  }, []);

  if (recipes.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Meal Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You need to generate or save some recipes first before you can assign them to your calendar.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Go to the Generate page to create new recipes, or save recipes to your library.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MealCalendar recipes={recipes} onClose={() => {}} fullPage />
    </main>
  );
}