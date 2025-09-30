'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import ReceiptUpload from '@/components/ReceiptUpload';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  // Auth is optional - users can use the app without signing in
  // useEffect(() => {
  //   if (status === 'loading') return;
  //   if (!session) {
  //     router.push('/auth/signin');
  //   }
  // }, [session, status, router]);

  const handleReceiptUpload = async (file: File) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/receipts/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Redirect to meal plan generation
      router.push(`/meal-plans/generate?receiptId=${data.receiptId}`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload receipt. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Show loading state only initially
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Recipe Generator</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`${
                    activeTab === 'upload'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Upload Receipt
                </button>
                <button
                  onClick={() => setActiveTab('plans')}
                  className={`${
                    activeTab === 'plans'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Meal Plans
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`${
                    activeTab === 'preferences'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Preferences
                </button>
              </div>
            </div>
            <div className="flex items-center">
              {session ? (
                <>
                  <span className="text-sm text-gray-700 mr-4">
                    Welcome, {session.user?.name || session.user?.email}
                  </span>
                  <Link
                    href="/"
                    className="text-sm text-gray-500 hover:text-gray-700 mr-4"
                  >
                    Home
                  </Link>
                  <button
                    onClick={() => router.push('/api/auth/signout')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="text-sm text-gray-500 hover:text-gray-700 mr-4"
                  >
                    Home
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'upload' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Upload Your Grocery Receipt
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Upload a photo or PDF of your grocery receipt, and we&apos;ll generate a personalized meal plan based on your purchases.
                </p>
                <ReceiptUpload onUpload={handleReceiptUpload} isLoading={isUploading} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Your Meal Plans
                </h2>
                <p className="text-sm text-gray-600">
                  No meal plans yet. Upload a receipt to get started!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Your Preferences
                </h2>
                <p className="text-sm text-gray-600">
                  Preferences settings coming soon...
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}