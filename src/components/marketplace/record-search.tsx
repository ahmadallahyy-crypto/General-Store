"use client";

import { useEffect } from "react";
import { saveRecentSearch } from "@/lib/recent-searches";

// Remembers a search for "recently searched", but only when it found something, so typos and
// nonsense do not fill the shopper's history.
export function RecordSearch({ query, resultCount }: { query?: string; resultCount: number }) {
  useEffect(() => {
    if (query && resultCount > 0) saveRecentSearch(query);
  }, [query, resultCount]);
  return null;
}
