import React from 'react';
import Header from '@/components/organisms/Header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="relative z-10 flex flex-1 flex-col">
        <div className="w-full mx-auto flex-1 px-4 sm:px-6 py-12">
          {children}
        </div>
      </main>
      <footer className="relative z-10 border-t border-white/5 bg-gray-950/50 py-6">
        <div className="w-full max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-gray-500">
            &copy; 2025 FatesBlind. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
