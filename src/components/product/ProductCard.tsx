import { Heart, MessageCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../lib/data";
import { buildWhatsAppUrl } from "../../lib/whatsapp";
import { useIsWishlisted } from "../../lib/wishlist";

export default function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggle } = useIsWishlisted(product.slug);

  const whatsappUrl = buildWhatsAppUrl({
    productName: product.name,
    sku: product.sku,
    price: product.price,
    material: product.material,
  });

  return (
    <div className="group relative flex flex-col bg-paper rounded-gk-lg overflow-hidden shadow-gk-soft hover:shadow-gk-lift transition-shadow duration-300">
      {/* Image — the whole thing is now a real link to the product page */}
      <Link to={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-stone-200">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.isLuxury && (
          <span className="absolute top-3 left-3 bg-ink/85 text-gold text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full">
            Luxury
          </span>
        )}

        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-paper/90 flex items-center justify-center hover:bg-paper transition-colors z-10"
        >
          <Heart
            size={16}
            className={isWishlisted ? "fill-rust text-rust" : "text-ink"}
          />
        </button>

        {/* Quick view — visual cue only on hover; clicking anywhere in the
            image (including here) navigates via the parent Link above */}
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 transition-all duration-200 flex items-center gap-2 bg-paper text-ink text-xs font-medium uppercase tracking-wide px-4 py-2 rounded-full shadow-gk-soft">
          <Eye size={14} /> Quick View
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-4">
        <span className="text-xs text-stone">{product.category}</span>
        <Link
          to={`/products/${product.slug}`}
          className="font-display text-lg text-ink hover:text-gold-deep transition-colors leading-snug"
        >
          {product.name}
        </Link>
        <p className="text-xs text-stone">{product.material}</p>

        <div className="flex items-center gap-1 text-xs text-stone mt-0.5">
          <span className="text-gold-deep font-medium">★ {product.rating}</span>
          <span>({product.ratingCount})</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-display text-lg text-ink">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-sage hover:text-ink transition-colors"
          >
            <MessageCircle size={14} /> Book
          </a>
        </div>
      </div>
    </div>
  );
}
