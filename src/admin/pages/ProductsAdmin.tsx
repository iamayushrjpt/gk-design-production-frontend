import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Copy, Archive, EyeOff, Trash2, X } from "lucide-react";
import { allProducts, categories, type Product } from "../../lib/data";
import { api, USE_LIVE_API, ApiError } from "../../lib/api";
import AdminPageHeader from "../components/AdminPageHeader";
import StatusBadge from "../components/StatusBadge";
import Button from "../../components/ui/Button";

type Status = "Published" | "Draft" | "Hidden" | "Hold" | "Archived";
type AdminProduct = Product & { status: Status };

const STATUS_OPTIONS: Status[] = ["Published", "Draft", "Hidden", "Hold", "Archived"];

// Backend enum (PUBLISHED, DRAFT, ...) <-> frontend display strings (Published, Draft, ...)
const toBackendStatus = (s: Status) => s.toUpperCase();
const fromBackendStatus = (s: string): Status =>
  (s.charAt(0) + s.slice(1).toLowerCase()) as Status;

const mockInitial: AdminProduct[] = allProducts.map((p) => ({ ...p, status: "Published" }));

export default function ProductsAdmin() {
  const [products, setProducts] = useState<AdminProduct[]>(USE_LIVE_API ? [] : mockInitial);
  const [loading, setLoading] = useState(USE_LIVE_API);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!USE_LIVE_API) return;
    setLoading(true);
    api.admin.products
      .list()
      .then((res) =>
        setProducts(res.items.map((p) => ({ ...p, status: fromBackendStatus(p.status) }) as AdminProduct))
      )
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : "Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, statusFilter]);

  const updateStatus = async (slug: string, status: Status) => {
    setProducts((prev) => prev.map((p) => (p.slug === slug ? { ...p, status } : p)));
    if (USE_LIVE_API) {
      try {
        await api.admin.products.updateStatus(slug, toBackendStatus(status));
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not update status.");
      }
    }
  };

  const duplicateProduct = async (product: AdminProduct) => {
    if (USE_LIVE_API) {
      try {
        const copy = await api.admin.products.duplicate(product.slug);
        setProducts((prev) => [{ ...copy, status: "Draft" } as AdminProduct, ...prev]);
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not duplicate product.");
      }
      return;
    }
    const copy: AdminProduct = {
      ...product,
      slug: `${product.slug}-copy-${Date.now()}`,
      sku: `${product.sku}-COPY`,
      name: `${product.name} (Copy)`,
      status: "Draft",
    };
    setProducts((prev) => [copy, ...prev]);
  };

  const deleteProduct = async (product: AdminProduct) => {
    if (!window.confirm(`Delete "${product.name}"? This removes it from the site. This can't be undone from here.`)) {
      return;
    }
    const previous = products;
    setProducts((prev) => prev.filter((p) => p.slug !== product.slug));
    if (USE_LIVE_API) {
      try {
        await api.admin.products.remove(product.slug);
      } catch (e) {
        setProducts(previous); // roll back the optimistic removal if the API call failed
        setLoadError(e instanceof ApiError ? e.message : "Could not delete product.");
      }
    }
  };

  const handleSave = async (saved: AdminProduct) => {
    if (USE_LIVE_API) {
      try {
        const payload = { ...saved, status: toBackendStatus(saved.status) };
        const result = editing
          ? await api.admin.products.update(saved.slug, payload)
          : await api.admin.products.create(payload);
        const withStatus = { ...result, status: saved.status } as AdminProduct;
        setProducts((prev) => {
          const exists = prev.some((p) => p.slug === withStatus.slug);
          return exists
            ? prev.map((p) => (p.slug === withStatus.slug ? withStatus : p))
            : [withStatus, ...prev];
        });
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not save product.");
      }
    } else {
      setProducts((prev) => {
        const exists = prev.some((p) => p.slug === saved.slug);
        return exists ? prev.map((p) => (p.slug === saved.slug ? saved : p)) : [saved, ...prev];
      });
    }
    setEditing(null);
    setShowAddForm(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description={
          USE_LIVE_API
            ? `${products.length} total products · connected to live API`
            : `${products.length} total products · demo mode (mock data)`
        }
        action={
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => setShowAddForm(true)}>
            Add Product
          </Button>
        }
      />

      {loadError && (
        <div className="mb-6 px-4 py-3 rounded-gk-sm bg-rust/10 text-rust text-sm">{loadError}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, SKU, category…"
          className="flex-1 px-4 py-2.5 rounded-gk-sm border border-stone-200 bg-paper text-sm focus-visible:outline-gold"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-gk-sm border border-stone-200 bg-paper text-sm"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-paper rounded-gk-lg shadow-gk-soft overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-sm text-stone">Loading products…</div>
        ) : (
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-stone uppercase tracking-wide border-b border-stone-200">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.slug} className="border-b border-stone-200 last:border-0">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="w-9 h-9 rounded-gk-sm object-cover" />
                    <div>
                      <p className="text-ink">{p.name}</p>
                      <p className="text-xs text-stone">{p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-stone">{p.category}</td>
                <td className="px-5 py-3 text-ink">₹{p.price.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3">
                  <select
                    value={p.status}
                    onChange={(e) => updateStatus(p.slug, e.target.value as Status)}
                    className="bg-transparent text-xs border-none focus-visible:outline-gold cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="mt-1"><StatusBadge status={p.status} /></div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(p)} aria-label="Edit product" className="text-stone hover:text-gold-deep">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => duplicateProduct(p)} aria-label="Duplicate product" className="text-stone hover:text-gold-deep">
                      <Copy size={15} />
                    </button>
                    <button onClick={() => updateStatus(p.slug, "Hidden")} aria-label="Hide product" className="text-stone hover:text-gold-deep">
                      <EyeOff size={15} />
                    </button>
                    <button onClick={() => updateStatus(p.slug, "Archived")} aria-label="Archive product" className="text-stone hover:text-rust">
                      <Archive size={15} />
                    </button>
                    <button onClick={() => deleteProduct(p)} aria-label="Delete product" className="text-stone hover:text-rust">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-stone text-sm">No products match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>

      {(editing || showAddForm) && (
        <ProductFormModal
          product={editing}
          categoryOptions={categories.map((c) => c.name)}
          onClose={() => {
            setEditing(null);
            setShowAddForm(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ProductFormModal({
  product,
  categoryOptions,
  onClose,
  onSave,
}: {
  product: AdminProduct | null;
  categoryOptions: string[];
  onClose: () => void;
  onSave: (p: AdminProduct) => void;
}) {
  const [form, setForm] = useState<AdminProduct>(
    product ?? {
      slug: `new-product-${Date.now()}`,
      sku: "",
      name: "",
      category: categoryOptions[0],
      brand: "Gk Design",
      price: 0,
      material: "",
      finish: "",
      dimensions: { l: 0, w: 0, h: 0, unit: "cm" },
      weight: "",
      images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900&q=80"],
      isLuxury: false,
      rating: 0,
      ratingCount: 0,
      stockStatus: "In Stock",
      description: "",
      features: [],
      careInstructions: "",
      deliveryInfo: "",
      estimatedDeliveryDays: "",
      colors: [{ name: "Default", hex: "#A9773F" }],
      sizes: ["Standard"],
      status: "Draft",
    }
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
      <div className="bg-paper rounded-gk-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ink">{product ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} aria-label="Close form"><X size={20} /></button>
        </div>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
        >
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            Product Name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            SKU
            <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm">
              {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Price (₹)
            <input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Material
            <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            Description
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm" />
          </label>

          <div className="flex flex-col gap-2 text-sm sm:col-span-2">
            <span>Product Images</span>
            <div className="flex flex-wrap gap-3">
              {form.images.map((img, i) => (
                <div key={img + i} className="relative w-20 h-20 rounded-gk-sm overflow-hidden border border-stone-200 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-0 left-0 bg-ink text-ivory text-[9px] px-1.5 py-0.5">Cover</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                    aria-label="Remove image"
                    className="absolute inset-0 bg-ink/60 text-ivory flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste an image URL and press Add"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
              />
              <Button
                type="button"
                variant="outline-dark"
                onClick={() => {
                  if (!newImageUrl.trim()) return;
                  setForm({ ...form, images: [...form.images, newImageUrl.trim()] });
                  setNewImageUrl("");
                }}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-stone">First image is the cover shown on product cards. Manage the full library in Media Library.</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isLuxury} onChange={(e) => setForm({ ...form, isLuxury: e.target.checked })} className="accent-gold-deep w-4 h-4" />
            Mark as Luxury
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline-dark" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">{product ? "Save Changes" : "Create Product"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
