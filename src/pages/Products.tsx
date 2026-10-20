import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLiveProducts } from "../lib/useLiveProducts";
import { USE_LIVE_API } from "../lib/api";
import ProductCard from "../components/product/ProductCard";
import ProductFilters, { type Filters } from "../components/product/ProductFilters";

type SortKey = "newest" | "price-asc" | "price-desc" | "rating";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialTier = searchParams.get("tier") === "luxury" || searchParams.get("tier") === "affordable"
    ? (searchParams.get("tier") as "luxury" | "affordable")
    : "all";

  const [query, setQuery] = useState(() => searchParams.get("query") ?? "");
  const [sort, setSort] = useState<SortKey>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: null,
    tier: initialTier,
    maxPrice: 60000,
    inStockOnly: false,
  });

  // When live, the backend does the filtering/sorting/search itself —
  // these params map directly onto GET /api/products query params.
  const { products: source, loading } = useLiveProducts(
    USE_LIVE_API
      ? {
          query: query || undefined,
          category: filters.category ?? undefined,
          maxPrice: filters.maxPrice,
          luxuryOnly: filters.tier === "luxury" ? true : undefined,
          affordableOnly: filters.tier === "affordable" ? true : undefined,
          inStockOnly: filters.inStockOnly || undefined,
          sort,
          size: 60,
        }
      : {}
  );

  // On mock data, replicate the same filtering/sorting client-side (Phase 2-4 behavior).
  const results = useMemo(() => {
    if (USE_LIVE_API) return source;

    const q = query.trim().toLowerCase();

    let list = source.filter((p) => {
      const matchesQuery =
        !q ||
        [p.name, p.category, p.brand, p.material, p.sku, ...p.colors.map((c) => c.name)]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesCategory = !filters.category || p.category === filters.category;
      const matchesTier =
        filters.tier === "all" || (filters.tier === "luxury" ? p.isLuxury : !p.isLuxury);
      const matchesPrice = p.price <= filters.maxPrice;
      const matchesStock = !filters.inStockOnly || p.stockStatus === "In Stock";

      return matchesQuery && matchesCategory && matchesTier && matchesPrice && matchesStock;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    });

    return list;
  }, [source, query, filters, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col gap-2 mb-8">
        <span className="text-xs tracking-[0.2em] uppercase text-gold-deep">Catalog</span>
        <h1 className="font-display text-3xl md:text-4xl text-ink">All Products</h1>
      </div>

      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category, material, SKU…"
            className="w-full pl-10 pr-4 py-3 rounded-gk-sm border border-stone-200 bg-paper text-sm focus-visible:outline-gold"
            aria-label="Search products"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort products"
          className="px-4 py-3 rounded-gk-sm border border-stone-200 bg-paper text-sm text-ink focus-visible:outline-gold"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="md:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-gk-sm border border-stone-200 text-sm"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="flex gap-10">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <ProductFilters filters={filters} onChange={setFilters} resultCount={results.length} />
        </div>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-ivory p-6 overflow-y-auto md:hidden">
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-xl">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={22} />
              </button>
            </div>
            <ProductFilters filters={filters} onChange={setFilters} resultCount={results.length} />
          </div>
        )}

        {/* Results grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-stone-200 rounded-gk-lg animate-pulse" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
              <p className="font-display text-xl text-ink">No products match those filters</p>
              <p className="text-sm text-stone">Try widening the price range or clearing the category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
