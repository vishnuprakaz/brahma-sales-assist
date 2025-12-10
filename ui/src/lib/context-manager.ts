/**
 * UI Context Manager
 * 
 * Tracks all UI state and provides context to agents for intelligent responses.
 * Performance: <1ms event capture, <10ms serialization
 */

import type { UIContext, ContextUpdate, SelectedItem, UserAction, ViewportInfo } from '@/types/context';

class ContextManager {
  private context: UIContext;
  private listeners: Set<(context: UIContext) => void>;
  private actionBuffer: UserAction[];
  private maxActions: number = 10;

  constructor() {
    this.context = this.getInitialContext();
    this.listeners = new Set();
    this.actionBuffer = [];
    
    // Initialize viewport tracking
    this.initViewportTracking();
    
    // Restore from session storage if available
    this.restoreFromSession();
  }

  /**
   * Get initial context state
   */
  private getInitialContext(): UIContext {
    return {
      page: 'dashboard',
      view: 'default',
      selectedItems: [],
      lastSelectedItem: null,
      visibleData: null,
      filters: {},
      searchQuery: '',
      sortBy: null,
      sortOrder: null,
      recentActions: [],
      viewport: {
        scrollY: 0,
        scrollX: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        visibleArea: {
          top: 0,
          bottom: window.innerHeight,
          left: 0,
          right: window.innerWidth,
        },
      },
      componentStates: {},
      timestamp: Date.now(),
    };
  }

  /**
   * Initialize viewport tracking
   */
  private initViewportTracking() {
    // Track scroll position
    const handleScroll = () => {
      this.updateViewport({
        scrollY: window.scrollY,
        scrollX: window.scrollX,
      });
    };

    // Track window resize
    const handleResize = () => {
      this.updateViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        visibleArea: {
          top: window.scrollY,
          bottom: window.scrollY + window.innerHeight,
          left: window.scrollX,
          right: window.scrollX + window.innerWidth,
        },
      });
    };

    // Use passive listeners for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
  }

  /**
   * Update viewport information
   */
  private updateViewport(updates: Partial<ViewportInfo>) {
    this.context.viewport = {
      ...this.context.viewport,
      ...updates,
    };
  }

  /**
   * Get current context (main API for agents)
   */
  public getCurrentContext(): UIContext {
    return {
      ...this.context,
      timestamp: Date.now(),
    };
  }

  /**
   * Get serialized context for sending to agents
   */
  public getSerializedContext(): string {
    const startTime = performance.now();
    const serialized = JSON.stringify(this.getCurrentContext());
    const duration = performance.now() - startTime;
    
    // Log warning if serialization is slow
    if (duration > 10) {
      console.warn(`Context serialization took ${duration.toFixed(2)}ms (target: <10ms)`);
    }
    
    return serialized;
  }

  /**
   * Update context
   */
  public update(update: ContextUpdate) {
    const startTime = performance.now();
    
    switch (update.type) {
      case 'page':
        this.context.page = update.payload;
        this.recordAction('navigate', update.payload);
        break;
        
      case 'view':
        this.context.view = update.payload;
        break;
        
      case 'selection':
        this.updateSelection(update.payload);
        break;
        
      case 'data':
        this.context.visibleData = update.payload;
        break;
        
      case 'filter':
        this.context.filters = { ...this.context.filters, ...update.payload };
        this.recordAction('filter', update.payload);
        break;
        
      case 'search':
        this.context.searchQuery = update.payload;
        this.recordAction('search', update.payload);
        break;
        
      case 'action':
        this.recordAction(update.payload.type, update.payload.target, update.payload.metadata);
        break;
        
      case 'component':
        this.context.componentStates = { ...this.context.componentStates, ...update.payload };
        break;
    }
    
    this.context.timestamp = Date.now();
    
    const duration = performance.now() - startTime;
    if (duration > 1) {
      console.warn(`Context update took ${duration.toFixed(2)}ms (target: <1ms)`);
    }
    
    // Notify listeners
    this.notifyListeners();
    
    // Save to session storage (debounced)
    this.saveToSession();
  }

  /**
   * Update selection state
   */
  private updateSelection(payload: { items: SelectedItem[], mode: 'set' | 'add' | 'remove' | 'clear' }) {
    const { items, mode } = payload;
    
    switch (mode) {
      case 'set':
        this.context.selectedItems = items;
        this.context.lastSelectedItem = items[items.length - 1] || null;
        this.recordAction('select', `${items.length} items`);
        break;
        
      case 'add':
        this.context.selectedItems = [...this.context.selectedItems, ...items];
        this.context.lastSelectedItem = items[items.length - 1] || this.context.lastSelectedItem;
        this.recordAction('select', `added ${items.length} items`);
        break;
        
      case 'remove':
        const idsToRemove = new Set(items.map(item => item.id));
        this.context.selectedItems = this.context.selectedItems.filter(
          item => !idsToRemove.has(item.id)
        );
        this.recordAction('deselect', `removed ${items.length} items`);
        break;
        
      case 'clear':
        this.context.selectedItems = [];
        this.context.lastSelectedItem = null;
        this.recordAction('deselect', 'cleared all');
        break;
    }
  }

  /**
   * Record user action
   */
  private recordAction(type: string, target: string, metadata?: Record<string, any>) {
    const action: UserAction = {
      type,
      target,
      timestamp: Date.now(),
      metadata,
    };
    
    this.actionBuffer.push(action);
    
    // Keep only last N actions
    if (this.actionBuffer.length > this.maxActions) {
      this.actionBuffer.shift();
    }
    
    this.context.recentActions = [...this.actionBuffer];
  }

  /**
   * Subscribe to context changes
   */
  public subscribe(listener: (context: UIContext) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.getCurrentContext());
      } catch (error) {
        console.error('Error in context listener:', error);
      }
    });
  }

  /**
   * Save context to session storage
   */
  private saveToSessionDebounced: ReturnType<typeof setTimeout> | null = null;
  
  private saveToSession() {
    // Debounce saves to avoid excessive writes
    if (this.saveToSessionDebounced) {
      clearTimeout(this.saveToSessionDebounced);
    }
    
    this.saveToSessionDebounced = setTimeout(() => {
      try {
        const contextToSave = {
          page: this.context.page,
          view: this.context.view,
          filters: this.context.filters,
          searchQuery: this.context.searchQuery,
          componentStates: this.context.componentStates,
        };
        sessionStorage.setItem('ui-context', JSON.stringify(contextToSave));
      } catch (error) {
        console.error('Failed to save context to session:', error);
      }
    }, 500);
  }

  /**
   * Restore context from session storage
   */
  private restoreFromSession() {
    try {
      const saved = sessionStorage.getItem('ui-context');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.context = {
          ...this.context,
          ...parsed,
        };
      }
    } catch (error) {
      console.error('Failed to restore context from session:', error);
    }
  }

  /**
   * Clear all context
   */
  public clear() {
    this.context = this.getInitialContext();
    this.actionBuffer = [];
    sessionStorage.removeItem('ui-context');
    this.notifyListeners();
  }

  /**
   * Get context summary for debugging
   */
  public getSummary(): string {
    return `Page: ${this.context.page}, View: ${this.context.view}, Selected: ${this.context.selectedItems.length}, Actions: ${this.context.recentActions.length}`;
  }
}

// Export singleton instance
export const contextManager = new ContextManager();

// Export class for testing
export { ContextManager };

