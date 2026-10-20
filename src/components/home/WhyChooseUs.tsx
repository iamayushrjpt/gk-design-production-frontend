import { Ruler, Hammer, Truck, MessageCircle } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { useSectionContent } from "../../lib/useSectionContent";

const values = [
  {
    icon: Ruler,
    title: "Measured, not guessed",
    description:
      "Every listing carries verified dimensions and weight. What you see on the page is what arrives at your door.",
  },
  {
    icon: Hammer,
    title: "Built from solid material",
    description:
      "Teak, walnut, oak, brass — no laminate shortcuts. We name the exact material on every product page.",
  },
  {
    icon: MessageCircle,
    title: "Talk to a person first",
    description:
      "No cart, no checkout maze. Ask questions on WhatsApp before you commit, and get a real reply, not a bot.",
  },
  {
    icon: Truck,
    title: "Delivery dates we keep",
    description:
      "Estimated delivery windows are confirmed at inquiry and tracked per order, not left as a vague promise.",
  },
];

export default function WhyChooseUs() {
  const { content } = useSectionContent({ type: "why_choose_us" });

  return (
    <section className="bg-ink-soft">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <SectionHeading
          eyebrow={content.eyebrow || "Why Gk Design"}
          title={content.title || "Furniture you can trust before it arrives"}
          dark
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-14">
          {values.map((v) => (
            <div key={v.title} className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gold-mist/10 border border-gold/30 flex items-center justify-center">
                <v.icon size={22} className="text-gold" />
              </div>
              <h3 className="font-display text-lg text-ivory">{v.title}</h3>
              <p className="text-sm text-mist leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
