'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function GenerateMealPlanContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiptId = searchParams.get('receiptId');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState<{
    id: string;
    receiptId: string;
    userId: string;
    createdAt: string;
    meals: Array<{
      day: string;
      breakfast: string;
      lunch: string;
      dinner: string;
    }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (receiptId && !mealPlan && !isGenerating) {
      generateMealPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiptId]);

  const generateMealPlan = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/meal-plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiptId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      const data = await response.json();
      setMealPlan(data);
    } catch (error) {
      console.error('Generation error:', error);
      setError('Failed to generate meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (status === 'loading' || isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isGenerating ? 'Generating your personalized meal plan...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">{error}</h3>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (mealPlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Personalized Meal Plan</h1>

              {/* This is a placeholder - you would render the actual meal plan data here */}
              <div className="space-y-6">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-lg font-medium text-gray-900">Monday</h3>
                  <p className="text-gray-600">Breakfast: Oatmeal with berries</p>
                  <p className="text-gray-600">Lunch: Chicken salad sandwich</p>
                  <p className="text-gray-600">Dinner: Grilled salmon with vegetables</p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-lg font-medium text-gray-900">Tuesday</h3>
                  <p className="text-gray-600">Breakfast: Scrambled eggs with toast</p>
                  <p className="text-gray-600">Lunch: Caesar salad</p>
                  <p className="text-gray-600">Dinner: Pasta with marinara sauce</p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Back to Dashboard
                </button>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Save Meal Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function GenerateMealPlan() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <GenerateMealPlanContent />
    </Suspense>
  );
}