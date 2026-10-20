import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "gk_wishlist";

// useSyncExternalStore requires getSnapshot() to return a STABLE reference
// when the underlying data hasn't changed — returning a freshly-parsed
// array every call (even with identical contents) makes React think the
// store never stabilizes, which throws and crashes the whole page. This
// cached array is the fix: it only gets replaced when the data actually
// changes (via writeSlugs or an external 'storage' event from another tab).
let cachedSlugs: string[] = readFromStorage();

function readFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function getSnapshot(): string[] {
  return cachedSlugs;
}

function writeSlugs(slugs: string[]) {
  cachedSlugs = slugs; // new reference — this is a real, intentional change
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // storage unavailable (private browsing etc.) — fail silently
  }
  // Let every other component using the wishlist know it changed, since
  // localStorage writes don't fire a 'storage' event in the same tab.
  window.dispatchEvent(new Event("gk_wishlist_change"));
}

function subscribe(callback: () => void) {
  // Cross-tab changes arrive as a native 'storage' event — re-sync the
  // cache from localStorage before notifying, since another tab wrote it.
  const onStorage = () => {
    cachedSlugs = readFromStorage();
    callback();
  };
  window.addEventListener("gk_wishlist_change", callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("gk_wishlist_change", callback);
    window.removeEventListener("storage", onStorage);
  };
}

/** Whole-list view — used on the Wishlist page. */
export function useWishlist() {
  const slugs = useSyncExternalStore(subscribe, getSnapshot, () => []);

  const remove = useCallback((slug: string) => {
    writeSlugs(cachedSlugs.filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => {
    writeSlugs([]);
  }, []);

  return { slugs, remove, clear };
}

/** Single-product view — used on ProductCard and ProductDetail for the heart toggle. */
export function useIsWishlisted(slug: string) {
  const [isWishlisted, setIsWishlisted] = useState(() => cachedSlugs.includes(slug));

  useEffect(() => {
    const sync = () => setIsWishlisted(cachedSlugs.includes(slug));
    sync();
    window.addEventListener("gk_wishlist_change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gk_wishlist_change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  const toggle = useCallback(() => {
    const next = cachedSlugs.includes(slug)
      ? cachedSlugs.filter((s) => s !== slug)
      : [...cachedSlugs, slug];
    writeSlugs(next);
  }, [slug]);

  return { isWishlisted, toggle };
}
