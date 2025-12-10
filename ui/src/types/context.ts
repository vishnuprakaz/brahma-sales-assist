/**
 * UI Context Types
 * 
 * Defines the structure of UI context that gets tracked and sent to agents
 */

export interface SelectedItem {
  type: string;           // "lead", "contact", "deal", etc.
  id: string;             // Unique identifier
  data: Record<string, any>; // Full item data
}

export interface ViewportInfo {
  scrollY: number;
  scrollX: number;
  width: number;
  height: number;
  visibleArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface UserAction {
  type: string;           // "click", "select", "navigate", "search", etc.
  target: string;         // What was acted upon
  timestamp: number;      // When it happened
  metadata?: Record<string, any>; // Additional context
}

export interface UIContext {
  // Current page and view
  page: string;           // "dashboard", "leads", "settings", etc.
  view: string;           // "table", "cards", "detail", "list", etc.
  
  // Selection state
  selectedItems: SelectedItem[];
  lastSelectedItem: SelectedItem | null;
  
  // Visible data
  visibleData: {
    items: any[];         // Currently visible items
    totalCount: number;   // Total items available
    type: string;         // Type of data being displayed
  } | null;
  
  // Filters and search
  filters: Record<string, any>;
  searchQuery: string;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc' | null;
  
  // Recent actions (last 10)
  recentActions: UserAction[];
  
  // Viewport information
  viewport: ViewportInfo;
  
  // Component states
  componentStates: Record<string, any>;
  
  // Timestamp
  timestamp: number;
}

export interface ContextUpdate {
  type: 'page' | 'view' | 'selection' | 'data' | 'filter' | 'search' | 'action' | 'viewport' | 'component';
  payload: any;
}

