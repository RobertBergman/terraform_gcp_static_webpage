import React from 'react';
import Link from 'next/link';
import LoginButton from '@/components/molecules/LoginButton';
import UserInfo from '@/components/molecules/UserInfo';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <span className="font-orbitron text-xl font-bold tracking-tight text-white">
            FATESBLIND
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <LoginButton />
          <UserInfo />
        </div>
      </div>
    </header>
  );
};

export default Header;