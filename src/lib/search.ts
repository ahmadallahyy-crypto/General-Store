import { SEARCH_SYNONYMS } from "@/data/search-synonyms";

// ============================================================
// SEARCH ENGINE (pure functions, no React, no data imports)
// ------------------------------------------------------------
// How a search works:
//  1. The query is split into words ("red hoodie" -> red, hoodie). EVERY word has to match.
//  2. A word matches a product word if it is the same, starts it, sits inside it ("phone" in
//     "smartphone"), is a known synonym ("tee" ~ "shirt"), or is one typo away ("hodie" ~ "hoodie").
//  3. Each match is worth more in the title than in the description. Matches are added up and the
//     best-scoring products come first (relevance).
// To move to a real search service (Postgres full-text, Meilisearch, Algolia ...), keep the same
// function names and replace the insides. The pages do not need to change.
// ============================================================

export type Searchable = {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  highlights?: string[];
};

type Options<T> = {
  extraText?: (item: T) => string;
  /** Ignore words weaker than this (3 = title, category and brand/seller only). */
  minWeight?: number;
};

const WEIGHT = { title: 6, category: 3, extra: 3, subcategory: 2, highlights: 2, description: 1 } as const;

export const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Very small plural handling: shirts -> shirt, hoodies -> hoodie, glasses -> glass.
// (battery / batterie style spellings are bridged in scoreToken.)
export function stem(word: string): string {
  if (word.length <= 3) return word;
  if (/(ses|xes|ches|shes)$/.test(word)) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us")) return word.slice(0, -1);
  return word;
}

const rawWords = (text: string) => normalize(text).split(/[^a-z0-9]+/).filter(Boolean);
export const tokenize = (text: string) => rawWords(text).map(stem);

// stem -> every other stem in its synonym group
const synonymMap = new Map<string, Set<string>>();
for (const group of SEARCH_SYNONYMS) {
  const stems = group.map((word) => stem(normalize(word)));
  for (const s of stems) {
    const set = synonymMap.get(s) ?? new Set<string>();
    stems.forEach((other) => other !== s && set.add(other));
    synonymMap.set(s, set);
  }
}

// How many typos we forgive depends on word length (short words must match exactly).
const maxTypos = (word: string) => (word.length >= 9 ? 2 : word.length >= 5 ? 1 : 0);

// "Did you mean" can forgive more than matching does, because it only runs when nothing was found.
const suggestionLimit = (word: string) => (word.length >= 8 ? 3 : word.length >= 5 ? 2 : word.length === 4 ? 1 : 0);

// Edit distance that counts a swap of two neighbouring letters as one typo; gives up above `limit`.
function editDistance(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  const rows: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
    }
  }
  return rows[a.length][b.length];
}

type Indexed = { words: Map<string, number>; title: string };
const cache = new Map<string, Indexed>();

function indexOf(item: Searchable, extra: string): Indexed {
  const key = `${item.id}|${extra}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const words = new Map<string, number>();
  const add = (text: string | undefined, weight: number) => {
    if (!text) return;
    for (const word of tokenize(text)) if ((words.get(word) ?? 0) < weight) words.set(word, weight);
  };
  add(item.title, WEIGHT.title);
  add(item.category, WEIGHT.category);
  add(extra, WEIGHT.extra);
  add(item.subcategory, WEIGHT.subcategory);
  add(item.highlights?.join(" "), WEIGHT.highlights);
  add(item.description, WEIGHT.description);
  const indexed = { words, title: normalize(item.title) };
  cache.set(key, indexed);
  return indexed;
}

// Score of one query word against one product (0 = no match).
// "battery" and "batterie" (from batteries) are the same word.
const spellingVariants = (word: string) => (word.endsWith("y") ? [`${word.slice(0, -1)}ie`] : word.endsWith("ie") ? [`${word.slice(0, -2)}y`] : []);

function scoreToken(token: string, words: Map<string, number>, minWeight = 0): number {
  const options: [string, number][] = [
    [token, 1],
    ...spellingVariants(token).map((v): [string, number] => [v, 1]),
    ...[...(synonymMap.get(token) ?? [])].map((s): [string, number] => [s, 0.8]),
  ];
  let best = 0;
  for (const [candidate, factor] of options) {
    for (const [word, weight] of words) {
      if (weight < minWeight) continue;
      let score = 0;
      if (word === candidate) score = 1;
      else if (candidate.length >= 3 && word.startsWith(candidate)) score = 0.9;
      else if (candidate.length >= 4 && word.includes(candidate)) score = 0.7;
      else if (factor === 1 && maxTypos(candidate) > 0 && editDistance(word, candidate, maxTypos(candidate)) <= maxTypos(candidate)) score = 0.5;
      if (score) best = Math.max(best, score * weight * factor);
    }
  }
  return best;
}

/** Products that match every word of the query, best match first. An empty query returns the list untouched. */
export function searchProducts<T extends Searchable>(items: T[], query: string, options: Options<T> = {}): T[] {
  const tokens = [...new Set(tokenize(query))];
  if (!tokens.length) return items;
  const phrase = normalize(query).trim();
  const scored: { item: T; total: number; order: number }[] = [];
  items.forEach((item, order) => {
    const index = indexOf(item, options.extraText?.(item) ?? "");
    let total = 0;
    for (const token of tokens) {
      const score = scoreToken(token, index.words, options.minWeight);
      if (!score) return; // every word must match
      total += score;
    }
    if (index.title.includes(phrase)) total += 5; // the whole phrase appears in the title
    scored.push({ item, total, order });
  });
  return scored.sort((a, b) => b.total - a.total || a.order - b.order).map((entry) => entry.item);
}

/** A few matching products to show while the shopper is typing. */
export function suggestProducts<T extends Searchable>(items: T[], query: string, limit = 5, options: Options<T> = {}): T[] {
  // Suggestions only look at title / category / brand / seller, so typing "blen" does not offer a jacket described as a "cotton blend".
  return query.trim() ? searchProducts(items, query, { ...options, minWeight: 3 }).slice(0, limit) : [];
}

/** "Did you mean ...?" for a search that found nothing: fixes the mistyped word(s) using words from the catalogue. */
export function didYouMean<T extends Searchable>(items: T[], query: string, options: Options<T> = {}): string | null {
  const vocabulary = new Map<string, string>(); // stem -> readable word
  for (const item of items) {
    const extra = options.extraText?.(item) ?? "";
    for (const text of [item.title, item.category, extra]) for (const word of rawWords(text)) vocabulary.set(stem(word), word);
  }
  const words = rawWords(query);
  let changed = false;
  const fixed = words.map((word) => {
    const s = stem(word);
    if (vocabulary.has(s) || synonymMap.has(s) || [...vocabulary.keys()].some((v) => v.startsWith(s) || (s.length >= 4 && v.includes(s)))) return word;
    const limit = suggestionLimit(s);
    if (!limit) return word;
    let best: { word: string; distance: number } | null = null;
    for (const [candidateStem, readable] of vocabulary) {
      const distance = editDistance(candidateStem, s, limit);
      if (distance <= limit && (!best || distance < best.distance)) best = { word: readable, distance };
    }
    if (best) changed = true;
    return best ? best.word : word;
  });
  if (!changed) return null;
  const suggestion = fixed.join(" ");
  return searchProducts(items, suggestion, options).length > 0 ? suggestion : null;
}
