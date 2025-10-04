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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary via-primary-light to-secondary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/25 animate-pulse">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20 blur-2xl -z-10 animate-pulse" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Welcome to Meal Planner!
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your AI-powered meal planning assistant. Get personalized recipes based on your preferences and local store sales.
            </p>
          </div>

          <Card variant="glass" className="max-w-2xl mx-auto shadow-2xl border border-primary/20">
            <CardContent className="pt-10 pb-10">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Let&apos;s Get Started</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Configure your meal preferences in Settings to begin generating personalized meal plans.
                  </p>
                </div>

                <div className="grid gap-5 text-left glass p-8 rounded-2xl border border-white/10">
                  <div className="flex gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-primary-light text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">1</div>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground text-lg">Set Your Preferences</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">Tell us about your dietary needs and preferences</p>
                    </div>
                  </div>
                  <div className="flex gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-secondary to-accent text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">2</div>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground text-lg">Generate Meal Plans</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">AI creates personalized recipes just for you</p>
                    </div>
                  </div>
                  <div className="flex gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent to-success text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">3</div>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground text-lg">Organize & Shop</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">Plan your week and create shopping lists</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : recipes.length === 0 ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary via-primary-light to-secondary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 animate-bounce">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-3xl border-2 border-primary opacity-50 animate-ping" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20 blur-2xl -z-10" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Ready to Create Your Meal Plan?
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Let&apos;s generate delicious, personalized recipes based on your preferences and what&apos;s on sale.
            </p>
          </div>

          <Card variant="glass" className="max-w-2xl mx-auto shadow-2xl border border-primary/20">
            <CardContent className="pt-10 pb-10">
              <Button
                onClick={handleGenerateMealPlan}
                disabled={loading}
                size="lg"
                className="w-full h-16 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating Your Perfect Meal Plan...
                  </>
                ) : (
                  <>
                    <ChefHat className="w-6 h-6" />
                    Generate My Meal Plan
                  </>
                )}
              </Button>
              {error && (
                <div className="mt-6 p-5 glass border border-error/30 rounded-2xl">
                  <p className="text-error font-semibold text-center">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Your Meal Plan
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/20 text-primary rounded-full text-sm font-bold">
                  {recipes.length}
                </span>
                delicious recipes crafted for you
              </p>
            </div>
            <Button
              onClick={handleGenerateMealPlan}
              disabled={loading}
              className="flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all"
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
            <div className="mb-8 p-5 glass border border-error/30 rounded-2xl">
              <p className="text-error font-semibold">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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