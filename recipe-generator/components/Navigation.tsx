'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, Calendar, ShoppingCart, Book, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils/cn';

interface NavigationProps {
  onSettingsClick: () => void;
}

export function Navigation({ onSettingsClick }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Generate', icon: ChefHat },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/shopping-list', label: 'Shopping', icon: ShoppingCart },
  ];

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
                Recipe Generator
              </h1>
            </Link>

            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium',
                      isActive
                        ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-md'
                        : 'hover:bg-muted text-gray-700 dark:text-gray-300'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex gap-2">
            <Link href="/library" className="hidden sm:block">
              <Button variant="outline" size="sm" className="flex items-center gap-2 hover:border-primary hover:text-primary transition-colors">
                <Book className="w-4 h-4" />
                <span className="hidden lg:inline">Library</span>
              </Button>
            </Link>
            <Button
              onClick={onSettingsClick}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:border-primary hover:text-primary transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Settings</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap font-medium',
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-md'
                    : 'hover:bg-muted text-gray-700 dark:text-gray-300'
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