import { useEffect, useState } from "react";
import { USE_LIVE_API } from "./api";
import { getPublicHomepageSections } from "./publicHomepageCache";

/**
 * Returns the admin-edited content object for a homepage section, or an
 * empty object if none is set / the backend isn't configured. Components
 * should merge this over their hardcoded default copy:
 * `values.headline ?? "Furniture, designed with intention."`
 *
 * Pass `{ id }` when multiple sections share the same `type` on the page
 * (e.g. the Luxury and Everyday collections are both `featured_collection`)
 * so each instance gets its own independent content rather than colliding.
 * Pass `{ type }` for sections that only ever appear once.
 */
export function useSectionContent(
  selector: { type: string } | { id: string }
): { content: Record<string, string>; loading: boolean } {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(USE_LIVE_API);

  const key = "type" in selector ? `type:${selector.type}` : `id:${selector.id}`;

  useEffect(() => {
    if (!USE_LIVE_API) return;
    setLoading(true);
    getPublicHomepageSections()
      .then((sections) => {
        const match =
          "id" in selector
            ? sections.find((s) => s.id === selector.id)
            : sections.find((s) => s.type === selector.type && s.isEnabled);
        setContent(match?.content ?? {});
      })
      .catch(() => {
        // Best-effort — homepage should never break because CMS content failed to load
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { content, loading };
}
