'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, Calendar, ShoppingCart, Book, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils/cn';

interface NavigationProps {
  onSettingsClick: () => void;
}

export function Navigation({ onSettingsClick }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/meal-planner', label: 'Generate', icon: ChefHat },
    { href: '/meal-planner/calendar', label: 'Calendar', icon: Calendar },
    { href: '/meal-planner/shopping-list', label: 'Shopping', icon: ShoppingCart },
  ];

  return (
    <header className="glass border-b border-white/10 sticky top-0 z-50 shadow-lg shadow-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link href="/meal-planner" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-primary via-primary-light to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all group-hover:scale-105">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                {/* Animated sparkle on hover */}
                <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
                  Meal Planner
                </h1>
                <p className="text-xs text-muted-foreground -mt-0.5">AI-Powered Recipes</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-sm group overflow-hidden',
                      isActive
                        ? 'bg-gradient-to-br from-primary via-primary-light to-primary text-white shadow-lg shadow-primary/25'
                        : 'hover:bg-muted/50 text-foreground/80 hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                    )}
                    <Icon className={cn('w-4 h-4 transition-transform', !isActive && 'group-hover:scale-110')} />
                    <span className="hidden lg:inline relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/meal-planner/library" className="hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Book className="w-4 h-4" />
                <span className="hidden lg:inline">Library</span>
              </Button>
            </Link>
            <Button
              onClick={onSettingsClick}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Settings</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex gap-2 pb-3 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap font-medium text-sm',
                  isActive
                    ? 'bg-gradient-to-br from-primary to-primary-light text-white shadow-md'
                    : 'bg-muted/30 text-foreground/80 active:scale-95'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}