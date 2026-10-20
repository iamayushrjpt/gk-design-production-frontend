import { useEffect, useState } from "react";
import { Package, FolderTree, MessageCircle, Star, Eye } from "lucide-react";
import { allProducts, categories as mockCategories, type Product } from "../../lib/data";
import { whatsappInquiries as mockInquiries } from "../lib/adminData";
import { api, USE_LIVE_API, type WhatsAppInquiry } from "../../lib/api";
import AdminPageHeader from "../components/AdminPageHeader";
import StatCard from "../components/StatCard";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [categoryCount, setCategoryCount] = useState(mockCategories.length);
  const [inquiries, setInquiries] = useState<WhatsAppInquiry[]>(mockInquiries);
  const [loading, setLoading] = useState(USE_LIVE_API);

  useEffect(() => {
    if (!USE_LIVE_API) return;
    setLoading(true);
    Promise.all([
      api.admin.products.list({ size: 100 }),
      api.admin.categories.list(),
      api.admin.inquiries.list({ size: 100 }),
    ])
      .then(([productsRes, categoriesRes, inquiriesRes]) => {
        setProducts(productsRes.items);
        setCategoryCount(categoriesRes.length);
        setInquiries(inquiriesRes.items);
      })
      .catch(() => {
        // Dashboard is read-only/best-effort — silently keep whatever loaded, no blocking error banner
      })
      .finally(() => setLoading(false));
  }, []);

  const featuredCount = products.filter((p) => p.isBestSeller || p.isNewArrival).length;
  const mostViewed = [...products].sort((a, b) => b.ratingCount - a.ratingCount).slice(0, 5);

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description={
          USE_LIVE_API
            ? "A snapshot of the catalog and customer activity — connected to live API."
            : "A snapshot of the catalog and customer activity — demo mode (mock data)."
        }
      />

      {loading ? (
        <div className="py-16 text-center text-sm text-stone">Loading dashboard…</div>
      ) : (
      <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Package} label="Total Products" value={products.length} />
        <StatCard icon={FolderTree} label="Categories" value={categoryCount} />
        <StatCard icon={MessageCircle} label="WhatsApp Inquiries" value={inquiries.length} />
        <StatCard icon={Star} label="Featured Products" value={featuredCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-paper rounded-gk-lg p-6 shadow-gk-soft">
          <h2 className="font-display text-lg text-ink mb-4">Most Viewed Products</h2>
          <div className="flex flex-col divide-y divide-stone-200">
            {mostViewed.map((p) => (
              <div key={p.slug} className="flex items-center gap-3 py-3">
                <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-gk-sm object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink truncate">{p.name}</p>
                  <p className="text-xs text-stone">{p.sku}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-stone">
                  <Eye size={13} /> {p.ratingCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-paper rounded-gk-lg p-6 shadow-gk-soft">
          <h2 className="font-display text-lg text-ink mb-4">Recent WhatsApp Inquiries</h2>
          <div className="flex flex-col divide-y divide-stone-200">
            {inquiries.slice(0, 5).map((inq) => (
              <div key={inq.id} className="flex items-center justify-between py-3 gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-ink truncate">{inq.productName}</p>
                  <p className="text-xs text-stone">{inq.variant}</p>
                </div>
                <span className="text-xs text-stone shrink-0">{inq.createdAt}</span>
              </div>
            ))}
            {inquiries.length === 0 && <p className="text-sm text-stone py-3">No inquiries yet.</p>}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
