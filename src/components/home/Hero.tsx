import Button from "../ui/Button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useSectionContent } from "../../lib/useSectionContent";
import { getWhatsAppLink } from "../../lib/whatsapp";

export default function Hero() {
  const { content } = useSectionContent({ type: "hero" });

  return (
    <section className="relative min-h-[min(86svh,900px)] flex items-end overflow-hidden">
      {/* IMAGE PROMPT: Wide-angle interior shot of a sunlit living room at golden hour,
          solid teak dining table and a walnut lounge chair in frame, warm natural light
          raking across the wood grain, minimal styling, ultra realistic, editorial photography,
          shot on 35mm, shallow depth of field, 1920x1080 */}
      <img
        src={content.backgroundImage || "/home-hero.webp"}
        alt="A sunlit living room featuring solid teak furniture from Gk Design"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto w-full px-5 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-xl flex flex-col gap-6">
          <span className="text-xs tracking-[0.25em] uppercase text-gold">
            {content.eyebrow || "Est. 2014 — Bengaluru"}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ivory leading-[1.05]">
            {content.headline || "Furniture, designed with intention."}
          </h1>
          <p className="text-base md:text-lg text-ivory/85 max-w-md">
            {content.subheadline ||
              "Solid-wood pieces built to a spec, not a season — from a single reading chair to a full-home fit-out, with every measurement confirmed before it's made."}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button variant="primary" as="a" href="/products" icon={<ArrowRight size={16} />}>
              {content.ctaPrimaryLabel || "Explore Collection"}
            </Button>
            <Button
              variant="primary"
              as="a"
              href={getWhatsAppLink()}
              icon={<MessageCircle size={16} />}
              className="!bg-[#25D366] !text-white hover:!bg-[#128C7E]"
            >
              {content.ctaSecondaryLabel || "Book a Consultation"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
