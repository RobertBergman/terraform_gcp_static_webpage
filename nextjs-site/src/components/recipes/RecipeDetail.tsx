'use client';

import { Recipe } from '@/lib/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Clock, Users, ChefHat, X } from 'lucide-react';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

export function RecipeDetail({ recipe, onClose }: RecipeDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-primary" />
              {recipe.name}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {recipe.description}
            </p>
          </div>
          <button onClick={onClose} className="ml-4">
            <X className="w-6 h-6" />
          </button>
        </CardHeader>

        <CardContent>
          <div className="flex gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Time</div>
                <div className="font-bold">{recipe.prepTime + recipe.cookTime} min</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Servings</div>
                <div className="font-bold">{recipe.servings}</div>
              </div>
            </div>
          </div>

          {recipe.nutritionInfo && (
            <div className="mb-6">
              <h4 className="font-bold mb-2">Nutrition (per serving)</h4>
              <div className="grid grid-cols-4 gap-4 bg-gray-100 dark:bg-gray-800 rounded p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{recipe.nutritionInfo.calories}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{recipe.nutritionInfo.protein}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{recipe.nutritionInfo.carbs}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{recipe.nutritionInfo.fat}g</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">fat</div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="font-bold mb-3">Ingredients</h4>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="font-bold mb-3">Instructions</h4>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="font-bold text-primary">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}