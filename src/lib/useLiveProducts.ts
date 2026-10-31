import { useEffect, useState } from "react";
import { allProducts, type Product } from "./data";
import { api, USE_LIVE_API, ApiError } from "./api";

type ProductParams = Record<string, string | number | boolean | undefined>;

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const CACHE_TIME = 60_000;

const productLists = new Map<string, CacheEntry<Product[]>>();
const pendingProductLists = new Map<string, Promise<Product[]>>();
const productDetails = new Map<string, CacheEntry<Product>>();
const pendingProductDetails = new Map<string, Promise<Product>>();

function getParamsKey(params: ProductParams): string {
  return JSON.stringify(
    Object.entries(params).sort(([left], [right]) => left.localeCompare(right))
  );
}

function fetchProductList(params: ProductParams): Promise<Product[]> {
  const key = getParamsKey(params);
  const cached = productLists.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.value);
  }

  const pending = pendingProductLists.get(key);
  if (pending) return pending;

  const request = api.products
    .list(params)
    .then((response) => {
      productLists.set(key, {
        value: response.items,
        expiresAt: Date.now() + CACHE_TIME,
      });
      return response.items;
    })
    .finally(() => {
      pendingProductLists.delete(key);
    });

  pendingProductLists.set(key, request);
  return request;
}

function fetchProductDetail(slug: string): Promise<Product> {
  const cached = productDetails.get(slug);

  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.value);
  }

  const pending = pendingProductDetails.get(slug);
  if (pending) return pending;

  const request = api.products
    .getBySlug(slug)
    .then((product) => {
      productDetails.set(slug, {
        value: product,
        expiresAt: Date.now() + CACHE_TIME,
      });
      return product;
    })
    .finally(() => {
      pendingProductDetails.delete(slug);
    });

  pendingProductDetails.set(slug, request);
  return request;
}

/** Call after a product is created, edited, published, unpublished, or deleted. */
export function invalidateProductCache(): void {
  productLists.clear();
  productDetails.clear();
}

/** Fetches public products once per query and reuses the result for 60 seconds. */
export function useLiveProducts(
  params: ProductParams = {},
  enabled = true
) {
  const paramsKey = getParamsKey(params);
  const [products, setProducts] = useState<Product[]>(() => {
    if (!USE_LIVE_API) return allProducts;
    return productLists.get(paramsKey)?.value ?? [];
  });
  const [loading, setLoading] = useState(() => {
    if (!USE_LIVE_API || !enabled) return false;
    const cached = productLists.get(paramsKey);
    return !cached || cached.expiresAt <= Date.now();
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!USE_LIVE_API) {
      setProducts(allProducts);
      setLoading(false);
      setError(null);
      return;
    }

    if (!enabled) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    const cached = productLists.get(paramsKey);

    if (cached) {
      // Show cached content immediately. If expired, refresh it in background.
      setProducts(cached.value);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);

    fetchProductList(params)
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof ApiError
              ? cause.message
              : "Could not load products."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // paramsKey represents the complete request parameters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, enabled]);

  return { products, loading, error };
}

/** Single-product variant for the Product Detail page. */
export function useLiveProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | undefined>(() => {
    if (!USE_LIVE_API) return allProducts.find((item) => item.slug === slug);
    return slug ? productDetails.get(slug)?.value : undefined;
  });
  const [loading, setLoading] = useState(() => Boolean(USE_LIVE_API && slug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProduct(undefined);
      setLoading(false);
      setError(null);
      return;
    }

    if (!USE_LIVE_API) {
      setProduct(allProducts.find((item) => item.slug === slug));
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    const cached = productDetails.get(slug);

    if (cached) {
      setProduct(cached.value);
      setLoading(false);
    } else {
      setProduct(undefined);
      setLoading(true);
    }
    setError(null);

    fetchProductDetail(slug)
      .then((result) => {
        if (active) setProduct(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof ApiError
              ? cause.message
              : "Product not found."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return { product, loading, error };
}
