import { UserPreferences, Recipe } from './types';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterClient {
  private apiKey: string;
  private baseURL = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateMealPlan(
    preferences: UserPreferences,
    numberOfDays: number = 4,
    model: string = 'z-ai/glm-4.6'
  ): Promise<Recipe[]> {
    // Generate 4 breakfasts, 4 lunches, 4 dinners = 12 recipes
    const totalMeals = numberOfDays * 3;

    const systemPrompt = `Generate meal plan recipes as valid JSON ONLY. NO other text.

CRITICAL: Every recipe MUST include mealType field.

Structure:
[{
  "id": "unique-id",
  "name": "Recipe Name",
  "description": "One sentence",
  "mealType": "dinner",
  "ingredients": [{"name": "item", "amount": "1", "unit": "cup", "category": "produce"}],
  "instructions": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "prepTime": 15,
  "cookTime": 30,
  "servings": ${preferences.servingSize},
  "nutritionInfo": {"calories": 450, "protein": 30, "carbs": 40, "fat": 15},
  "tags": ["tag1", "tag2"]
}]

mealType: "breakfast", "lunch", "dinner", or "snack"
category: "protein", "produce", "dairy", "pantry", or "other"
5-6 steps max. Brief descriptions.`;

    // Add timestamp to make each request unique
    const timestamp = Date.now();
    const randomSeed = Math.random().toString(36).substring(7);

    const userPrompt = `Create ${totalMeals} UNIQUE ${preferences.dietType} recipes for ${preferences.servingSize} people for a ${numberOfDays}-day meal plan.
EXACTLY ${numberOfDays} breakfast recipes, ${numberOfDays} lunch recipes, ${numberOfDays} dinner recipes.
${preferences.restrictions ? `Avoid: ${preferences.restrictions.join(', ')}` : ''}
Location: ${preferences.location || 'USA'}

IMPORTANT: Generate completely NEW and DIFFERENT recipes each time. Be creative and diverse. Don't repeat common dishes.
Use seasonal ingredients, international cuisines, and varied cooking methods.
Request ID: ${timestamp}-${randomSeed}

CRITICAL: Include "mealType" field in EVERY recipe.
Return ONLY JSON array. No markdown, no extra text.`;

    const response = await this.chat({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 1.0,
      max_tokens: 50000,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from API');
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Failed to parse response:', content);
      throw new Error('Failed to parse meal plan response. The AI did not return valid JSON.');
    }

    try {
      const recipes: Recipe[] = JSON.parse(jsonMatch[0]);

      // Validate that we got recipes
      if (!Array.isArray(recipes) || recipes.length === 0) {
        throw new Error('No recipes returned');
      }

      return recipes;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response was likely truncated. Attempting to parse partial JSON...');

      // Try to fix common JSON truncation issues
      let partialJson = jsonMatch[0];

      // If it ends mid-object, try to close it
      if (!partialJson.endsWith(']')) {
        // Count open objects/arrays and try to close them
        const openBraces = (partialJson.match(/{/g) || []).length;
        const closeBraces = (partialJson.match(/}/g) || []).length;

        if (openBraces > closeBraces) {
          // Add closing braces
          partialJson += '}'.repeat(openBraces - closeBraces);
        }

        // Close the array
        if (!partialJson.endsWith(']')) {
          partialJson += ']';
        }

        try {
          const recipes: Recipe[] = JSON.parse(partialJson);
          console.log(`Successfully parsed ${recipes.length} recipes from truncated response`);
          return recipes;
        } catch (retryError) {
          console.error('Failed to parse even after cleanup', retryError);
        }
      }

      throw new Error('Response was truncated. Try requesting fewer meals or try again.');
    }
  }

  private async chat(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
        'X-Title': 'Recipe Generator',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    return response.json();
  }
}
