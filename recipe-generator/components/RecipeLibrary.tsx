'use client';

import { useState, useEffect } from 'react';
import { Recipe, MealType } from '@/lib/types';
import { storage } from '@/lib/utils/storage';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { RecipeDetail } from '@/components/recipes/RecipeDetail';
import { Book, Search, X, Coffee, Utensils, Moon } from 'lucide-react';

interface RecipeLibraryProps {
  onClose: () => void;
  fullPage?: boolean;
}

const MEAL_TYPE_CONFIG: Record<MealType, { label: string; icon: React.ReactNode }> = {
  breakfast: { label: 'Breakfast', icon: <Coffee className="w-4 h-4" /> },
  lunch: { label: 'Lunch', icon: <Utensils className="w-4 h-4" /> },
  dinner: { label: 'Dinner', icon: <Moon className="w-4 h-4" /> },
  snack: { label: 'Snacks', icon: <Utensils className="w-4 h-4" /> },
};

export function RecipeLibrary({ onClose, fullPage = false }: RecipeLibraryProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<MealType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    const filterRecipes = () => {
      let filtered = recipes;

      // Filter by meal type
      if (selectedMealType !== 'all') {
        filtered = filtered.filter(r => r.mealType === selectedMealType);
      }

      // Filter by search query
      if (searchQuery) {
        filtered = storage.searchRecipes(searchQuery);
        if (selectedMealType !== 'all') {
          filtered = filtered.filter(r => r.mealType === selectedMealType);
        }
      }

      setFilteredRecipes(filtered);
    };

    filterRecipes();
  }, [recipes, selectedMealType, searchQuery]);

  const loadRecipes = () => {
    const savedRecipes = storage.getRecipeLibrary();
    setRecipes(savedRecipes);
  };

  const handleDeleteRecipe = (id: string) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      storage.deleteRecipe(id);
      loadRecipes();
    }
  };

  const recipesByMealType = (type: MealType) =>
    recipes.filter(r => r.mealType === type).length;

  const content = (
    <Card className={fullPage ? "w-full" : "max-w-6xl w-full max-h-[90vh] overflow-y-auto"}>
      <CardHeader className={`flex flex-row items-center justify-between ${fullPage ? '' : 'sticky top-0 bg-card z-10'}`}>
        <CardTitle className="flex items-center gap-2">
          <Book className="w-6 h-6 text-primary" />
          Recipe Library
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
            ({recipes.length} saved)
          </span>
        </CardTitle>
        {!fullPage && (
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        )}
      </CardHeader>

        <CardContent>
          {/* Search and Filter */}
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Meal Type Filters */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedMealType === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedMealType('all')}
              >
                All ({recipes.length})
              </Button>
              {Object.entries(MEAL_TYPE_CONFIG).map(([type, config]) => (
                <Button
                  key={type}
                  variant={selectedMealType === type ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMealType(type as MealType)}
                  className="flex items-center gap-2"
                >
                  {config.icon}
                  {config.label} ({recipesByMealType(type as MealType)})
                </Button>
              ))}
            </div>
          </div>

          {/* Recipe Grid */}
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {recipes.length === 0
                  ? 'No saved recipes yet'
                  : 'No recipes found'}
              </p>
              <p className="text-sm text-gray-500">
                {recipes.length === 0
                  ? 'Generate meal plans and save recipes to build your library'
                  : 'Try a different search or filter'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="relative">
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecipe(recipe.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
  );

  return (
    <>
      {fullPage ? (
        content
      ) : (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          {content}
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </>
  );
}