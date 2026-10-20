import { Camera, Globe, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { useSiteSettings } from "../../lib/siteSettings";
import { getWhatsAppLink } from "../../lib/whatsapp";

export default function Footer() {
  const settings = useSiteSettings();

  return (
    <footer className="bg-ink text-ivory">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
          <div className="flex flex-col gap-4 md:col-span-1">
            <span className="font-display text-2xl">
              GK <span className="text-gold">DESIGN</span>
            </span>
            <p className="text-sm text-mist leading-relaxed">
              Furniture, designed with intention. Twelve years of building pieces
              that hold up in daily life, not just in photographs.
            </p>
            <div className="flex gap-4 pt-2">
              <a href={settings.socials?.instagram || "#"} aria-label="Instagram" className="text-mist hover:text-gold transition-colors"><Camera size={18} /></a>
              <a href={settings.socials?.facebook || "#"} aria-label="Facebook" className="text-mist hover:text-gold transition-colors"><Globe size={18} /></a>
              <a href={getWhatsAppLink()} aria-label="WhatsApp" className="text-mist hover:text-gold transition-colors"><MessageCircle size={18} /></a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm uppercase tracking-wide text-gold mb-1">Shop</h4>
            <a href="/products" className="text-sm text-mist hover:text-ivory transition-colors">All Products</a>
            <a href="/categories/furniture" className="text-sm text-mist hover:text-ivory transition-colors">Furniture</a>
            <a href="/categories/lighting" className="text-sm text-mist hover:text-ivory transition-colors">Lighting</a>
            <a href="/categories/wall-decor" className="text-sm text-mist hover:text-ivory transition-colors">Wall Decor</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm uppercase tracking-wide text-gold mb-1">Company</h4>
            <a href="/about" className="text-sm text-mist hover:text-ivory transition-colors">About Us</a>
            <a href="/privacy-policy" className="text-sm text-mist hover:text-ivory transition-colors">Privacy Policy</a>
            <a href="/terms-and-conditions" className="text-sm text-mist hover:text-ivory transition-colors">Terms & Conditions</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm uppercase tracking-wide text-gold mb-1">Contact</h4>
            <span className="flex items-start gap-2 text-sm text-mist"><MapPin size={16} className="mt-0.5 shrink-0" /> {settings.address}</span>
            <a href={`tel:+${settings.whatsappNumber}`} className="flex items-center gap-2 text-sm text-mist hover:text-ivory transition-colors"><Phone size={16} /> +{settings.whatsappNumber}</a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm text-mist hover:text-ivory transition-colors"><Mail size={16} /> {settings.email}</a>
          </div>
        </div>

        <div className="gk-divider" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-mist">
          <span>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</span>
          <span>Designed & built for {settings.businessName}</span>
        </div>
      </div>
    </footer>
  );
}
