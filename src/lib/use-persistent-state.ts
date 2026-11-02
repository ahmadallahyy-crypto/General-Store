"use client";

import { useEffect, useState } from "react";

// ============================================================
// usePersistentState — localStorage-backed React state
// ============================================================

// Shares the read-on-mount / write-on-change persistence pattern used by the
// cart and wishlist providers:
// - On mount, read the stored JSON, parse it, and fall back to `initial` if the
//   payload is missing or corrupt (clearing the bad key so it can't fail again).
// - After hydration, write every change back to localStorage (guarded so a
//   quota/serialization error can't crash the app).
// Returns [value, setValue, isHydrated]; `isHydrated` is false until the mount
// read completes, so consumers can avoid hydration mismatches.
export function usePersistentState<T>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read once on mount.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(key);
        if (saved) setValue(JSON.parse(saved) as T);
      } catch {
        // Corrupted data or storage access error — drop the bad key.
        try {
          localStorage.removeItem(key);
        } catch {
          // Storage may be unavailable in the browser.
        }
      } finally {
        setIsHydrated(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [key]);

  // Persist on change, but only after hydration so we never overwrite a saved
  // value with the initial state during the first render.
  useEffect(() => {
    if (!isHydrated) return;
    try {
      // An empty value (null/undefined) removes the key, so "forget" / "sign out" leave nothing behind.
      if (value === null || value === undefined) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write failures (quota exceeded, storage disabled, etc.).
    }
  }, [key, value, isHydrated]);

  return [value, setValue, isHydrated];
}
