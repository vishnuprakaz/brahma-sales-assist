/**
 * Main Canvas Component
 * 
 * Dynamic grid-based layout for main content area
 */

import type { ReactNode } from 'react';

interface MainCanvasProps {
  children: ReactNode;
}

export function MainCanvas({ children }: MainCanvasProps) {
  return (
    <main className="fixed left-16 right-0 top-14 bottom-24 overflow-auto">
      <div className="container p-6">
        {/* 12-column responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {children}
        </div>
      </div>
    </main>
  );
}

