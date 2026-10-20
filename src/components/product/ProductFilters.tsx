import { categories } from "../../lib/data";

export type Filters = {
  category: string | null;
  tier: "all" | "luxury" | "affordable";
  maxPrice: number;
  inStockOnly: boolean;
};

const PRICE_CEILING = 60000;

interface ProductFiltersProps {
  filters: Filters;
  onChange: (next: Filters) => void;
  resultCount: number;
}

export default function ProductFilters({ filters, onChange, resultCount }: ProductFiltersProps) {
  return (
    <aside className="flex flex-col gap-8 w-full md:w-64 shrink-0">
      <div>
        <h3 className="text-xs uppercase tracking-wide text-stone mb-3">Category</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onChange({ ...filters, category: null })}
            className={`text-left text-sm py-1 transition-colors ${
              filters.category === null ? "text-gold-deep font-medium" : "text-ink hover:text-gold-deep"
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => onChange({ ...filters, category: c.name })}
              className={`text-left text-sm py-1 transition-colors ${
                filters.category === c.name ? "text-gold-deep font-medium" : "text-ink hover:text-gold-deep"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-wide text-stone mb-3">Tier</h3>
        <div className="flex gap-2">
          {(["all", "luxury", "affordable"] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => onChange({ ...filters, tier })}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                filters.tier === tier
                  ? "bg-ink text-ivory border-ink"
                  : "border-stone-200 text-stone hover:border-ink"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-wide text-stone mb-3">
          Max Price — ₹{filters.maxPrice.toLocaleString("en-IN")}
        </h3>
        <input
          type="range"
          min={1000}
          max={PRICE_CEILING}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-gold-deep"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
          className="accent-gold-deep w-4 h-4"
        />
        In stock only
      </label>

      <p className="text-xs text-stone pt-2 border-t border-stone-200">
        {resultCount} {resultCount === 1 ? "product" : "products"} found
      </p>
    </aside>
  );
}
