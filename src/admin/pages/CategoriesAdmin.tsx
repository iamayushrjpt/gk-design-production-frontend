import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, EyeOff, Eye, ArrowUp, ArrowDown, X } from "lucide-react";
import { categories as mockCategories, type Category } from "../../lib/data";
import { api, USE_LIVE_API, ApiError } from "../../lib/api";
import AdminPageHeader from "../components/AdminPageHeader";
import Button from "../../components/ui/Button";

type AdminCategory = Category & { isHidden: boolean };

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<AdminCategory[]>(
    USE_LIVE_API ? [] : mockCategories.map((c) => ({ ...c, isHidden: false }))
  );
  const [loading, setLoading] = useState(USE_LIVE_API);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!USE_LIVE_API) return;
    setLoading(true);
    api.admin.categories
      .list()
      .then((res) => setCategories(res as AdminCategory[]))
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : "Could not load categories."))
      .finally(() => setLoading(false));
  }, []);

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;

    const next = [...categories];
    [next[index], next[target]] = [next[target], next[index]];
    setCategories(next);

    if (USE_LIVE_API) {
      try {
        await Promise.all([
          api.admin.categories.update(next[index].slug, { ...next[index], order: index }),
          api.admin.categories.update(next[target].slug, { ...next[target], order: target }),
        ]);
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not reorder categories.");
      }
    }
  };

  const toggleHidden = async (slug: string) => {
    const category = categories.find((c) => c.slug === slug);
    if (!category) return;
    const nextHidden = !category.isHidden;
    setCategories((prev) => prev.map((c) => (c.slug === slug ? { ...c, isHidden: nextHidden } : c)));

    if (USE_LIVE_API) {
      try {
        await api.admin.categories.update(slug, { ...category, isHidden: nextHidden });
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not update category visibility.");
      }
    }
  };

  const remove = async (slug: string) => {
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
    if (USE_LIVE_API) {
      try {
        await api.admin.categories.remove(slug);
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not delete category.");
      }
    }
  };

  const handleSave = async (saved: AdminCategory, isNew: boolean) => {
    setLoadError(null);

    if (USE_LIVE_API) {
      try {
        const result = isNew
          ? await api.admin.categories.create(saved)
          : await api.admin.categories.update(saved.slug, saved);
        const withHidden = { ...result, isHidden: saved.isHidden } as AdminCategory;
        setCategories((prev) => {
          const exists = prev.some((c) => c.slug === withHidden.slug);
          return exists
            ? prev.map((c) => (c.slug === withHidden.slug ? withHidden : c))
            : [...prev, withHidden];
        });
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not save category.");
        return; // keep the modal open so the user can retry
      }
    } else {
      setCategories((prev) => {
        const exists = prev.some((c) => c.slug === saved.slug);
        return exists ? prev.map((c) => (c.slug === saved.slug ? saved : c)) : [...prev, saved];
      });
    }

    setEditing(null);
    setShowAddForm(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description={
          USE_LIVE_API
            ? "Connected to live API — order here matches the public site."
            : "Demo mode (mock data) — categories appear across the site in this order."
        }
        action={
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowAddForm(true)}>
            Add Category
          </Button>
        }
      />

      {loadError && (
        <div className="mb-6 px-4 py-3 rounded-gk-sm bg-rust/10 text-rust text-sm">{loadError}</div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-stone">Loading categories…</div>
      ) : (
      <div className="bg-paper rounded-gk-lg shadow-gk-soft divide-y divide-stone-200">
        {categories.map((cat, i) => (
          <div key={cat.slug} className="flex items-center gap-4 px-5 py-4">
            <div className="flex flex-col">
              <button onClick={() => move(i, -1)} aria-label="Move up" disabled={i === 0} className="text-stone hover:text-gold-deep disabled:opacity-30">
                <ArrowUp size={14} />
              </button>
              <button onClick={() => move(i, 1)} aria-label="Move down" disabled={i === categories.length - 1} className="text-stone hover:text-gold-deep disabled:opacity-30">
                <ArrowDown size={14} />
              </button>
            </div>
            <img src={cat.image} alt="" className="w-12 h-12 rounded-gk-sm object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink">{cat.name}</p>
              <p className="text-xs text-stone">{cat.count} products · /{cat.slug}</p>
            </div>
            {cat.isHidden && <span className="text-xs px-2 py-1 rounded-full bg-stone-200 text-stone">Hidden</span>}
            <div className="flex items-center gap-3">
              <button onClick={() => toggleHidden(cat.slug)} aria-label={cat.isHidden ? "Show category" : "Hide category"} className="text-stone hover:text-gold-deep">
                {cat.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => setEditing(cat)} aria-label="Edit category" className="text-stone hover:text-gold-deep">
                <Pencil size={16} />
              </button>
              <button onClick={() => remove(cat.slug)} aria-label="Delete category" className="text-stone hover:text-rust">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-10 text-stone text-sm">No categories yet — add your first one.</div>
        )}
      </div>
      )}

      {(editing || showAddForm) && (
        <CategoryFormModal
          category={editing}
          nextOrder={categories.length}
          onClose={() => {
            setEditing(null);
            setShowAddForm(false);
          }}
          onSave={(saved) => handleSave(saved, !editing)}
        />
      )}
    </div>
  );
}

function slugify(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function CategoryFormModal({
  category,
  nextOrder,
  onClose,
  onSave,
}: {
  category: AdminCategory | null;
  nextOrder: number;
  onClose: () => void;
  onSave: (c: AdminCategory) => void;
}) {
  const [form, setForm] = useState<AdminCategory>(
    category ?? {
      slug: "",
      name: "",
      description: "",
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
      count: 0,
      isHidden: false,
    }
  );

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
      <div className="bg-paper rounded-gk-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ink">{category ? "Edit Category" : "Add Category"}</h2>
          <button onClick={onClose} aria-label="Close form"><X size={20} /></button>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const slug = form.slug || slugify(form.name);
            onSave({ ...form, slug, order: category ? undefined : nextOrder } as AdminCategory);
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            URL Slug
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder={form.name ? slugify(form.name) : "auto-generated from name"}
              className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Banner Image URL
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline-dark" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">{category ? "Save Changes" : "Create Category"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
