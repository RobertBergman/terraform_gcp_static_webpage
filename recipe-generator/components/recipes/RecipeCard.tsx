'use client';

import { Recipe } from '@/lib/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, Users, ChefHat, Bookmark, BookmarkCheck } from 'lucide-react';
import { storage } from '@/lib/utils/storage';
import { useState, useEffect } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onSaveToggle?: (saved: boolean) => void;
  showSaveButton?: boolean;
}

export function RecipeCard({ recipe, onClick, onSaveToggle, showSaveButton = true }: RecipeCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(storage.isRecipeSaved(recipe.id));
  }, [recipe.id]);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSaved) {
      storage.deleteRecipe(recipe.id);
      setIsSaved(false);
      onSaveToggle?.(false);
    } else {
      storage.saveRecipe(recipe);
      setIsSaved(true);
      onSaveToggle?.(true);
    }
  };

  const getMealTypeColor = (mealType: string) => {
    const colors = {
      breakfast: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      lunch: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      dinner: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      snack: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    };
    return colors[mealType as keyof typeof colors] || colors.dinner;
  };

  return (
    <Card className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative group overflow-hidden" onClick={onClick}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {showSaveButton && (
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-3 right-3 z-10 shadow-md hover:shadow-lg transition-all hover:scale-110"
          onClick={handleSaveToggle}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 text-primary" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </Button>
      )}

      <CardHeader className="relative">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-md">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="mb-2 text-lg group-hover:text-primary transition-colors">{recipe.name}</CardTitle>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getMealTypeColor(recipe.mealType)}`}>
              {recipe.mealType}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex gap-4 mb-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-medium">{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-medium">{recipe.servings} servings</span>
          </div>
        </div>

        {recipe.nutritionInfo && (
          <div className="grid grid-cols-4 gap-2 text-xs text-center bg-gradient-to-br from-muted to-gray-100 dark:to-gray-800 rounded-xl p-3 border border-border/50">
            <div>
              <div className="font-bold text-base text-primary">{recipe.nutritionInfo.calories}</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">cal</div>
            </div>
            <div>
              <div className="font-bold text-base text-secondary">{recipe.nutritionInfo.protein}g</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">protein</div>
            </div>
            <div>
              <div className="font-bold text-base text-accent">{recipe.nutritionInfo.carbs}g</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">carbs</div>
            </div>
            <div>
              <div className="font-bold text-base text-success">{recipe.nutritionInfo.fat}g</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">fat</div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {recipe.tags
            .filter((tag) => !['breakfast', 'lunch', 'dinner', 'snack'].includes(tag.toLowerCase()))
            .slice(0, 3)
            .map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20"
              >
                {tag}
              </span>
            ))}
          {recipe.tags.filter((tag) => !['breakfast', 'lunch', 'dinner', 'snack'].includes(tag.toLowerCase())).length > 3 && (
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
              +{recipe.tags.filter((tag) => !['breakfast', 'lunch', 'dinner', 'snack'].includes(tag.toLowerCase())).length - 3}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}