import Button from "../ui/Button";
import { MessageCircle, Phone } from "lucide-react";
import { useSectionContent } from "../../lib/useSectionContent";
import { getWhatsAppLink } from "../../lib/whatsapp";
import { useSiteSettings } from "../../lib/siteSettings";

export default function ContactCTA() {
  const { content } = useSectionContent({ type: "contact_cta" });
  const settings = useSiteSettings();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="relative rounded-gk-lg overflow-hidden bg-ink-soft px-6 md:px-16 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-3 text-center md:text-left">
          <h2 className="font-display text-2xl md:text-3xl text-ivory">
            {content.title || "Furnishing a whole room? Let's talk it through."}
          </h2>
          <p className="text-sm text-mist max-w-md">
            {content.description || "Send us your space dimensions and budget on WhatsApp — we'll put together a shortlist within a day."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <Button variant="primary" as="a" href={getWhatsAppLink()} icon={<MessageCircle size={16} />}>
            {content.whatsappLabel || "Chat on WhatsApp"}
          </Button>
          <Button variant="outline-light" as="a" href={`tel:+${settings.whatsappNumber}`} icon={<Phone size={16} />}>
            Call Us
          </Button>
        </div>
      </div>
    </section>
  );
}
