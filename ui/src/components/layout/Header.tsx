/**
 * Header Component
 * 
 * Fixed top header with logo, search, and profile
 */

import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {/* Logo */}
        <div className="mr-6 flex items-center">
          <span className="text-xl font-bold tracking-tight">No-CRM</span>
        </div>

        {/* Spacer */}
        <div className="flex flex-1" />

        {/* Right side actions */}
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Settings
          </Button>
        </nav>
      </div>
    </header>
  );
}

