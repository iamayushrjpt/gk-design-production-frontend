import type { JSX } from "react";
import Hero from "../components/home/Hero";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedCollection from "../components/home/FeaturedCollection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import StatsBand from "../components/home/StatsBand";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import ContactCTA from "../components/home/ContactCTA";
import { useHomepageSections } from "../lib/useHomepageSections";

// Maps a homepage_sections document's `id` to the component it renders.
// This is what makes the admin Homepage CMS's enable/disable and reorder
// controls actually affect the live page — Home.tsx no longer hardcodes a
// fixed section list, it renders whatever this map resolves to, in
// whatever order the CMS returns.
const SECTION_COMPONENTS: Record<string, () => JSX.Element> = {
  hero: () => <Hero />,
  category_grid: () => <CategoryGrid />,
  luxury_collection: () => (
    <FeaturedCollection
      sectionId="luxury_collection"
      eyebrow="Featured"
      title="The Luxury Collection"
      description="Solid teak and walnut pieces, finished by hand, built to outlast a decade of daily use."
      luxury={true}
      viewAllHref="/products?tier=luxury"
    />
  ),
  affordable_collection: () => (
    <FeaturedCollection
      sectionId="affordable_collection"
      eyebrow="Featured"
      title="The Everyday Collection"
      description="Considered design at a lower price point — same material transparency, smaller footprint."
      luxury={false}
      viewAllHref="/products?tier=affordable"
    />
  ),
  why_choose_us: () => <WhyChooseUs />,
  stats_band: () => <StatsBand />,
  how_it_works: () => <HowItWorks />,
  testimonials: () => <Testimonials />,
  newsletter: () => <Newsletter />,
  contact_cta: () => <ContactCTA />,
};

const DEFAULT_ORDER = [
  "hero", "category_grid", "luxury_collection", "affordable_collection",
  "why_choose_us", "stats_band", "how_it_works", "testimonials", "newsletter", "contact_cta",
];

export default function Home() {
  const { sections, loading } = useHomepageSections();

  if (loading) {
    // Brief, content-free loading state rather than flashing sections in
    // the wrong order and then re-flowing once the real config arrives.
    return <div className="min-h-[60vh]" />;
  }

  const renderable = sections.filter((s) => s.isEnabled && SECTION_COMPONENTS[s.id]);

  // Defense in depth: if the fetched sections don't map to any known
  // component (e.g. ids seeded differently than expected), fall back to
  // the default fixed order rather than rendering a blank homepage —
  // an imperfect homepage beats an empty one.
  const idsToRender = renderable.length > 0 ? renderable.map((s) => s.id) : DEFAULT_ORDER;

  return (
    <>
      {idsToRender.map((id) => (
        <div key={id}>{SECTION_COMPONENTS[id]?.()}</div>
      ))}
    </>
  );
}
