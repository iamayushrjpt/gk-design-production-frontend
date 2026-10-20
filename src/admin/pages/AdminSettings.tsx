import { useEffect, useState, type FormEvent } from "react";
import { api, USE_LIVE_API, ApiError, type SiteSettings } from "../../lib/api";
import { updateCachedSettings } from "../../lib/siteSettings";
import AdminPageHeader from "../components/AdminPageHeader";
import Button from "../../components/ui/Button";

const defaultSettings: SiteSettings = {
  businessName: "Gk Design",
  whatsappNumber: "919999999999",
  email: "hello@gkdesign.in",
  address: "4th Cross, Indiranagar, Bengaluru 560038",
  businessHours: "Mon–Sat, 10am–7pm",
};

const FIELDS: { key: Exclude<keyof SiteSettings, "socials">; label: string; hint?: string }[] = [
  { key: "businessName", label: "Business Name" },
  { key: "whatsappNumber", label: "WhatsApp Number", hint: "Digits only, country code first, no + or spaces — e.g. 919876543210" },
  { key: "email", label: "Contact Email" },
  { key: "address", label: "Address" },
  { key: "businessHours", label: "Business Hours" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(USE_LIVE_API);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!USE_LIVE_API) return;
    setLoading(true);
    api.admin.settings
      .get()
      .then(setSettings)
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : "Could not load settings."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoadError(null);

    // Guard against the most common mistake — pasting a formatted phone
    // number (with +, spaces, or dashes) into a field that becomes part of
    // a wa.me URL, where those characters break the link.
    const cleanedWhatsapp = settings.whatsappNumber.replace(/[^\d]/g, "");
    const toSave = { ...settings, whatsappNumber: cleanedWhatsapp };

    if (USE_LIVE_API) {
      setSaving(true);
      try {
        const result = await api.admin.settings.update(toSave);
        setSettings(result);
        updateCachedSettings(result); // reflect immediately across the site in this session
        setSaved(true);
      } catch (e) {
        setLoadError(e instanceof ApiError ? e.message : "Could not save settings.");
      } finally {
        setSaving(false);
      }
    } else {
      setSettings(toSave);
      updateCachedSettings(toSave);
      setSaved(true);
    }
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description={
          USE_LIVE_API
            ? "Connected to live API — changes here update the public site immediately."
            : "Demo mode (mock data) — changes here only apply to this browser session."
        }
      />

      {loadError && (
        <div className="mb-6 px-4 py-3 rounded-gk-sm bg-rust/10 text-rust text-sm max-w-2xl">{loadError}</div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-stone">Loading settings…</div>
      ) : (
      <form onSubmit={handleSave} className="bg-paper rounded-gk-lg shadow-gk-soft p-6 md:p-8 max-w-2xl flex flex-col gap-4">
        {FIELDS.map(({ key, label, hint }) => (
          <label key={key} className="flex flex-col gap-1 text-sm">
            {label}
            <input
              value={settings[key] ?? ""}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              className="px-3 py-2 border border-stone-200 rounded-gk-sm text-sm"
            />
            {hint && <span className="text-xs text-stone">{hint}</span>}
          </label>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </Button>
          {saved && <span className="text-sm text-sage">Saved — reflected on the site now.</span>}
        </div>
      </form>
      )}
    </div>
  );
}
