import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterClient } from '@/lib/openrouter';
import { UserPreferences } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, preferences, numberOfDays = 4, aiModel } = body;

    // Use server-side API key as fallback if user doesn't provide their own
    const serverApiKey = process.env.OPENROUTER_API_KEY;
    const effectiveApiKey = apiKey || serverApiKey;

    console.log('Received meal plan request:', {
      hasClientApiKey: !!apiKey,
      hasServerApiKey: !!serverApiKey,
      usingServerKey: !apiKey && !!serverApiKey,
      preferences: preferences?.dietType,
      numberOfDays,
      aiModel
    });

    if (!effectiveApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key is required. Please configure it in settings or contact the administrator.' },
        { status: 400 }
      );
    }

    if (!preferences) {
      return NextResponse.json(
        { error: 'User preferences are required' },
        { status: 400 }
      );
    }

    const client = new OpenRouterClient(effectiveApiKey);
    const recipes = await client.generateMealPlan(
      preferences as UserPreferences,
      numberOfDays,
      aiModel
    );

    console.log(`Successfully generated ${recipes.length} recipes`);
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Meal plan generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate meal plan';
    console.error('Error details:', errorMessage);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}