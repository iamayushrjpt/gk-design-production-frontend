import { useLiveProducts } from "../../lib/useLiveProducts";
import { useSectionContent } from "../../lib/useSectionContent";
import ProductCard from "../product/ProductCard";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";
import { ArrowRight } from "lucide-react";
import { USE_LIVE_API } from "../../lib/api";

interface FeaturedCollectionProps {
  sectionId: string;
  eyebrow: string;
  title: string;
  description: string;
  luxury: boolean;
  viewAllHref: string;
}

export default function FeaturedCollection({
  sectionId,
  eyebrow,
  title,
  description,
  luxury,
  viewAllHref,
}: FeaturedCollectionProps) {
  // Keyed by section id, not type — both this section and its sibling
  // (Luxury vs. Everyday collection) share the "featured_collection" type,
  // so matching by type alone would make them collide onto the same content.
  const { content } = useSectionContent({ id: sectionId });

  // When live, ask the backend to pre-filter by tier and cap at 4; when on
  // mock data, filter client-side the same way Phase 2-4 always did.
  const { products: allResults, loading } = useLiveProducts(
    USE_LIVE_API
      ? { luxuryOnly: luxury ? true : undefined, affordableOnly: !luxury ? true : undefined, size: 4 }
      : {}
  );
  const products = USE_LIVE_API ? allResults : allResults.filter((p) => p.isLuxury === luxury).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
        <SectionHeading
          eyebrow={content.eyebrow || eyebrow}
          title={content.title || title}
          description={content.description || description}
        />
        <Button variant="outline-dark" as="a" href={viewAllHref} icon={<ArrowRight size={15} />}>
          View All
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-stone-200 rounded-gk-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
