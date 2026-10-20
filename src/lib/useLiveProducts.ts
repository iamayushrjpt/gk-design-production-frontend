import { useEffect, useState } from "react";
import { allProducts, type Product } from "./data";
import { api, USE_LIVE_API, ApiError } from "./api";

/**
 * Fetches products from the live backend when VITE_API_BASE_URL is set,
 * otherwise resolves instantly with the Phase 2-4 mock catalog. Every public
 * page should read products through this hook rather than importing
 * `allProducts` directly, so the whole public site flips to live data the
 * same way the admin panel already does.
 */
export function useLiveProducts(params: Record<string, string | number | boolean | undefined> = {}) {
  const [products, setProducts] = useState<Product[]>(USE_LIVE_API ? [] : allProducts);
  const [loading, setLoading] = useState(USE_LIVE_API);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    if (!USE_LIVE_API) return;
    setLoading(true);
    setError(null);
    api.products
      .list(params)
      .then((res) => setProducts(res.items))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not load products."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return { products, loading, error };
}

/** Single-product variant for the Product Detail page. */
export function useLiveProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | undefined>(
    USE_LIVE_API ? undefined : allProducts.find((p) => p.slug === slug)
  );
  const [loading, setLoading] = useState(USE_LIVE_API);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    if (!USE_LIVE_API) {
      setProduct(allProducts.find((p) => p.slug === slug));
      return;
    }
    setLoading(true);
    setError(null);
    api.products
      .getBySlug(slug)
      .then(setProduct)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Product not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}
