import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLiveCategories } from "../lib/useLiveCategories";
import { useLiveProducts } from "../lib/useLiveProducts";
import { USE_LIVE_API } from "../lib/api";
import ProductCard from "../components/product/ProductCard";
import ComingSoon from "./ComingSoon";

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { categories, loading: categoriesLoading } = useLiveCategories();
  const category = categories.find((c) => c.slug === slug);

  const { products: source, loading: productsLoading } = useLiveProducts(
    USE_LIVE_API ? { category: category?.name, size: 60 } : {}
  );

  const products = useMemo(
    () => (USE_LIVE_API ? source : source.filter((p) => category && p.category === category.name)),
    [source, category]
  );

  if (categoriesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="h-40 bg-stone-200 rounded-gk-lg animate-pulse mb-10" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-stone-200 rounded-gk-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) return <ComingSoon title="Category not found" />;

  return (
    <div>
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 md:px-8 pb-8 w-full">
          <nav aria-label="Breadcrumb" className="text-xs text-ivory/70 mb-2 flex items-center gap-2">
            <Link to="/" className="hover:text-gold">Home</Link> /
            <Link to="/categories" className="hover:text-gold">Categories</Link> /
            <span className="text-ivory">{category.name}</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl text-ivory">{category.name}</h1>
          <p className="text-sm text-ivory/80 max-w-xl mt-2">{category.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-stone">{products.length} {products.length === 1 ? "piece" : "pieces"}</p>
          <Link to="/products" className="flex items-center gap-1.5 text-sm text-ink hover:text-gold-deep transition-colors">
            Browse all products <ArrowRight size={14} />
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-stone-200 rounded-gk-lg animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
            <p className="font-display text-xl text-ink">No products in this category yet</p>
            <p className="text-sm text-stone">Check back soon, or browse the full catalog.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
