'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Trash2, ExternalLink } from 'lucide-react';
import type { SearchHistoryItem } from '@/lib/types';
import { clearSearchHistory, getSearchHistory } from '@/lib/history';
import { useSidebar } from './ui/sidebar';

export function RecentSearches() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const { setOpenMobile } = useSidebar();

  const loadHistory = () => {
    setHistory(getSearchHistory());
  };

  useEffect(() => {
    loadHistory();
    const handleStorageChange = () => {
      loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event to trigger update from the same tab
    window.addEventListener('historyUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('historyUpdated', handleStorageChange);
    };
  }, []);

  const handleClearHistory = () => {
    clearSearchHistory();
    setHistory([]);
  };

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <div className="flex flex-col h-full p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-sm font-medium text-sidebar-foreground/70 flex items-center gap-2">
          <History className="w-4 h-4" />
          History
        </h3>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleClearHistory}
            title="Clear History"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        {history.length === 0 ? (
          <p className="text-xs text-sidebar-foreground/50 text-center p-4">
            Your past searches will appear here.
          </p>
        ) : (
          <div className="space-y-1">
            {history.map((item) => (
              <Link
                key={item.id}
                href={`/?historyJobTitle=${encodeURIComponent(item.jobTitle)}&historyAddress=${encodeURIComponent(item.address)}`}
                passHref
                onClick={handleLinkClick}
                className="block"
              >
                <div className="group flex justify-between items-center p-2 rounded-md hover:bg-sidebar-accent">
                  <div>
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {item.jobTitle}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {item.address}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-mono bg-sidebar-accent/50 group-hover:bg-background rounded-md px-1.5 py-0.5 mr-2">
                      {item.resultsCount}
                    </span>
                     <ExternalLink className="w-3 h-3 text-sidebar-foreground/40 group-hover:text-sidebar-accent-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
