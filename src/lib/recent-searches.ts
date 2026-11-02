// Recent searches, kept in THIS browser only (localStorage).
// Rules: newest first, max 8, same search (ignoring capitals and extra spaces) is stored once, and the
// caller should only save a search that actually found something (see RecordSearch).
// When accounts exist, the same list can also be saved against the signed-in user on the server.

const KEY = "generalstore-recent-searches";
const EVENT = "generalstore-recent-searches-changed";
const MAX = 8;
const MAX_LENGTH = 60;

export const cleanQuery = (query: string) => query.trim().replace(/\s+/g, " ").slice(0, MAX_LENGTH);

export function readRecentSearches(): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((v): v is string => typeof v === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  try {
    if (list.length) window.localStorage.setItem(KEY, JSON.stringify(list));
    else window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT)); // tells other parts of this tab; other tabs get the native "storage" event
  } catch {}
}

export function saveRecentSearch(query: string) {
  const q = cleanQuery(query);
  if (q.length < 2) return;
  write([q, ...readRecentSearches().filter((s) => s.toLowerCase() !== q.toLowerCase())].slice(0, MAX));
}

export function removeRecentSearch(term: string) {
  write(readRecentSearches().filter((s) => s.toLowerCase() !== term.toLowerCase()));
}

export function clearRecentSearches() {
  write([]);
}

/** Calls `onChange` whenever the list changes in this tab or in another tab. Returns an unsubscribe function. */
export function subscribeRecentSearches(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVENT, onChange);
  };
}
