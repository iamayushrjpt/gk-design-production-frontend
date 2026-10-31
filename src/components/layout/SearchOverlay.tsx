import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search as SearchIcon } from "lucide-react";
import { useLiveProducts } from "../../lib/useLiveProducts";
import { USE_LIVE_API } from "../../lib/api";

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Debounce so live mode doesn't fire a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(input), USE_LIVE_API ? 300 : 0);
    return () => clearTimeout(timer);
  }, [input]);

  const { products, loading } = useLiveProducts(
    debouncedQuery.trim()
      ? (USE_LIVE_API ? { query: debouncedQuery.trim(), size: 6 } : {})
      : {},
    Boolean(isOpen && debouncedQuery.trim())
  );

  // On mock data, filtering has to happen client-side since useLiveProducts
  // ignores params when not live — mirrors the same search fields Products.tsx uses.
  const results = (() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    if (USE_LIVE_API) return products.slice(0, 6);
    return products
      .filter((p) =>
        [p.name, p.category, p.brand, p.material, p.sku].join(" ").toLowerCase().includes(q)
      )
      .slice(0, 6);
  })();

  useEffect(() => {
    if (isOpen) {
      // Focus after the open animation/mount, and reset state each time it opens.
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInput("");
      setDebouncedQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const goToProduct = (slug: string) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  const viewAllResults = () => {
    onClose();
    navigate(`/products?query=${encodeURIComponent(input.trim())}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-ink/50 flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div
        className="bg-paper rounded-gk-lg w-full max-w-xl shadow-gk-lift overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) viewAllResults();
          }}
          className="flex items-center gap-3 px-5 py-4 border-b border-stone-200"
        >
          <SearchIcon size={18} className="text-stone shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search products, categories, materials…"
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="text-stone hover:text-ink">
            <X size={18} />
          </button>
        </form>

        <div className="max-h-96 overflow-y-auto">
          {!debouncedQuery.trim() ? (
            <p className="px-5 py-8 text-center text-sm text-stone">Start typing to search the catalog.</p>
          ) : loading ? (
            <p className="px-5 py-8 text-center text-sm text-stone">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-stone">No products match "{debouncedQuery}".</p>
          ) : (
            <ul>
              {results.map((product) => (
                <li key={product.slug}>
                  <button
                    onClick={() => goToProduct(product.slug)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-ivory transition-colors text-left"
                  >
                    <img src={product.images[0]} alt="" className="w-10 h-10 rounded-gk-sm object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{product.name}</p>
                      <p className="text-xs text-stone">{product.category}</p>
                    </div>
                    <span className="text-sm text-ink shrink-0">₹{product.price.toLocaleString("en-IN")}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {debouncedQuery.trim() && results.length > 0 && (
          <button
            onClick={viewAllResults}
            className="w-full text-center text-sm text-gold-deep hover:text-ink px-5 py-3 border-t border-stone-200 transition-colors"
          >
            View all results for "{input}"
          </button>
        )}
      </div>
    </div>
  );
}
