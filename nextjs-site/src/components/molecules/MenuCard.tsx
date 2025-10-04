import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MenuCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  isPublic: boolean;
}

const MenuCard = ({ href, icon, title, description, isPublic }: MenuCardProps) => {
  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 glass p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        <div className="relative z-10 flex items-start gap-5">
          {/* Icon with animated gradient background */}
          <div className="relative flex-shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 text-3xl border border-primary/20 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/25 group-hover:rotate-3">
              {icon}
            </div>
            {/* Pulse ring on hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            {/* Title and status */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
                {title}
              </h3>
              <div className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full glass border whitespace-nowrap",
                isPublic
                  ? 'text-success border-success/30 bg-success/10'
                  : 'text-warning border-warning/30 bg-warning/10'
              )}>
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full animate-pulse",
                  isPublic ? 'bg-success' : 'bg-warning'
                )} />
                {isPublic ? 'Public' : 'Private'}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
              {description}
            </p>

            {/* Arrow indicator */}
            <div className="flex items-center gap-2 text-primary text-sm font-medium pt-1">
              <span className="group-hover:translate-x-1 transition-transform">Explore</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MenuCard;
