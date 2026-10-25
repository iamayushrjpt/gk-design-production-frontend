import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import Button from "../components/ui/Button";
import { getWhatsAppLink } from "../lib/whatsapp";
import { useSiteSettings } from "../lib/siteSettings";

export default function Contact() {
  const settings = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In production this posts to a /api/contact endpoint or forwards to email.
    // For now, route straight into a pre-filled WhatsApp message — consistent
    // with the site's no-forms-that-go-nowhere, WhatsApp-first philosophy.
    const text = encodeURIComponent(
      `Hello, my name is ${form.name}.\n\n${form.message}\n\n(Reach me at ${form.email})`
    );
    window.open(`${getWhatsAppLink()}?text=${text}`, "_blank");
    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col gap-2 mb-12 max-w-xl">
        <span className="text-xs tracking-[0.2em] uppercase text-gold-deep">Get In Touch</span>
        <h1 className="font-display text-3xl md:text-4xl text-ink">Contact</h1>
        <p className="text-sm text-stone">
          Fastest way to reach us is WhatsApp — most questions get a same-day reply.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info + map */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gold-deep mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-ink">Showroom</p>
                <p className="text-sm text-stone">{settings.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-gold-deep mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-ink">Phone</p>
                <a href={`tel:+${settings.whatsappNumber}`} className="text-sm text-stone hover:text-gold-deep transition-colors">+{settings.whatsappNumber}</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-gold-deep mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-ink">Email</p>
                <a href={`mailto:${settings.email}`} className="text-sm text-stone hover:text-gold-deep transition-colors">{settings.email}</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-gold-deep mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-ink">Hours</p>
                <p className="text-sm text-stone">{settings.businessHours}</p>
              </div>
            </div>
          </div>

          <Button variant="primary" as="a" href={getWhatsAppLink()} icon={<MessageCircle size={16} />} className="w-fit !bg-[#25D366] !text-white hover:!bg-[#128C7E]">
            Chat on WhatsApp
          </Button>

          {/* IMAGE PROMPT (used as static map placeholder): simple embedded street
              map view of the business's city, muted colors, pin marker at
              showroom location */}
          <div className="aspect-video rounded-gk-lg overflow-hidden bg-stone-200">
            <iframe
              title={`${settings.businessName} showroom location`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-paper rounded-gk-lg shadow-gk-soft p-6 md:p-8 flex flex-col gap-4 h-fit">
          <h2 className="font-display text-xl text-ink mb-1">Send a message</h2>
          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2.5 border border-stone-200 rounded-gk-sm text-sm focus-visible:outline-gold"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="px-3 py-2.5 border border-stone-200 rounded-gk-sm text-sm focus-visible:outline-gold"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Message
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="px-3 py-2.5 border border-stone-200 rounded-gk-sm text-sm focus-visible:outline-gold"
            />
          </label>
          <Button type="submit" variant="primary" icon={<MessageCircle size={16} />} className="!bg-[#25D366] !text-white hover:!bg-[#128C7E]">
            Send via WhatsApp
          </Button>
          {status === "sent" && (
            <p role="status" className="text-sm text-sage">Opening WhatsApp with your message pre-filled…</p>
          )}
        </form>
      </div>
    </div>
  );
}
