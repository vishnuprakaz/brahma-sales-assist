/**
 * App Layout Component
 * 
 * Simple 3-column layout: Sidebar | Main Content | Agent Panel (with drag resize)
 */

import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { InputBox } from './InputBox';
import { AgentResponsePanel } from './AgentResponsePanel';
import { usePageContext } from '@/hooks/useUIContext';
import { cn } from '@/lib/utils';

interface AgentMessage {
  id: string;
  type: 'text' | 'thinking' | 'component';
  content: string;
  timestamp: number;
  streaming?: boolean;
}

interface AppLayoutProps {
  children: ReactNode;
  pageName?: string;
}

export function AppLayout({ children, pageName = 'dashboard' }: AppLayoutProps) {
  // Track page context
  usePageContext(pageName);

  // Agent panel state
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [isAgentProcessing, setIsAgentProcessing] = useState(false);
  const [isAgentPanelVisible, setIsAgentPanelVisible] = useState(false);
  const [agentPanelWidth, setAgentPanelWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);

  const handleMessageSubmit = (message: string, files?: any[], context?: any[]) => {
    console.log('Message submitted:', message);
    if (files?.length) console.log('Files attached:', files);
    if (context?.length) console.log('Context chips:', context);
    
    // Show agent panel when user submits a message
    setIsAgentPanelVisible(true);
    setIsAgentProcessing(true);
    
    // Add thinking message
    const thinkingMessage: AgentMessage = {
      id: `thinking-${Date.now()}`,
      type: 'thinking',
      content: 'Analyzing your request...',
      timestamp: Date.now()
    };
    setAgentMessages(prev => [...prev, thinkingMessage]);

    // Simulate agent response
    setTimeout(() => {
      setIsAgentProcessing(false);
      
      setAgentMessages(prev => prev.filter(m => m.type !== 'thinking').concat([
        {
          id: `response-${Date.now()}`,
          type: 'text',
          content: `I received your message: "${message}"\n\nThis is a simulated response. In the real implementation, this will be connected to the backend agents through the message service.`,
          timestamp: Date.now()
        }
      ]));
    }, 2000);
  };

  const handleToggleAgentPanel = () => {
    setIsAgentPanelVisible(!isAgentPanelVisible);
  };

  // Drag handle functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // If panel is closed, open it
    if (!isAgentPanelVisible) {
      setIsAgentPanelVisible(true);
      setAgentPanelWidth(400);
      return;
    }
    
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [isAgentPanelVisible]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newWidth = window.innerWidth - e.clientX;
    const constrainedWidth = Math.min(Math.max(newWidth, 300), 800);
    setAgentPanelWidth(constrainedWidth);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Layout - 3 Columns */}
      <div className="flex flex-1 overflow-hidden pt-14">
        {/* Column 1: Sidebar (Fixed) */}
        <Sidebar />

        {/* Column 2: Main Content (Flexible) */}
        <div 
          className="flex-1 overflow-hidden"
          style={{ 
            width: isAgentPanelVisible 
              ? `calc(100% - 64px - ${agentPanelWidth}px - 4px)` // 64px sidebar, 4px drag handle
              : 'calc(100% - 64px - 4px)' // Leave space for drag handle
          }}
        >
          <div className="h-full overflow-y-auto p-6 pb-36">
            {children}
          </div>
        </div>

        {/* Drag Handle (Always visible on right edge) */}
        <div
          className={cn(
            "w-1 bg-transparent hover:bg-border cursor-col-resize transition-colors duration-200 group flex-shrink-0",
            isDragging && "bg-primary",
            !isAgentPanelVisible && "hover:bg-primary/50"
          )}
          onMouseDown={handleMouseDown}
          title={isAgentPanelVisible ? "Resize agent panel" : "Drag to open agent panel"}
        >
          {/* Visual indicator */}
          <div 
            className={cn(
              "w-full h-full relative",
              "group-hover:bg-border/50",
              isDragging && "bg-primary"
            )}
          >
            {/* Drag dots - show on hover or when panel closed */}
            {(!isAgentPanelVisible || isDragging) && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1">
                <div className="w-0.5 h-0.5 bg-muted-foreground rounded-full" />
                <div className="w-0.5 h-0.5 bg-muted-foreground rounded-full" />
                <div className="w-0.5 h-0.5 bg-muted-foreground rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Agent Response Panel (Fixed width when visible) */}
        {isAgentPanelVisible && (
          <div 
            className="flex-shrink-0 animate-in slide-in-from-right duration-300"
            style={{ width: agentPanelWidth }}
          >
            <AgentResponsePanel
              isVisible={isAgentPanelVisible}
              onToggleVisibility={handleToggleAgentPanel}
              messages={agentMessages}
              isProcessing={isAgentProcessing}
            />
          </div>
        )}
      </div>

      {/* Input Box (Overlays at bottom) */}
      <InputBox onSubmit={handleMessageSubmit} isProcessing={isAgentProcessing} />
    </div>
  );
}

