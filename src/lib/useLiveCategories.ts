import { useEffect, useState } from "react";
import { categories as mockCategories, type Category } from "./data";
import { api, USE_LIVE_API, ApiError } from "./api";

export function useLiveCategories() {
  const [categories, setCategories] = useState<Category[]>(USE_LIVE_API ? [] : mockCategories);
  const [loading, setLoading] = useState(USE_LIVE_API);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!USE_LIVE_API) return;
    setLoading(true);
    setError(null);
    api.categories
      .list()
      .then(setCategories)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not load categories."))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}
