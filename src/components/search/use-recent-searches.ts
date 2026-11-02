"use client";

import { useEffect, useState } from "react";
import { clearRecentSearches, readRecentSearches, removeRecentSearch, subscribeRecentSearches } from "@/lib/recent-searches";

// The shopper's recent searches, kept up to date across components and browser tabs.
export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setSearches(readRecentSearches());
    sync();
    return subscribeRecentSearches(sync);
  }, []);
  return { searches, remove: removeRecentSearch, clear: clearRecentSearches };
}
