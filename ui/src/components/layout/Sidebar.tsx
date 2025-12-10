/**
 * Sidebar Component
 * 
 * Collapsible left sidebar with icon-only navigation
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Users, Settings } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/' },
  { icon: <Users className="h-5 w-5" />, label: 'Leads', path: '/leads' },
  { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className="fixed left-0 top-14 bottom-0 z-40 border-r border-border bg-muted/40 transition-all duration-300"
      style={{ width: isExpanded ? '200px' : '64px' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex h-full flex-col">
        <nav className="flex flex-col items-start gap-2 p-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`w-full justify-start gap-3 ${isExpanded ? 'px-3' : 'px-3'}`}
            >
              {item.icon}
              {isExpanded && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

