import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Truck, ShieldCheck } from "lucide-react";
import { useLiveProduct, useLiveProducts } from "../lib/useLiveProducts";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { useRecentlyViewed } from "../lib/recentlyViewed";
import { useIsWishlisted } from "../lib/wishlist";
import ImageGallery from "../components/product/ImageGallery";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/Button";
import ComingSoon from "./ComingSoon";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useLiveProduct(slug);
  // Used to compute "related" and "recently viewed" client-side — the
  // backend doesn't have a dedicated related-products endpoint yet.
  const { products: allProducts } = useLiveProducts();
  const { slugs: recentSlugs, markViewed } = useRecentlyViewed();

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name ?? "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const { isWishlisted: wishlisted, toggle: toggleWishlisted } = useIsWishlisted(slug ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      markViewed(product.slug);
      setSelectedColor(product.colors[0]?.name ?? "");
      setSelectedSize(product.sizes[0] ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.slug]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  }, [product, allProducts]);

  const recentlyViewedProducts = useMemo(
    () => recentSlugs.map((s) => allProducts.find((p) => p.slug === s)).filter((p): p is typeof allProducts[number] => !!p && p.slug !== slug),
    [recentSlugs, slug, allProducts]
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-stone-200 rounded-gk-lg animate-pulse" />
        <div className="flex flex-col gap-4">
          <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-stone-200 rounded animate-pulse" />
          <div className="h-24 w-full bg-stone-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) return <ComingSoon title="Product not found" />;

  const whatsappUrl = buildWhatsAppUrl({
    productName: product.name,
    sku: product.sku,
    price: product.price,
    material: product.material,
    variant: selectedColor,
    size: selectedSize,
    quantity,
  });

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        /* user cancelled — no-op */
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-gold-deep">Home</Link> /
        <Link to="/products" className="hover:text-gold-deep">Products</Link> /
        <Link to={`/categories/${product.category.toLowerCase()}`} className="hover:text-gold-deep">{product.category}</Link> /
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ImageGallery images={product.images} alt={product.name} />

        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs text-stone">{product.category} · SKU {product.sku}</span>
            <h1 className="font-display text-3xl md:text-4xl text-ink mt-1">{product.name}</h1>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gold-deep font-medium">★ {product.rating}</span>
            <span className="text-stone">({product.ratingCount} reviews)</span>
            <span className="text-stone">·</span>
            <span className={product.stockStatus === "In Stock" ? "text-sage" : "text-stone"}>
              {product.stockStatus}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl text-ink">₹{product.price.toLocaleString("en-IN")}</span>
            {product.compareAtPrice && (
              <span className="text-base text-stone line-through">
                ₹{product.compareAtPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="text-sm text-stone leading-relaxed">{product.description}</p>

          {/* Color dropdown */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="color-select" className="text-xs uppercase tracking-wide text-stone">
              Color / Finish
            </label>
            <select
              id="color-select"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-gk-sm border border-stone-200 bg-paper text-sm focus-visible:outline-gold"
            >
              {product.colors.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Size dropdown */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="size-select" className="text-xs uppercase tracking-wide text-stone">
              Size
            </label>
            <select
              id="size-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 rounded-gk-sm border border-stone-200 bg-paper text-sm focus-visible:outline-gold"
            >
              {product.sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="qty-select" className="text-xs uppercase tracking-wide text-stone">
              Quantity
            </label>
            <div className="flex items-center gap-3 w-fit border border-stone-200 rounded-gk-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-9 h-9 text-ink hover:text-gold-deep"
              >
                −
              </button>
              <span id="qty-select" className="w-6 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-9 h-9 text-ink hover:text-gold-deep"
              >
                +
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" icon={<MessageCircle size={16} />} className="!bg-[#25D366] !text-white hover:!bg-[#128C7E]">
                Book on WhatsApp
              </Button>
            </a>
            <Button
              variant="outline-dark"
              icon={<Heart size={16} className={wishlisted ? "fill-rust text-rust" : ""} />}
              onClick={() => toggleWishlisted()}
            >
              {wishlisted ? "Wishlisted" : "Wishlist"}
            </Button>
            <Button variant="ghost" icon={<Share2 size={16} />} onClick={handleShare}>
              {copied ? "Link copied" : "Share"}
            </Button>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-stone-200 mt-2 text-sm text-stone">
            <span className="flex items-center gap-2"><Truck size={16} /> {product.deliveryInfo}</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} /> Estimated delivery: {product.estimatedDeliveryDays}</span>
          </div>
        </div>
      </div>

      {/* Specs + Features + Care */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 pt-16 border-t border-stone-200">
        <div>
          <h2 className="font-display text-xl text-ink mb-4">Specifications</h2>
          <dl className="flex flex-col gap-2 text-sm">
            {[
              ["Brand", product.brand],
              ["Material", product.material],
              ["Finish", product.finish],
              ["Dimensions", `${product.dimensions.l} x ${product.dimensions.w} x ${product.dimensions.h} ${product.dimensions.unit}`],
              ["Weight", product.weight],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-stone-200 pb-2">
                <dt className="text-stone">{label}</dt>
                <dd className="text-ink font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink mb-4">Features</h2>
          <ul className="flex flex-col gap-2 text-sm text-stone">
            {product.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-gold-deep">—</span> {f}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink mb-4">Care Instructions</h2>
          <p className="text-sm text-stone leading-relaxed">{product.careInstructions}</p>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-2xl text-ink mb-6">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Recently viewed */}
      {recentlyViewedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl text-ink mb-6">Recently viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recentlyViewedProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
