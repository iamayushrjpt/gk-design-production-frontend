import { useEffect, useState } from "react";
import { categories as mockCategories, type Category } from "./data";
import { api, USE_LIVE_API, ApiError } from "./api";

type CategoryCache = {
  items: Category[];
  expiresAt: number;
};

const CACHE_TIME = 60_000;
let categoryCache: CategoryCache | null = null;
let pendingCategoryRequest: Promise<Category[]> | null = null;

function fetchCategories(): Promise<Category[]> {
  if (categoryCache && categoryCache.expiresAt > Date.now()) {
    return Promise.resolve(categoryCache.items);
  }

  if (pendingCategoryRequest) return pendingCategoryRequest;

  pendingCategoryRequest = api.categories
    .list()
    .then((items) => {
      categoryCache = {
        items,
        expiresAt: Date.now() + CACHE_TIME,
      };
      return items;
    })
    .finally(() => {
      pendingCategoryRequest = null;
    });

  return pendingCategoryRequest;
}

/** Call after a category is created, edited, hidden, or deleted. */
export function invalidateCategoryCache(): void {
  categoryCache = null;
}

/** Shares the public category request between all components for 60 seconds. */
export function useLiveCategories() {
  const [categories, setCategories] = useState<Category[]>(() => {
    if (!USE_LIVE_API) return mockCategories;
    return categoryCache?.items ?? [];
  });
  const [loading, setLoading] = useState(() => {
    if (!USE_LIVE_API) return false;
    return !categoryCache || categoryCache.expiresAt <= Date.now();
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!USE_LIVE_API) {
      setCategories(mockCategories);
      setLoading(false);
      return;
    }

    let active = true;
    const cached = categoryCache;

    if (cached) {
      setCategories(cached.items);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);

    fetchCategories()
      .then((items) => {
        if (active) setCategories(items);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof ApiError
              ? cause.message
              : "Could not load categories."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { categories, loading, error };
}
