import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, GripVertical, Pencil, X } from "lucide-react";
import { initialHomepageSections } from "../lib/adminData";
import { api, USE_LIVE_API, ApiError, type HomepageSection } from "../../lib/api";
import AdminPageHeader from "../components/AdminPageHeader";
import Button from "../../components/ui/Button";

// Which text fields each section type exposes for editing, and how they're
// labeled in the form. Section types with no entry here (e.g. stats_band,
// which is purely data-driven from the stats collection) get no "Edit
// Content" button — there's nothing free-text to edit.
const SECTION_CONTENT_FIELDS: Record<string, { key: string; label: string; multiline?: boolean }[]> = {
  hero: [
    { key: "eyebrow", label: "Eyebrow text" },
    { key: "headline", label: "Headline", multiline: true },
    { key: "subheadline", label: "Subheadline", multiline: true },
    { key: "ctaPrimaryLabel", label: "Primary button label" },
    { key: "ctaSecondaryLabel", label: "Secondary button label" },
    { key: "backgroundImage", label: "Background image URL" },
  ],
  category_grid: [
    { key: "eyebrow", label: "Eyebrow text" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description", multiline: true },
  ],
  featured_collection: [
    { key: "eyebrow", label: "Eyebrow text" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description", multiline: true },
  ],
  why_choose_us: [
    { key: "eyebrow", label: "Eyebrow text" },
    { key: "title", label: "Title" },
  ],
  how_it_works: [
    { key: "eyebrow", label: "Eyebrow text" },
    { key: "title", label: "Title" },
  ],
  testimonials: [
    { key: "eyebrow", label: "Eyebrow text" },
    { key: "title", label: "Title" },
  ],
  newsletter: [
    { key: "eyebrow", label: "Eyebrow text" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description", multiline: true },
  ],
  contact_cta: [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", multiline: true },
    { key: "whatsappLabel", label: "WhatsApp button label" },
  ],
};

export default function HomepageCMS() {
  const [sections, setSections] = useState<HomepageSection[]>(
    USE_LIVE_API ? [] : initialHomepageSections
  );
  const [loading, setLoading] = useState(USE_LIVE_API);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

  useEffect(() => {
    if (!USE_LIVE_API) return;
    setLoading(true);
    api.admin.homepageSections
      .list()
      .then(setSections)
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : "Could not load homepage sections."))
      .finally(() => setLoading(false));
  }, []);

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;

    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    const renumbered = next.map((s, i) => ({ ...s, order: i + 1 }));
    setSections(renumbered);

    if (USE_LIVE_API) {
      try {
        await Promise.all([
          api.admin.homepageSections.reorder(renumbered[index].id, renumbered[index].order),
          api.admin.homepageSections.reorder(renumbered[target].id, renumbered[target].order),
        ]);
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not save new order.");
      }
    }
  };

  const toggleEnabled = async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    const nextEnabled = !section.isEnabled;
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, isEnabled: nextEnabled } : s)));

    if (USE_LIVE_API) {
      try {
        await api.admin.homepageSections.toggle(id, nextEnabled);
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not update section visibility.");
      }
    }
  };

  const saveContent = async (id: string, content: Record<string, string>) => {
    setLoadError(null);
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, content } : s)));

    if (USE_LIVE_API) {
      try {
        await api.admin.homepageSections.updateContent(id, content);
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not save section content.");
      }
    }
    setEditingSection(null);
  };

  return (
    <div>
      <AdminPageHeader
        title="Homepage CMS"
        description={
          USE_LIVE_API
            ? "Connected to live API — toggles, order, and content reflect on the live homepage immediately."
            : "Demo mode (mock data) — toggle sections on or off, reorder, and edit their text content."
        }
      />

      {loadError && (
        <div className="mb-6 px-4 py-3 rounded-gk-sm bg-rust/10 text-rust text-sm">{loadError}</div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-stone">Loading homepage sections…</div>
      ) : (
      <div className="bg-paper rounded-gk-lg shadow-gk-soft divide-y divide-stone-200">
        {sections.map((section, i) => {
          const fields = SECTION_CONTENT_FIELDS[section.type];
          return (
            <div key={section.id} className="flex items-center gap-4 px-5 py-4">
              <GripVertical size={16} className="text-stone-200" />
              <span className="text-xs text-stone w-6">{section.order}</span>
              <div className="flex-1">
                <p className="text-sm text-ink">{section.label}</p>
                <p className="text-xs text-stone">{section.type}</p>
              </div>

              {fields && (
                <button
                  onClick={() => setEditingSection(section)}
                  aria-label={`Edit content for ${section.label}`}
                  className="flex items-center gap-1.5 text-xs text-stone hover:text-gold-deep transition-colors"
                >
                  <Pencil size={13} /> Edit Content
                </button>
              )}

              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} aria-label="Move up" disabled={i === 0} className="text-stone hover:text-gold-deep disabled:opacity-30">
                  <ArrowUp size={14} />
                </button>
                <button onClick={() => move(i, 1)} aria-label="Move down" disabled={i === sections.length - 1} className="text-stone hover:text-gold-deep disabled:opacity-30">
                  <ArrowDown size={14} />
                </button>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={section.isEnabled}
                  onChange={() => toggleEnabled(section.id)}
                  className="sr-only peer"
                />
                <div className="w-10 h-[22px] bg-stone-200 rounded-full peer-checked:bg-gold-deep transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-[18px] h-[18px] bg-paper rounded-full transition-transform peer-checked:translate-x-[18px]" />
              </label>
            </div>
          );
        })}
      </div>
      )}

      {editingSection && (
        <SectionContentModal
          section={editingSection}
          fields={SECTION_CONTENT_FIELDS[editingSection.type] ?? []}
          onClose={() => setEditingSection(null)}
          onSave={saveContent}
        />
      )}
    </div>
  );
}

function SectionContentModal({
  section,
  fields,
  onClose,
  onSave,
}: {
  section: HomepageSection;
  fields: { key: string; label: string; multiline?: boolean }[];
  onClose: () => void;
  onSave: (id: string, content: Record<string, string>) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(section.content ?? {});

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
      <div className="bg-paper rounded-gk-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-xl text-ink">Edit Content</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <p className="text-xs text-stone mb-6">{section.label}</p>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(section.id, values);
          }}
        >
          {fields.map((f) => (
            <label key={f.key} className="flex flex-col gap-1 text-sm">
              {f.label}
              {f.multiline ? (
                <textarea
                  rows={3}
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
                />
              ) : (
                <input
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
                />
              )}
            </label>
          ))}

          {fields.length === 0 && (
            <p className="text-sm text-stone">This section has no editable text fields.</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline-dark" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Content</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
