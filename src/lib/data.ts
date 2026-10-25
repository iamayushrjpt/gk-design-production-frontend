// In production these arrive from GET /api/homepage-sections, /api/categories,
// /api/products etc. Shaped to match the MongoDB schema so swapping mock data
// for live API calls later requires no component changes.

export type Category = {
  slug: string;
  name: string;
  image: string;
  count: number;
  description: string;
};

export const categories: Category[] = [
  { slug: "furniture", name: "Furniture", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80", count: 86, description: "Dining tables, lounge chairs, consoles and beds built from solid wood, finished by hand." },
  { slug: "lighting", name: "Lighting", image: "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800&q=80", count: 42, description: "Floor lamps, pendants and sconces designed to warm a room rather than flood it." },
  { slug: "wall-decor", name: "Wall Decor", image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80", count: 58, description: "Ceramic panels, framed textiles and sculptural pieces for walls that need a second look." },
  { slug: "mirrors", name: "Mirrors", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80", count: 24, description: "Brass, oak and iron-framed mirrors, beveled and finished to resist tarnish indoors." },
  { slug: "rugs", name: "Rugs", image: "https://images.unsplash.com/photo-1584346133934-a3044f11e0d5?w=800&q=80", count: 37, description: "Handwoven jute, wool and cotton rugs in natural fibers that soften with use." },
  { slug: "storage", name: "Storage", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80", count: 29, description: "Consoles, sideboards and cabinets built for real storage, not just display." },
];

export type ProductColor = { name: string; hex: string };

export type Product = {
  slug: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  material: string;
  finish: string;
  dimensions: { l: number; w: number; h: number; unit: "cm" };
  weight: string;
  images: string[];
  isLuxury: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  ratingCount: number;
  stockStatus: "In Stock" | "Made to Order" | "Out of Stock";
  description: string;
  features: string[];
  careInstructions: string;
  deliveryInfo: string;
  estimatedDeliveryDays: string;
  colors: ProductColor[];
  sizes: string[];
};

export const allProducts: Product[] = [
  {
    slug: "aalborg-dining-table",
    sku: "FUR-102",
    name: "Aalborg Dining Table",
    category: "Furniture",
    brand: "Gk Design",
    price: 58000,
    compareAtPrice: 64000,
    material: "Solid Teak Wood",
    finish: "Natural Oiled",
    dimensions: { l: 180, w: 90, h: 76, unit: "cm" },
    weight: "42 kg",
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80",
    ],
    isLuxury: true,
    isBestSeller: true,
    rating: 4.8,
    ratingCount: 32,
    stockStatus: "Made to Order",
    description:
      "A six-seater dining table built from a single grade of solid teak, finished with a hand-rubbed natural oil that deepens in tone over the first year of use. The apron is joined with traditional mortise-and-tenon work rather than screws, so the table tightens rather than loosens with age.",
    features: [
      "Solid teak, no veneer or laminate",
      "Mortise-and-tenon joinery",
      "Seats 6 comfortably, 8 at a squeeze",
      "Water-resistant oil finish, food-safe",
    ],
    careInstructions:
      "Wipe with a dry or lightly damp cloth. Re-oil every 12–18 months with food-grade teak oil to maintain the finish.",
    deliveryInfo: "Delivered assembled with white-glove placement in metro cities; flat-packed with setup elsewhere.",
    estimatedDeliveryDays: "18–24 days (made to order)",
    colors: [
      { name: "Natural Teak", hex: "#A9773F" },
      { name: "Walnut Stain", hex: "#5B3A29" },
      { name: "Ebony Stain", hex: "#2B211C" },
    ],
    sizes: ["4-Seater (150cm)", "6-Seater (180cm)", "8-Seater (220cm)"],
  },
  {
    slug: "meridian-lounge-chair",
    sku: "FUR-118",
    name: "Meridian Lounge Chair",
    category: "Furniture",
    brand: "Gk Design",
    price: 24500,
    material: "Walnut & Boucle Fabric",
    finish: "Matte Lacquer",
    dimensions: { l: 78, w: 82, h: 74, unit: "cm" },
    weight: "18 kg",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80",
    ],
    isLuxury: true,
    isNewArrival: true,
    rating: 4.9,
    ratingCount: 51,
    stockStatus: "In Stock",
    description:
      "A low, wide-armed lounge chair built on a solid walnut frame with a boucle upholstered seat. Designed for reading corners and living rooms where one chair needs to do a lot of visual work — it does.",
    features: [
      "Solid walnut frame, matte lacquer finish",
      "High-density foam seat, won't sag within the first 5 years",
      "Removable, dry-clean-only cushion cover",
    ],
    careInstructions: "Vacuum fabric weekly. Spot clean only — do not use water-based cleaners on boucle.",
    deliveryInfo: "Delivered assembled across India.",
    estimatedDeliveryDays: "7–10 days",
    colors: [
      { name: "Oat Boucle", hex: "#DCD3C2" },
      { name: "Charcoal Boucle", hex: "#3E3B37" },
      { name: "Rust Boucle", hex: "#9C4A2E" },
    ],
    sizes: ["Standard"],
  },
  {
    slug: "arcata-brass-mirror",
    sku: "MIR-041",
    name: "Arcata Brass Mirror",
    category: "Mirrors",
    brand: "Gk Design",
    price: 12800,
    material: "Brushed Brass",
    finish: "Antique Brass",
    dimensions: { l: 60, w: 4, h: 80, unit: "cm" },
    weight: "6.5 kg",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=80",
      "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=1200&q=80",
    ],
    isLuxury: false,
    rating: 4.6,
    ratingCount: 19,
    stockStatus: "In Stock",
    description:
      "An arched wall mirror with a brushed-brass frame that resists tarnishing indoors. The 4mm glass is beveled at the edge for a soft light line around the reflection.",
    features: ["Beveled 4mm glass", "Tarnish-resistant brass frame", "Concealed wall-mount hardware included"],
    careInstructions: "Clean glass with a standard glass cleaner. Wipe frame with a dry microfiber cloth only.",
    deliveryInfo: "Shipped in protective crate, insured against transit damage.",
    estimatedDeliveryDays: "5–7 days",
    colors: [
      { name: "Antique Brass", hex: "#B08D57" },
      { name: "Brushed Nickel", hex: "#A8AAAD" },
    ],
    sizes: ["Small (45cm)", "Medium (60cm)", "Large (75cm)"],
  },
  {
    slug: "solstice-floor-lamp",
    sku: "LGT-076",
    name: "Solstice Floor Lamp",
    category: "Lighting",
    brand: "Gk Design",
    price: 9400,
    material: "Oak & Linen Shade",
    finish: "Natural Oak",
    dimensions: { l: 40, w: 40, h: 150, unit: "cm" },
    weight: "5 kg",
    images: [
      "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1200&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=80",
    ],
    isLuxury: false,
    isBestSeller: true,
    rating: 4.7,
    ratingCount: 27,
    stockStatus: "In Stock",
    description:
      "A tripod floor lamp with a solid oak frame and a hand-stitched linen shade that softens overhead light into a warm, even glow suited to reading corners.",
    features: ["Solid oak tripod base", "Linen shade, replaceable", "In-line foot dimmer switch"],
    careInstructions: "Dust shade with a soft brush. Wipe base with a dry cloth.",
    deliveryInfo: "Delivered flat-packed with a 10-minute tool-free assembly.",
    estimatedDeliveryDays: "4–6 days",
    colors: [
      { name: "Natural Oak / Ivory Shade", hex: "#C9A876" },
      { name: "Walnut / Charcoal Shade", hex: "#4A3527" },
    ],
    sizes: ["Standard (150cm)"],
  },
  {
    slug: "havana-storage-console",
    sku: "STG-029",
    name: "Havana Storage Console",
    category: "Storage",
    brand: "Gk Design",
    price: 32500,
    material: "Mango Wood & Cane",
    finish: "Honey Wash",
    dimensions: { l: 140, w: 40, h: 80, unit: "cm" },
    weight: "34 kg",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=80",
    ],
    isLuxury: false,
    rating: 4.5,
    ratingCount: 14,
    stockStatus: "In Stock",
    description:
      "A three-drawer console in solid mango wood with hand-woven cane fronts. Built for entryways and media consoles that need real storage, not just a shelf.",
    features: ["3 soft-close drawers", "Hand-woven cane detailing", "Solid mango wood, not MDF core"],
    careInstructions: "Dust regularly. Avoid direct sunlight on cane panels to prevent fading.",
    deliveryInfo: "Delivered flat-packed, assembly available on request.",
    estimatedDeliveryDays: "10–14 days",
    colors: [
      { name: "Honey Wash", hex: "#C89B5C" },
      { name: "Espresso", hex: "#3B2A1F" },
    ],
    sizes: ["Standard (140cm)", "Compact (110cm)"],
  },
  {
    slug: "kiln-wall-panel-set",
    sku: "WD-053",
    name: "Kiln Ceramic Wall Panel Set",
    category: "Wall Decor",
    brand: "Gk Design",
    price: 6200,
    material: "Hand-glazed Ceramic",
    finish: "Matte Glaze",
    dimensions: { l: 30, w: 2, h: 30, unit: "cm" },
    weight: "3 kg (set of 4)",
    images: [
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80",
    ],
    isLuxury: false,
    isNewArrival: true,
    rating: 4.4,
    ratingCount: 9,
    stockStatus: "In Stock",
    description:
      "A set of four hand-glazed ceramic panels, each fired individually so no two are identical. Arrange in a grid or scatter them — mounting hardware for both is included.",
    features: ["Set of 4 panels, 30x30cm each", "Individually kiln-fired, natural variation expected", "Includes 2 mounting layouts"],
    careInstructions: "Dust with a dry cloth. Not for outdoor use.",
    deliveryInfo: "Shipped in individual foam crates.",
    estimatedDeliveryDays: "6–8 days",
    colors: [
      { name: "Sandstone Matte", hex: "#C7B79A" },
      { name: "Sage Matte", hex: "#7C8B72" },
    ],
    sizes: ["Set of 4"],
  },
  {
    slug: "bergen-jute-rug",
    sku: "RUG-014",
    name: "Bergen Jute Rug",
    category: "Rugs",
    brand: "Gk Design",
    price: 8900,
    material: "Handwoven Jute",
    finish: "Natural",
    dimensions: { l: 240, w: 1, h: 170, unit: "cm" },
    weight: "7 kg",
    images: [
      "https://images.unsplash.com/photo-1584346133934-a3044f11e0d5?w=1200&q=80",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200&q=80",
    ],
    isLuxury: false,
    rating: 4.6,
    ratingCount: 22,
    stockStatus: "In Stock",
    description:
      "A handwoven jute rug with a herringbone weave that adds texture underfoot without competing with the rest of a room. Reversible, so wear evens out over time.",
    features: ["100% natural jute", "Reversible weave", "Non-slip backing available on request"],
    careInstructions: "Vacuum on low suction. Blot spills immediately — jute stains if left wet.",
    deliveryInfo: "Rolled and shipped in protective wrap.",
    estimatedDeliveryDays: "5–7 days",
    colors: [
      { name: "Natural", hex: "#D8C6A0" },
      { name: "Charcoal Border", hex: "#3E3B37" },
    ],
    sizes: ["5x7 ft", "6x9 ft", "8x10 ft"],
  },
  {
    slug: "porto-pendant-light",
    sku: "LGT-091",
    name: "Porto Pendant Light",
    category: "Lighting",
    brand: "Gk Design",
    price: 5400,
    material: "Rattan & Iron",
    finish: "Natural Rattan",
    dimensions: { l: 35, w: 35, h: 30, unit: "cm" },
    weight: "1.8 kg",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=80",
      "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=1200&q=80",
    ],
    isLuxury: false,
    isBestSeller: true,
    rating: 4.7,
    ratingCount: 38,
    stockStatus: "In Stock",
    description:
      "A hand-woven rattan pendant that casts a dappled, warm light pattern across ceilings and walls. Works well hung in clusters of three over a dining table.",
    features: ["Hand-woven natural rattan", "Iron mounting frame", "E27 fitting, bulb not included"],
    careInstructions: "Dust with a soft brush. Keep away from direct moisture.",
    deliveryInfo: "Shipped in reinforced box, ready to hang.",
    estimatedDeliveryDays: "4–6 days",
    colors: [{ name: "Natural Rattan", hex: "#C9A876" }],
    sizes: ["Small (30cm)", "Large (40cm)"],
  },
];

export const featuredProducts = allProducts;

export const testimonials = [
  {
    name: "Ritika Sen",
    location: "Bengaluru",
    review:
      "We furnished our entire living room through Gk Design over WhatsApp calls. Every dimension they gave us was accurate down to the centimetre, and the teak dining table looks better in person than the photos.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  },
  {
    name: "Arjun Malhotra",
    location: "Delhi NCR",
    review:
      "I was replacing one lamp and ended up redoing the study. Their team suggested finishes I hadn't considered and the delivery window they quoted was the window they hit.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
  {
    name: "Priya Nair",
    location: "Kochi",
    review:
      "The Meridian chair is the first piece of furniture I've bought that made guests ask where it's from before they sit down. Customization on the fabric took about a week.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80",
  },
];

export const stats = [
  { value: 12, suffix: "+", label: "Years designing furniture" },
  { value: 200, suffix: "+", label: "Pieces delivered" },
  { value: 30, suffix: "+", label: "Cities served" },
  { value: 4.8, suffix: "/5", label: "Average customer rating" },
];

export type ServiceOffering = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string; // backend stores this as a free-text string; frontend maps known values to lucide icons, falls back to a default
  gallery: string[]; // matches backend's ServiceOffering.gallery — first image is used as the hero image
  features: string[];
  ctaLabel?: string;
  ctaLink?: string;
};

export const services: ServiceOffering[] = [
  {
    slug: "custom-design",
    title: "Custom Design",
    subtitle: "One-off pieces, built to your dimensions",
    description:
      "Send us the space, the constraints, and the feeling you're after. We'll sketch options, confirm materials and dimensions with you before anything is cut, and build a piece that exists nowhere else.",
    icon: "compass",
    gallery: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=80"],
    features: ["Free initial consultation", "2-3 design revisions included", "Material and finish samples sent before production"],
  },
  {
    slug: "bulk-trade-orders",
    title: "Bulk & Trade Orders",
    subtitle: "For designers, architects and hospitality projects",
    description:
      "Furnishing multiple units or a commercial space? We work directly with designers and procurement teams on volume pricing, consistent finishes across large orders, and phased delivery schedules.",
    icon: "package",
    gallery: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80"],
    features: ["Trade pricing on orders of 10+ units", "Dedicated account contact", "Phased delivery to match your project timeline"],
  },
  {
    slug: "interior-consultation",
    title: "Interior Consultation",
    subtitle: "An hour with our design team, in person or on call",
    description:
      "Not sure what a room needs? A consultation gets you a second opinion on layout, material pairing and what to prioritize first — with product recommendations from our catalog or fully custom.",
    icon: "ruler",
    gallery: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1000&q=80"],
    features: ["60-minute session, in-showroom or video call", "Follow-up mood board within 3 days", "Credited toward any order placed within 30 days"],
  },
  {
    slug: "restoration-repair",
    title: "Restoration & Repair",
    subtitle: "For Gk Design pieces, and most solid-wood furniture",
    description:
      "Re-oiling a dining table, replacing upholstery, fixing a joint that's loosened after a decade of use — our workshop handles repair work, not just new builds.",
    icon: "wrench",
    gallery: ["https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=1000&q=80"],
    features: ["On-site assessment for large pieces", "Original material matching where possible", "Typical turnaround: 2-3 weeks"],
  },
];
