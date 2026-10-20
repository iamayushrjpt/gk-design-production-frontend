import { Link } from "react-router-dom";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import { useWishlist } from "../lib/wishlist";
import { useLiveProducts } from "../lib/useLiveProducts";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/Button";

export default function Wishlist() {
  const { slugs, clear } = useWishlist();
  const { products: allProducts, loading } = useLiveProducts();

  const wishlistedProducts = allProducts.filter((p) => slugs.includes(p.slug));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <span className="text-xs tracking-[0.2em] uppercase text-gold-deep">Saved</span>
          <h1 className="font-display text-3xl md:text-4xl text-ink">Wishlist</h1>
          <p className="text-sm text-stone">
            Saved on this device — tap the heart on any product to add or remove it here.
          </p>
        </div>
        {slugs.length > 0 && (
          <Button variant="outline-dark" onClick={clear} icon={<Trash2 size={15} />}>
            Clear All
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-stone-200 rounded-gk-lg animate-pulse" />
          ))}
        </div>
      ) : slugs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gold-mist flex items-center justify-center">
            <Heart size={26} className="text-gold-deep" />
          </div>
          <p className="font-display text-xl text-ink">Nothing saved yet</p>
          <p className="text-sm text-stone max-w-sm">
            Browse the catalog and tap the heart icon on anything you want to come back to.
          </p>
          <Link to="/products">
            <Button variant="primary" icon={<ArrowRight size={16} />}>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
