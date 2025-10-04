'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { RecipeDetail } from '@/components/recipes/RecipeDetail';
import { ChefHat, Loader2 } from 'lucide-react';
import { Recipe } from '@/lib/types';
import { storage } from '@/lib/utils/storage';

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSettings, setHasSettings] = useState(false);

  useEffect(() => {
    const checkSettings = () => {
      const settings = storage.getSettings();
      // Only require user preferences, API key is now optional (can use server-side key)
      setHasSettings(!!settings?.userPreferences);
    };

    // Check settings on mount
    checkSettings();

    // Load saved meal plan on mount
    const savedMealPlan = storage.getCurrentMealPlan();
    if (savedMealPlan.length > 0) {
      setRecipes(savedMealPlan);
    }

    // Listen for settings changes
    window.addEventListener('settingsChanged', checkSettings);

    return () => {
      window.removeEventListener('settingsChanged', checkSettings);
    };
  }, []);

  const handleGenerateMealPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const settings = storage.getSettings();
      if (!settings?.userPreferences) {
        setError('Please configure your meal preferences in settings first');
        return;
      }

      console.log('Generating meal plan with preferences:', settings.userPreferences.dietType);

      const response = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: settings.openRouterApiKey,
          preferences: settings.userPreferences,
          numberOfDays: 4, // Generate 4 days worth of meals (12 recipes total)
          aiModel: settings.aiModel || 'z-ai/glm-4.6',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API error:', data.error);
        let errorMsg = data.error || 'Failed to generate meal plan';

        // Provide helpful error messages
        if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
          errorMsg = 'Invalid API key. Please check your OpenRouter API key in settings.';
        } else if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
          errorMsg = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (errorMsg.includes('insufficient')) {
          errorMsg = 'Insufficient credits. Please add credits to your OpenRouter account.';
        }

        throw new Error(errorMsg);
      }

      if (!data.recipes || !Array.isArray(data.recipes)) {
        throw new Error('Invalid response from server');
      }

      console.log(`Successfully generated ${data.recipes.length} recipes`);
      setRecipes(data.recipes);
      // Save to localStorage so it persists across page refreshes
      storage.saveCurrentMealPlan(data.recipes);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Meal plan generation error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {!hasSettings ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl mb-6 shadow-lg">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to Recipe Generator!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your AI-powered meal planning assistant. Get personalized recipes based on your preferences and local store sales.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto shadow-xl border-2">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Let&apos;s Get Started</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Configure your meal preferences in Settings to begin generating personalized meal plans.
                  </p>
                </div>

                <div className="grid gap-4 text-left bg-muted p-6 rounded-xl">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <p className="font-medium">Set Your Preferences</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tell us about your dietary needs and preferences</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <p className="font-medium">Generate Meal Plans</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">AI creates personalized recipes just for you</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <p className="font-medium">Organize & Shop</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Plan your week and create shopping lists</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : recipes.length === 0 ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl mb-6 shadow-lg animate-bounce">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Ready to Create Your Meal Plan?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Let&apos;s generate delicious, personalized recipes based on your preferences and what&apos;s on sale.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto shadow-xl border-2">
            <CardContent className="pt-8 pb-8">
              <Button
                onClick={handleGenerateMealPlan}
                disabled={loading}
                size="lg"
                className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Generating Your Perfect Meal Plan...
                  </>
                ) : (
                  <>
                    <ChefHat className="w-6 h-6 mr-3" />
                    Generate My Meal Plan
                  </>
                )}
              </Button>
              {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                  <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Your Meal Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                {recipes.length} delicious recipes crafted for you
              </p>
            </div>
            <Button
              onClick={handleGenerateMealPlan}
              disabled={loading}
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5" />
                  Regenerate Plan
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </main>
  );
}