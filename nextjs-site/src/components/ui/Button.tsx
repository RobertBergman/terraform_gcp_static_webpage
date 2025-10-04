import { cn } from '@/lib/utils/cn';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading = false, className, disabled, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-semibold transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
      active:scale-95
      relative overflow-hidden
      select-none
    `;

    const variants = {
      primary: `
        bg-gradient-to-br from-primary via-primary-light to-primary
        text-white shadow-lg shadow-primary/25
        hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]
        active:scale-95
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity
      `,
      secondary: `
        bg-muted text-foreground
        hover:bg-muted/80 hover:shadow-md
        border border-border/50
      `,
      outline: `
        border-2 border-border text-foreground
        hover:border-primary hover:bg-primary/5 hover:text-primary
        hover:shadow-md
      `,
      ghost: `
        text-foreground hover:bg-muted
        hover:text-primary
      `,
      destructive: `
        bg-gradient-to-br from-error to-red-600
        text-white shadow-lg shadow-error/25
        hover:shadow-xl hover:shadow-error/30 hover:scale-[1.02]
        active:scale-95
      `,
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-lg',
      md: 'h-10 px-5 text-base rounded-xl',
      lg: 'h-12 px-6 text-lg rounded-xl',
      icon: 'h-10 w-10 rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="opacity-80">Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';