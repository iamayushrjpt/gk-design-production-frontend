import { Search, MessageCircle, CheckCircle, Truck } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { useSectionContent } from "../../lib/useSectionContent";

const steps = [
  { icon: Search, title: "Browse", description: "Filter by material, category or budget until something fits your space." },
  { icon: MessageCircle, title: "Inquire on WhatsApp", description: "One tap sends us the exact product, variant and price — no forms to fill." },
  { icon: CheckCircle, title: "Confirm details", description: "We confirm stock, customization and a delivery date with you directly." },
  { icon: Truck, title: "Delivered", description: "Tracked delivery to your door, with white-glove placement on larger pieces." },
];

export default function HowItWorks() {
  const { content } = useSectionContent({ type: "how_it_works" });

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
      <SectionHeading eyebrow={content.eyebrow || "Process"} title={content.title || "How ordering works"} align="center" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mt-14">
        {steps.map((step, i) => (
          <div key={step.title} className="relative flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold-mist flex items-center justify-center">
              <step.icon size={24} className="text-gold-deep" />
            </div>
            <h3 className="font-display text-lg text-ink">{step.title}</h3>
            <p className="text-sm text-stone leading-relaxed max-w-[220px]">{step.description}</p>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-stone-200" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
