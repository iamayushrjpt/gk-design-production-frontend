// Mock admin-side data, shaped to match the MongoDB collections defined in
// Phase 1 (homepage_sections, media_assets, whatsapp_inquiries). In Phase 5
// these become GET/PUT calls to the Spring Boot admin API.

export type HomepageSection = {
  id: string;
  type: string;
  label: string;
  isEnabled: boolean;
  order: number;
};

export const initialHomepageSections: HomepageSection[] = [
  { id: "hero", type: "hero", label: "Hero", isEnabled: true, order: 1 },
  { id: "category_grid", type: "category_grid", label: "Shop by Category", isEnabled: true, order: 2 },
  { id: "luxury_collection", type: "featured_collection", label: "Luxury Collection", isEnabled: true, order: 3 },
  { id: "affordable_collection", type: "featured_collection", label: "Everyday Collection", isEnabled: true, order: 4 },
  { id: "why_choose_us", type: "why_choose_us", label: "Why Choose Us", isEnabled: true, order: 5 },
  { id: "stats_band", type: "stats_band", label: "Statistics Band", isEnabled: true, order: 6 },
  { id: "how_it_works", type: "how_it_works", label: "How It Works", isEnabled: true, order: 7 },
  { id: "testimonials", type: "testimonials", label: "Testimonials", isEnabled: true, order: 8 },
  { id: "newsletter", type: "newsletter", label: "Newsletter", isEnabled: true, order: 9 },
  { id: "contact_cta", type: "contact_cta", label: "Contact CTA", isEnabled: true, order: 10 },
];

export type MediaAsset = {
  id: string;
  url: string;
  filename: string;
  folder: string;
  createdAt: string;
};

export const mediaAssets: MediaAsset[] = [
  { id: "m1", url: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80", filename: "aalborg-dining-01.jpg", folder: "furniture", createdAt: "2026-06-14" },
  { id: "m2", url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80", filename: "meridian-chair-01.jpg", folder: "furniture", createdAt: "2026-06-14" },
  { id: "m3", url: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&q=80", filename: "arcata-mirror-01.jpg", folder: "mirrors", createdAt: "2026-06-10" },
  { id: "m4", url: "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=400&q=80", filename: "solstice-lamp-01.jpg", folder: "lighting", createdAt: "2026-06-08" },
  { id: "m5", url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80", filename: "havana-console-01.jpg", folder: "storage", createdAt: "2026-06-02" },
  { id: "m6", url: "https://images.unsplash.com/photo-1584346133934-a3044f11e0d5?w=400&q=80", filename: "bergen-rug-01.jpg", folder: "rugs", createdAt: "2026-05-28" },
];

export type WhatsAppInquiry = {
  id: string;
  productName: string;
  sku: string;
  variant: string;
  price: number;
  createdAt: string;
};

export const whatsappInquiries: WhatsAppInquiry[] = [
  { id: "i1", productName: "Aalborg Dining Table", sku: "FUR-102", variant: "Natural Teak · 6-Seater", price: 58000, createdAt: "2026-07-04 18:22" },
  { id: "i2", productName: "Meridian Lounge Chair", sku: "FUR-118", variant: "Oat Boucle · Standard", price: 24500, createdAt: "2026-07-04 15:47" },
  { id: "i3", productName: "Solstice Floor Lamp", sku: "LGT-076", variant: "Natural Oak / Ivory Shade", price: 9400, createdAt: "2026-07-03 11:05" },
  { id: "i4", productName: "Arcata Brass Mirror", sku: "MIR-041", variant: "Antique Brass · Medium", price: 12800, createdAt: "2026-07-02 09:30" },
  { id: "i5", productName: "Porto Pendant Light", sku: "LGT-091", variant: "Natural Rattan · Large", price: 5400, createdAt: "2026-07-01 20:14" },
];
