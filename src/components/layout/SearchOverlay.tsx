
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

export default function SearchOverlay({
  isOpen,
  onClose,
}: SearchOverlayProps) {
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { categories } = useLiveCategories();

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

    const matching = USE_LIVE_API
      ? products
      : products.filter((product) =>
          [
            product.name,
            product.category,
            product.brand,
            product.material,
            product.sku,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
        );

    return [...matching]
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

  // Focus the search input when the dropdown opens.
  useEffect(() => {
    if (!isOpen) {
      setInput("");
      setDebouncedQuery("");
      return;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // Close when clicking outside the dropdown.
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
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
      ref={dropdownRef}
      className="absolute left-0 right-0 top-full z-[60]
        border-t border-stone-200/70 bg-paper
        shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Minimal search field */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            viewAllResults();
          }}
          className="flex items-center gap-4 border-b
            border-stone-200 py-5"
        >
          <Search size={20} className="shrink-0 text-gold-deep" />

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Search furniture, lighting, decor..."
            autoComplete="off"
            className="min-w-0 flex-1 border-0 bg-transparent
              text-base text-ink outline-none ring-0
              placeholder:text-stone/70 focus:outline-none
              focus:ring-0"
          />

          {input && (
            <button
              type="button"
              onClick={() => {
                setInput("");
                setDebouncedQuery("");
                inputRef.current?.focus();
              }}
              className="text-xs text-stone hover:text-ink"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-full p-2 text-stone
              transition-colors hover:bg-ivory hover:text-ink"
          >
            <X size={19} />
          </button>
        </form>

        <div className="max-h-[65vh] overflow-y-auto py-6">
          {!query ? (
            /* Show every category when search is empty */
            <section>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase
                    tracking-[0.2em] text-gold-deep">
                    Explore
                  </p>
                  <h3 className="mt-1 font-display text-xl text-ink">
                    Browse all categories
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/categories");
                  }}
                  className="flex items-center gap-2 text-xs
                    font-medium text-stone hover:text-gold-deep"
                >
                  View all <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3
                md:grid-cols-4 lg:grid-cols-6">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => goToCategory(category.slug)}
                    className="group text-left"
                  >
                    <div className="aspect-[4/3] overflow-hidden
                      rounded-lg bg-stone-100">
                      <img
                        src={category.image}
                        alt={category.name}
                        loading="lazy"
                        className="h-full w-full object-cover
                          transition-transform duration-300
                          group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-2 flex items-center
                      justify-between gap-2">
                      <span className="text-sm font-medium
                        text-ink group-hover:text-gold-deep">
                        {category.name}
                      </span>
                      <ArrowRight
                        size={14}
                        className="shrink-0 text-stone
                          transition-transform
                          group-hover:translate-x-1"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            /* Product suggestions while typing */
            <section>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase
                  tracking-[0.2em] text-gold-deep">
                  {loading ? "Searching..." : "Suggested products"}
                </p>

                {!loading && results.length > 0 && (
                  <span className="text-xs text-stone">
                    {results.length} results
                  </span>
                )}
              </div>

              {loading && results.length === 0 ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 animate-pulse"
                    >
                      <div className="h-14 w-14 rounded-md bg-stone-200" />
                      <div className="space-y-2">
                        <div className="h-3 w-40 rounded bg-stone-200" />
                        <div className="h-3 w-24 rounded bg-stone-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {results.map((product) => (
                    <button
                      key={product.slug}
                      type="button"
                      onClick={() => goToProduct(product.slug)}
                      className="group flex w-full items-center gap-4
                        py-3 text-left transition-colors
                        hover:bg-ivory/70"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden
                        rounded-md bg-stone-100">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover
                            transition-transform duration-300
                            group-hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium
                          text-ink group-hover:text-gold-deep">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-stone">
                          {product.category}
                        </p>
                      </div>

                      <span className="shrink-0 text-sm font-medium text-ink">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      <ArrowRight
                        size={16}
                        className="mr-2 shrink-0 text-stone
                          group-hover:text-gold-deep"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-stone">
                  No products found for "{debouncedQuery}".
                </p>
              )}

              {results.length > 0 && (
                <button
                  type="button"
                  onClick={viewAllResults}
                  className="mt-4 flex w-full items-center
                    justify-center gap-2 border-t border-stone-200
                    pt-4 text-sm font-medium text-gold-deep
                    hover:text-ink"
                >
                  View all results for "{input.trim()}"
                  <ArrowRight size={15} />
                </button>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
