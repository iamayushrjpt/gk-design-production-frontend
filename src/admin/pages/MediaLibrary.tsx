import { useEffect, useRef, useState } from "react";
import { Upload, Search, Trash2, Copy, Pencil, X, Link as LinkIcon, Loader2 } from "lucide-react";
import { mediaAssets as mockMediaAssets } from "../lib/adminData";
import { api, USE_LIVE_API, ApiError, type MediaAsset } from "../../lib/api";
import AdminPageHeader from "../components/AdminPageHeader";
import Button from "../../components/ui/Button";

export default function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>(USE_LIVE_API ? [] : mockMediaAssets);
  const [loading, setLoading] = useState(USE_LIVE_API);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);

  useEffect(() => {
    if (!USE_LIVE_API) return;
    setLoading(true);
    api.admin.media
      .list()
      .then((res) => setAssets(res.items))
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : "Could not load media library."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = assets.filter((m) =>
    `${m.filename} ${m.folder}`.toLowerCase().includes(query.toLowerCase())
  );

  const copyUrl = async (id: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const deleteAsset = async (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    if (USE_LIVE_API) {
      try {
        await api.admin.media.remove(id);
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not delete asset.");
      }
    }
  };

  // Called once an asset already exists (either uploaded to Cloudflare R2, or added
  // by URL) — just needs to land in local state.
  const onAssetCreated = (asset: MediaAsset) => {
    setAssets((prev) => [asset, ...prev]);
    setShowAddModal(false);
  };

  const addByUrl = async (draft: Omit<MediaAsset, "id" | "createdAt">) => {
    setLoadError(null);
    if (USE_LIVE_API) {
      try {
        const created = await api.admin.media.create(draft);
        onAssetCreated(created);
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not save this image.");
      }
    } else {
      onAssetCreated({ ...draft, id: `local-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) });
    }
  };

  const saveEdit = async (updated: MediaAsset) => {
    setLoadError(null);
    if (USE_LIVE_API) {
      try {
        const saved = await api.admin.media.update(updated);
        setAssets((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not update this image.");
        return;
      }
    } else {
      setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }
    setEditingAsset(null);
  };

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description={
          USE_LIVE_API
            ? `${assets.length} assets · connected to live API · uploads stored in Cloudflare R2`
            : `${assets.length} assets · demo mode`
        }
        action={<Button variant="primary" icon={<Upload size={16} />} onClick={() => setShowAddModal(true)}>Add Image</Button>}
      />

      {loadError && (
        <div className="mb-6 px-4 py-3 rounded-gk-sm bg-rust/10 text-rust text-sm">{loadError}</div>
      )}

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search filename or folder…"
          className="w-full pl-10 pr-4 py-2.5 rounded-gk-sm border border-stone-200 bg-paper text-sm focus-visible:outline-gold"
        />
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-stone">Loading media…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-stone">
          {assets.length === 0 ? "No images yet — add your first one." : "No images match your search."}
        </div>
      ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((asset) => (
          <div key={asset.id} className="group relative bg-paper rounded-gk-md overflow-hidden shadow-gk-soft">
            <img src={asset.url} alt={asset.filename} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => copyUrl(asset.id, asset.url)} aria-label="Copy URL" className="w-8 h-8 rounded-full bg-paper flex items-center justify-center">
                <Copy size={14} className="text-ink" />
              </button>
              <button onClick={() => setEditingAsset(asset)} aria-label="Edit image details" className="w-8 h-8 rounded-full bg-paper flex items-center justify-center">
                <Pencil size={14} className="text-ink" />
              </button>
              <button onClick={() => deleteAsset(asset.id)} aria-label="Delete asset" className="w-8 h-8 rounded-full bg-paper flex items-center justify-center">
                <Trash2 size={14} className="text-rust" />
              </button>
            </div>
            <p className="absolute top-1 left-1 right-1 text-[10px] text-ivory bg-ink/60 rounded px-1.5 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
              {asset.filename}
            </p>
            {copiedId === asset.id && (
              <span className="absolute bottom-1 left-1 right-1 text-[10px] text-center bg-ink text-ivory rounded-full py-0.5">
                Copied
              </span>
            )}
          </div>
        ))}
      </div>
      )}

      {showAddModal && (
        <AddImageModal onClose={() => setShowAddModal(false)} onUploaded={onAssetCreated} onAddByUrl={addByUrl} />
      )}
      {editingAsset && (
        <EditImageModal asset={editingAsset} onClose={() => setEditingAsset(null)} onSave={saveEdit} />
      )}
    </div>
  );
}

function AddImageModal({
  onClose,
  onUploaded,
  onAddByUrl,
}: {
  onClose: () => void;
  onUploaded: (asset: MediaAsset) => void;
  onAddByUrl: (draft: Omit<MediaAsset, "id" | "createdAt">) => void;
}) {
  // File upload needs a real backend (R2 lives behind it) — default to
  // URL mode in demo mode where there's nothing to upload to.
  const [mode, setMode] = useState<"url" | "upload">(USE_LIVE_API ? "upload" : "url");
  const [url, setUrl] = useState("");
  const [folder, setFolder] = useState("general");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const asset = await api.admin.media.upload(file, folder);
      onUploaded(asset);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const filename = url.split("/").pop()?.split("?")[0] || "image.jpg";
    onAddByUrl({ url: url.trim(), filename, folder });
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
      <div className="bg-paper rounded-gk-lg max-w-md w-full p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ink">Add Image</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("upload")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-gk-sm text-sm border ${mode === "upload" ? "bg-ink text-ivory border-ink" : "border-stone-200 text-stone"}`}
          >
            <Upload size={14} /> Upload File
          </button>
          <button
            onClick={() => setMode("url")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-gk-sm text-sm border ${mode === "url" ? "bg-ink text-ivory border-ink" : "border-stone-200 text-stone"}`}
          >
            <LinkIcon size={14} /> Add by URL
          </button>
        </div>

        <label className="flex flex-col gap-1 text-sm mb-4">
          Folder
          <input
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g. furniture, lighting"
            className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
          />
        </label>

        {mode === "upload" ? (
          USE_LIVE_API ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex flex-col items-center gap-2 py-10 border-2 border-dashed border-stone-200 rounded-gk-sm text-stone hover:border-gold-deep hover:text-gold-deep transition-colors"
              >
                {uploading ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} />}
                <span className="text-sm">{uploading ? "Uploading…" : "Click to choose an image"}</span>
              </button>
              <p className="text-xs text-stone mt-2">Uploads go to the backend's Cloudflare R2 storage. Max 10MB.</p>
            </div>
          ) : (
            <p className="text-sm text-stone bg-gold-mist/40 rounded-gk-sm p-4">
              File upload needs a running backend (uploads are stored in Cloudflare R2 via the API) — demo mode has
              nowhere to send the file. Use "Add by URL" instead, or set <code className="text-xs">VITE_API_BASE_URL</code> to
              connect a real backend.
            </p>
          )
        ) : (
          <form onSubmit={handleUrlSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm">
              Image URL
              <input
                required
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
                className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
              />
            </label>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline-dark" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary">Add Image</Button>
            </div>
          </form>
        )}

        {error && <p className="text-sm text-rust mt-4">{error}</p>}
      </div>
    </div>
  );
}

function EditImageModal({
  asset,
  onClose,
  onSave,
}: {
  asset: MediaAsset;
  onClose: () => void;
  onSave: (a: MediaAsset) => void;
}) {
  const [form, setForm] = useState(asset);

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4">
      <div className="bg-paper rounded-gk-lg max-w-md w-full p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ink">Edit Image Details</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <img src={form.url} alt={form.filename} className="w-full aspect-video object-cover rounded-gk-sm mb-4" />

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            Filename
            <input
              value={form.filename}
              onChange={(e) => setForm({ ...form, filename: e.target.value })}
              className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Folder
            <input
              value={form.folder}
              onChange={(e) => setForm({ ...form, folder: e.target.value })}
              className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Image URL
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline-dark" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
