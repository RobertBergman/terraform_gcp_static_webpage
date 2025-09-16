import React from 'react';
import Link from 'next/link';

interface MenuCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  isPublic: boolean;
}

const MenuCard = ({ href, icon, title, description, isPublic }: MenuCardProps) => {
  return (
    <Link href={href}>
      <div className="bg-gray-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:bg-gray-800/70 hover:border-blue-400/50 transform hover:-translate-y-2">
        <div className="text-5xl mb-4">{icon}</div>
        <h2 className="font-orbitron text-2xl font-bold mb-2">{title}</h2>
        <p className="text-white/70 mb-4">{description}</p>
        <div className={`text-sm font-semibold py-1 px-3 rounded-full inline-block ${isPublic ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
          {isPublic ? '✓ Public Access' : '🔒 Login Required'}
        </div>
      </div>
    </Link>
  );
};

export default MenuCard;
