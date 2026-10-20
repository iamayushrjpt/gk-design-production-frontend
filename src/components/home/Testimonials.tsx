import { testimonials } from "../../lib/data";
import SectionHeading from "../ui/SectionHeading";
import { useSectionContent } from "../../lib/useSectionContent";

export default function Testimonials() {
  const { content } = useSectionContent({ type: "testimonials" });

  return (
    <section className="bg-gold-mist/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <SectionHeading eyebrow={content.eyebrow || "Customers"} title={content.title || "What people say after delivery"} align="center" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="bg-paper rounded-gk-lg p-6 flex flex-col gap-4 shadow-gk-soft"
            >
              <div className="text-gold-deep text-sm">{"★".repeat(t.rating)}</div>
              <blockquote className="text-sm text-ink leading-relaxed">
                "{t.review}"
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-auto pt-2">
                <img
                  src={t.image}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium text-ink">{t.name}</span>
                  <span className="text-xs text-stone">{t.location}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
