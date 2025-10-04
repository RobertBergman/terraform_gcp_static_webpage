'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, X, Store as StoreIcon, Check } from 'lucide-react';
import { Recipe, ShoppingListItem } from '@/lib/types';

interface ShoppingListProps {
  recipes: Recipe[];
  onClose: () => void;
  fullPage?: boolean;
}

export function ShoppingList({ recipes, onClose, fullPage = false }: ShoppingListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Generate shopping list from recipes
  const generateShoppingList = (): Record<string, ShoppingListItem[]> => {
    const itemsByCategory: Record<string, ShoppingListItem[]> = {};

    recipes.forEach((recipe) => {
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
          // Combine amounts (simplified - in production, would need unit conversion)
          existing.amount = `${existing.amount} + ${ingredient.amount}`;
        } else {
          itemsByCategory[category].push({
            ...ingredient,
            recipeId: recipe.id,
            recipeName: recipe.name,
            checked: false,
          });
        }
      });
    });

    return itemsByCategory;
  };

  const shoppingList = generateShoppingList();
  const categories = Object.keys(shoppingList);

  const toggleItem = (itemKey: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    let text = '📋 Shopping List\n\n';
    categories.forEach((category) => {
      text += `${category.toUpperCase()}\n`;
      shoppingList[category].forEach((item) => {
        text += `☐ ${item.amount} ${item.unit} ${item.name}\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    alert('Shopping list copied to clipboard!');
  };

  const content = (
    <Card className={fullPage ? "w-full" : "max-w-3xl w-full max-h-[90vh] overflow-y-auto"}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" />
          Shopping List
        </CardTitle>
        {!fullPage && (
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        )}
      </CardHeader>

        <CardContent>
          <div className="flex gap-3 mb-6">
            <Button onClick={handlePrint} variant="outline" size="sm">
              Print
            </Button>
            <Button onClick={handleCopy} variant="outline" size="sm">
              Copy to Clipboard
            </Button>
          </div>

          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <StoreIcon className="w-5 h-5 text-primary" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h4>
                <ul className="space-y-2">
                  {shoppingList[category].map((item, index) => {
                    const itemKey = `${category}-${index}`;
                    const isChecked = checkedItems.has(itemKey);

                    return (
                      <li
                        key={itemKey}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => toggleItem(itemKey)}
                      >
                        <div
                          className={`w-6 h-6 border-2 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isChecked
                              ? 'bg-primary border-primary'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {isChecked && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className={`flex-1 ${isChecked ? 'line-through opacity-50' : ''}`}>
                          <div className="font-medium">
                            {item.amount} {item.unit} {item.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            for {item.recipeName}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
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