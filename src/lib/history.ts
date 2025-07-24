'use client';

import type { SearchHistoryItem } from './types';

const HISTORY_KEY = 'jobSearchHistory';
const MAX_HISTORY_ITEMS = 10;

export const getSearchHistory = (): SearchHistoryItem[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Could not retrieve search history:', error);
    return [];
  }
};

export const saveSearchToHistory = (search: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => {
  try {
    const history = getSearchHistory();
    const newHistoryItem: SearchHistoryItem = {
      ...search,
      id: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [newHistoryItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    
    // Dispatch a custom event to notify other components on the same page
    window.dispatchEvent(new Event('historyUpdated'));

  } catch (error) {
    console.error('Could not save search to history:', error);
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
     // Dispatch a custom event to notify other components on the same page
    window.dispatchEvent(new Event('historyUpdated'));
  } catch (error) {
    console.error('Could not clear search history:', error);
  }
};
