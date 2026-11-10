import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, X } from "lucide-react";
import { useLiveProducts } from "../../lib/useLiveProducts";
import { useLiveCategories } from "../../lib/useLiveCategories";
import { USE_LIVE_API } from "../../lib/api";

type SearchOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useLiveCategories();

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedQuery(input.trim()),
      USE_LIVE_API ? 250 : 0
    );
    return () => window.clearTimeout(timer);
  }, [input]);

  const query = debouncedQuery.toLowerCase();
  const { products, loading } = useLiveProducts(
    query ? { query: debouncedQuery, size: 10 } : {},
    Boolean(isOpen && query)
  );

  const results = useMemo(() => {
    if (!query) return [];

    const matches = USE_LIVE_API
      ? products
      : products.filter((product) =>
          [product.name, product.category, product.brand, product.material, product.sku]
            .join(" ")
            .toLowerCase()
            .includes(query)
        );

    return [...matches]
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aStarts = aName.startsWith(query);
        const bStarts = bName.startsWith(query);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return aName.indexOf(query) - bName.indexOf(query);
      })
      .slice(0, 8);
  }, [products, query]);

  useEffect(() => {
    if (!isOpen) {
      setInput("");
      setDebouncedQuery("");
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const goToProduct = (slug: string) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  const goToCategory = (slug: string) => {
    onClose();
    navigate(`/categories/${slug}`);
  };

  const viewAllResults = () => {
    if (!input.trim()) return;
    onClose();
    navigate(`/products?query=${encodeURIComponent(input.trim())}`);
  };

  if (!isOpen) return null;

  return (
    <div
      id="gk-search-dropdown"
      ref={dropdownRef}
      className="absolute inset-x-0 top-full z-[60] border-t border-stone-200/70 bg-paper shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            viewAllResults();
          }}
          className="flex h-14 sm:h-16 items-center gap-3 border-b border-stone-200"
        >
          <Search size={19} className="shrink-0 text-gold-deep" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Search furniture, lighting, decor..."
            aria-label="Search products and categories"
            autoComplete="off"
            className="gk-search-input min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-stone/70"
          />
          {input && (
            <button
              type="button"
              onClick={() => {
                setInput("");
                setDebouncedQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="gk-search-control shrink-0 px-1 py-2 text-xs font-medium text-stone hover:text-ink"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="gk-search-control shrink-0 rounded-full p-2 text-stone transition-colors hover:bg-ivory hover:text-ink"
          >
            <X size={19} />
          </button>
        </form>

        <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto overscroll-contain py-4 sm:max-h-[min(65vh,34rem)] sm:py-6">
          {!query ? (
            <section>
              <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-deep sm:text-xs">
                    Explore GK Design
                  </p>
                  <h3 className="mt-1 font-display text-lg text-ink sm:text-xl">
                    Browse categories
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/categories");
                  }}
                  className="gk-search-control inline-flex shrink-0 items-center gap-1 text-xs font-medium text-stone hover:text-gold-deep sm:text-sm"
                >
                  All categories <ArrowRight size={14} />
                </button>
              </div>

              {categoriesLoading && categories.length === 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="h-[76px] animate-pulse rounded-lg bg-stone-100 sm:h-36" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
                  {categories.map((category) => (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => goToCategory(category.slug)}
                      className="group flex min-w-0 items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-ivory sm:block sm:p-0"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-stone-100 sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-lg">
                        <img
                          src={category.image}
                          alt={category.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className="min-w-0 flex-1 text-xs font-medium leading-snug text-ink group-hover:text-gold-deep sm:mt-2 sm:block sm:px-1 sm:text-sm">
                        {category.name}
                      </span>
                      <ArrowRight size={14} className="shrink-0 text-stone sm:hidden" />
                    </button>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-deep sm:text-xs">
                  {loading ? "Searching..." : "Matching products"}
                </p>
                {!loading && results.length > 0 && (
                  <span className="text-xs text-stone">{results.length} suggestions</span>
                )}
              </div>

              {loading && results.length === 0 ? (
                <div className="space-y-3 py-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex animate-pulse items-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-stone-100" />
                      <div className="space-y-2">
                        <div className="h-3 w-40 rounded bg-stone-100" />
                        <div className="h-3 w-24 rounded bg-stone-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <ul className="divide-y divide-stone-100">
                  {results.map((product) => (
                    <li key={product.slug}>
                      <button
                        type="button"
                        onClick={() => goToProduct(product.slug)}
                        className="group flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-ivory/70 sm:gap-4 sm:px-2"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-stone-100 sm:h-14 sm:w-14">
                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink group-hover:text-gold-deep">
                            {product.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-stone">{product.category}</p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-ink sm:text-sm">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <ArrowRight size={15} className="mr-1 shrink-0 text-stone" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-8 text-center text-sm text-stone">
                  No products found for “{debouncedQuery}”. Try another name or category.
                </p>
              )}

              {results.length > 0 && (
                <button
                  type="button"
                  onClick={viewAllResults}
                  className="gk-search-control mt-3 flex w-full items-center justify-center gap-2 border-t border-stone-200 pt-4 text-sm font-medium text-gold-deep hover:text-ink"
                >
                  View all results <ArrowRight size={15} />
                </button>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
