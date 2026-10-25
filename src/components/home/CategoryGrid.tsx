import { useLiveCategories } from "../../lib/useLiveCategories";
import { useSectionContent } from "../../lib/useSectionContent";
import SectionHeading from "../ui/SectionHeading";

export default function CategoryGrid() {
  const { categories, loading } = useLiveCategories();
  const { content } = useSectionContent({ type: "category_grid" });

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="h-8 w-48 bg-stone-200 rounded animate-pulse mb-10" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-stone-200 rounded-gk-md animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
      <SectionHeading
        eyebrow={content.eyebrow || "Browse"}
        title={content.title || "Shop by category"}
        description={content.description || ""}
      />

      <div className="mt-10 flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-6 md:overflow-visible snap-x snap-mandatory">
        {categories.map((cat) => (
          <a
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group relative shrink-0 w-40 md:w-auto aspect-[3/4] rounded-gk-md overflow-hidden snap-start"
          >
            <img
              src={cat.image}
              alt={cat.name}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 160px, 16vw"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col">
              <span className="font-display text-lg text-ivory">{cat.name}</span>
              <span className="text-xs text-ivory/70">{cat.count} pieces</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
