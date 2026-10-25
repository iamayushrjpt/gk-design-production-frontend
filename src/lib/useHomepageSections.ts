import { useEffect, useState } from "react";
import { USE_LIVE_API, type HomepageSection } from "./api";
import { getPublicHomepageSections } from "./publicHomepageCache";

// Matches admin/lib/adminData.ts's mock section list — used as the default
// order in demo mode, and as a fallback if a live fetch fails.
const DEFAULT_SECTIONS: HomepageSection[] = [
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

/**
 * Drives which homepage sections actually render, and in what order — this
 * is what makes the admin Homepage CMS's toggle/reorder controls have any
 * effect on the live page at all. See src/pages/Home.tsx for how the
 * returned section ids map to components.
 */
export function useHomepageSections() {
  const [sections, setSections] = useState<HomepageSection[]>(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(USE_LIVE_API);

  useEffect(() => {
    if (!USE_LIVE_API) return;
    setLoading(true);
    getPublicHomepageSections()
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          // Empty collection (nothing seeded yet) or every section
          // disabled — either way, showing nothing is worse than showing
          // the default homepage, so fall back rather than rendering blank.
          console.warn(
            "[useHomepageSections] Live API returned no enabled sections — falling back to the default homepage layout. " +
            "If this is unexpected, check that the backend's homepage_sections collection is seeded (ContentSeeder) " +
            "and that sections aren't all toggled off in the admin Homepage CMS."
          );
          setSections(DEFAULT_SECTIONS);
          return;
        }
        // Backend already filters to isEnabled and sorts by order, but sort
        // defensively here too in case that ever changes.
        setSections([...data].sort((a, b) => a.order - b.order));
      })
      .catch((e) => {
        console.warn("[useHomepageSections] Failed to fetch homepage sections, falling back to defaults:", e);
        setSections(DEFAULT_SECTIONS);
      })
      .finally(() => setLoading(false));
  }, []);

  return { sections, loading };
}
