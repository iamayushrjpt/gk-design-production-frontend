import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "gk_recently_viewed";
const MAX_ITEMS = 8;

function readStoredSlugs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(readStoredSlugs());
  }, []);

  const markViewed = useCallback((slug: string) => {
    const current = readStoredSlugs().filter((s) => s !== slug);
    const next = [slug, ...current].slice(0, MAX_ITEMS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable (private browsing etc.) — fail silently
    }
    setSlugs(next);
  }, []);

  return { slugs, markViewed };
}
