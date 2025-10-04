'use client';

import { RecipeLibrary } from '@/components/RecipeLibrary';

export default function LibraryPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RecipeLibrary onClose={() => {}} fullPage />
    </main>
  );
}