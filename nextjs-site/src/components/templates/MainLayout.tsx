import React from 'react';
import Header from '@/components/organisms/Header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex justify-center items-center p-8 relative z-10">
        {children}
      </main>
      <footer className="text-center p-4 text-white/60 bg-gray-900/30 relative z-1000">
        <p>&copy; 2025 FatesBlind. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
