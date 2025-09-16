import React from 'react';
import Link from 'next/link';
import LoginButton from '@/components/molecules/LoginButton';
import UserInfo from '@/components/molecules/UserInfo';

const Header = () => {
  return (
    <header className="relative z-1000 bg-gray-900/50 backdrop-blur-lg p-4 flex justify-between items-center border-b border-white/10">
      <Link href="/" className="font-orbitron text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        FATESBLIND
      </Link>
      <div className="flex items-center gap-4">
        <LoginButton />
        <UserInfo />
      </div>
    </header>
  );
};

export default Header;