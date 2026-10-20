import { useEffect, useState } from "react";
import { whatsappInquiries as mockInquiries } from "../lib/adminData";
import { api, USE_LIVE_API, ApiError, type WhatsAppInquiry } from "../../lib/api";
import AdminPageHeader from "../components/AdminPageHeader";

export default function InquiriesLog() {
  const [inquiries, setInquiries] = useState<WhatsAppInquiry[]>(USE_LIVE_API ? [] : mockInquiries);
  const [loading, setLoading] = useState(USE_LIVE_API);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!USE_LIVE_API) return;
    setLoading(true);
    api.admin.inquiries
      .list()
      .then((res) => setInquiries(res.items))
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : "Could not load inquiries."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="WhatsApp Inquiries"
        description={
          USE_LIVE_API
            ? "Connected to live API — logged the moment a customer taps 'Book on WhatsApp.'"
            : "Demo mode (mock data) — logged the moment a customer taps 'Book on WhatsApp,' before the redirect."
        }
      />

      {loadError && (
        <div className="mb-6 px-4 py-3 rounded-gk-sm bg-rust/10 text-rust text-sm">{loadError}</div>
      )}

      <div className="bg-paper rounded-gk-lg shadow-gk-soft overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-sm text-stone">Loading inquiries…</div>
        ) : (
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-xs text-stone uppercase tracking-wide border-b border-stone-200">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Variant</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id} className="border-b border-stone-200 last:border-0">
                <td className="px-5 py-3 text-ink">{inq.productName}</td>
                <td className="px-5 py-3 text-stone">{inq.sku}</td>
                <td className="px-5 py-3 text-stone">{inq.variant}</td>
                <td className="px-5 py-3 text-ink">₹{inq.price.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3 text-stone">{inq.createdAt}</td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-stone text-sm">No inquiries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
