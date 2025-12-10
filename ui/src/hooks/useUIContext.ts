/**
 * React Hook for UI Context Manager
 * 
 * Provides easy access to context manager from React components
 */

import { useEffect, useState, useCallback } from 'react';
import { contextManager } from '@/lib/context-manager';
import type { UIContext, ContextUpdate, SelectedItem } from '@/types/context';

/**
 * Hook to access current UI context
 */
export function useUIContext() {
  const [context, setContext] = useState<UIContext>(contextManager.getCurrentContext());

  useEffect(() => {
    // Subscribe to context changes
    const unsubscribe = contextManager.subscribe((newContext) => {
      setContext(newContext);
    });

    return unsubscribe;
  }, []);

  return context;
}

/**
 * Hook to update UI context
 */
export function useContextUpdate() {
  const update = useCallback((contextUpdate: ContextUpdate) => {
    contextManager.update(contextUpdate);
  }, []);

  return update;
}

/**
 * Hook for page tracking
 */
export function usePageContext(pageName: string) {
  const updateContext = useContextUpdate();

  useEffect(() => {
    updateContext({ type: 'page', payload: pageName });
  }, [pageName, updateContext]);
}

/**
 * Hook for selection management
 */
export function useSelection() {
  const context = useUIContext();
  const updateContext = useContextUpdate();

  const select = useCallback((items: SelectedItem[], mode: 'set' | 'add' | 'remove' | 'clear' = 'set') => {
    updateContext({
      type: 'selection',
      payload: { items, mode },
    });
  }, [updateContext]);

  const clearSelection = useCallback(() => {
    updateContext({
      type: 'selection',
      payload: { items: [], mode: 'clear' },
    });
  }, [updateContext]);

  return {
    selectedItems: context.selectedItems,
    lastSelectedItem: context.lastSelectedItem,
    select,
    clearSelection,
  };
}

/**
 * Hook for search and filters
 */
export function useSearchAndFilters() {
  const context = useUIContext();
  const updateContext = useContextUpdate();

  const setSearch = useCallback((query: string) => {
    updateContext({
      type: 'search',
      payload: query,
    });
  }, [updateContext]);

  const setFilters = useCallback((filters: Record<string, any>) => {
    updateContext({
      type: 'filter',
      payload: filters,
    });
  }, [updateContext]);

  return {
    searchQuery: context.searchQuery,
    filters: context.filters,
    setSearch,
    setFilters,
  };
}

/**
 * Hook for tracking visible data
 */
export function useVisibleData(data: any[], type: string, totalCount?: number) {
  const updateContext = useContextUpdate();

  useEffect(() => {
    updateContext({
      type: 'data',
      payload: {
        items: data,
        totalCount: totalCount ?? data.length,
        type,
      },
    });
  }, [data, type, totalCount, updateContext]);
}

/**
 * Hook for recording user actions
 */
export function useActionRecorder() {
  const updateContext = useContextUpdate();

  const recordAction = useCallback((type: string, target: string, metadata?: Record<string, any>) => {
    updateContext({
      type: 'action',
      payload: { type, target, metadata },
    });
  }, [updateContext]);

  return recordAction;
}

/**
 * Hook for component state tracking
 */
export function useComponentState(componentId: string, initialState?: any) {
  const context = useUIContext();
  const updateContext = useContextUpdate();
  
  const componentState = context.componentStates[componentId] || initialState;

  const setComponentState = useCallback((state: any) => {
    updateContext({
      type: 'component',
      payload: { [componentId]: state },
    });
  }, [componentId, updateContext]);

  return [componentState, setComponentState] as const;
}

