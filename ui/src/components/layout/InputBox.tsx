/**
 * Input Box Component
 * 
 * Persistent floating input box at bottom of screen for natural language commands
 */

import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, Send, Loader2 } from 'lucide-react';

interface InputBoxProps {
  onSubmit?: (message: string) => void;
  isProcessing?: boolean;
}

export function InputBox({ onSubmit, isProcessing = false }: InputBoxProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (message.trim() && !isProcessing) {
      onSubmit?.(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setMessage('');
      (e.target as HTMLInputElement).blur();
    }
  };

  // Global keyboard shortcut: Cmd+K or Ctrl+K to focus
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('main-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <div
        className={`
          bg-background border rounded-lg shadow-lg transition-all duration-200
          ${isFocused ? 'border-primary shadow-xl' : 'border-border'}
          ${isProcessing ? 'border-primary/50' : ''}
        `}
      >
        <div className="flex items-center gap-2 p-3">
          {/* Main input */}
          <Input
            id="main-input"
            type="text"
            placeholder={
              isProcessing
                ? 'AI is thinking...'
                : 'Ask anything or add a lead... (⌘K)'
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isProcessing}
            className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Voice input button */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            disabled={isProcessing}
            title="Voice input (coming soon)"
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Submit button */}
          <Button
            variant="default"
            size="icon"
            className="shrink-0"
            onClick={handleSubmit}
            disabled={!message.trim() || isProcessing}
            title="Send message (Enter)"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="border-t border-border px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Processing your request...</span>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      {!isFocused && !isProcessing && (
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">⌘K</kbd> to focus
        </div>
      )}
    </div>
  );
}

