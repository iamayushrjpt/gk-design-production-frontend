import { Link } from "react-router-dom";
import { useLiveCategories } from "../lib/useLiveCategories";

export default function Categories() {
  const { categories, loading } = useLiveCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col gap-2 mb-10">
        <span className="text-xs tracking-[0.2em] uppercase text-gold-deep">Browse</span>
        <h1 className="font-display text-3xl md:text-4xl text-ink">All Categories</h1>
        <p className="text-sm text-stone max-w-xl">
          Six collections, one standard: real materials, honest dimensions, and finishes that age well.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-stone-200 rounded-gk-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categories/${cat.slug}`}
              className="group relative aspect-[4/5] rounded-gk-lg overflow-hidden"
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-1">
                <span className="font-display text-xl text-ivory">{cat.name}</span>
                <span className="text-xs text-ivory/70">{cat.count} pieces</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
