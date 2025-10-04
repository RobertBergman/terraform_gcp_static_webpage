'use client';

import { Recipe } from '@/lib/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, Users, ChefHat, Bookmark, BookmarkCheck } from 'lucide-react';
import { storage } from '@/lib/utils/storage';
import { cn } from '@/lib/utils/cn';
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
      breakfast: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 text-orange-300 border border-orange-500/30',
      lunch: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-300 border border-blue-500/30',
      dinner: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-500/30',
      snack: 'bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-300 border border-green-500/30',
    };
    return colors[mealType as keyof typeof colors] || colors.dinner;
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-300 relative group overflow-hidden"
      onClick={onClick}
    >
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/5 to-accent/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {showSaveButton && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-4 right-4 z-20 glass border border-white/10 shadow-lg backdrop-blur-xl transition-all hover:scale-110",
            isSaved && "bg-primary/20 border-primary/30"
          )}
          onClick={handleSaveToggle}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 text-primary" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </Button>
      )}

      <CardHeader className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-primary via-primary-light to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all group-hover:scale-105">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            {/* Pulse ring on hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="mb-3 text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {recipe.name}
            </CardTitle>
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm",
              getMealTypeColor(recipe.mealType)
            )}>
              {recipe.mealType}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-muted-foreground mb-5 line-clamp-2 text-sm leading-relaxed">
          {recipe.description}
        </p>

        <div className="flex gap-3 mb-5 text-sm">
          <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl border border-white/10 flex-1">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">{recipe.prepTime + recipe.cookTime}</span>
            <span className="text-muted-foreground text-xs">min</span>
          </div>
          <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl border border-white/10 flex-1">
            <Users className="w-4 h-4 text-secondary" />
            <span className="font-semibold text-foreground">{recipe.servings}</span>
            <span className="text-muted-foreground text-xs">servings</span>
          </div>
        </div>

        {recipe.nutritionInfo && (
          <div className="grid grid-cols-4 gap-3 text-xs text-center glass border border-white/10 rounded-2xl p-4 mb-4">
            <div className="space-y-1">
              <div className="font-bold text-lg bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent">
                {recipe.nutritionInfo.calories}
              </div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">cal</div>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-lg bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">
                {recipe.nutritionInfo.protein}g
              </div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">protein</div>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-lg bg-gradient-to-br from-accent to-success bg-clip-text text-transparent">
                {recipe.nutritionInfo.carbs}g
              </div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">carbs</div>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-lg bg-gradient-to-br from-success to-primary bg-clip-text text-transparent">
                {recipe.nutritionInfo.fat}g
              </div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">fat</div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {recipe.tags
            .filter((tag) => !['breakfast', 'lunch', 'dinner', 'snack'].includes(tag.toLowerCase()))
            .slice(0, 3)
            .map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 glass border border-primary/30 text-primary rounded-xl text-xs font-medium hover:bg-primary/10 transition-colors"
              >
                {tag}
              </span>
            ))}
          {recipe.tags.filter((tag) => !['breakfast', 'lunch', 'dinner', 'snack'].includes(tag.toLowerCase())).length > 3 && (
            <span className="px-3 py-1.5 glass border border-white/10 text-muted-foreground rounded-xl text-xs font-medium">
              +{recipe.tags.filter((tag) => !['breakfast', 'lunch', 'dinner', 'snack'].includes(tag.toLowerCase())).length - 3} more
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}