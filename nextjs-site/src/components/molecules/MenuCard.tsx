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
    <Link href={href} className="group">
      <div className="relative overflow-hidden rounded-xl border border-white/5 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-200 hover:border-white/10 hover:bg-gray-900/70 hover:shadow-lg hover:shadow-blue-500/5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-2xl transition-transform duration-200 group-hover:scale-110">
            {icon}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
                {title}
              </h3>
              <div className={`flex items-center gap-1.5 text-xs font-medium ${isPublic ? 'text-green-400' : 'text-amber-400'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isPublic ? 'bg-green-400' : 'bg-amber-400'}`} />
                {isPublic ? 'Public' : 'Private'}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MenuCard;
