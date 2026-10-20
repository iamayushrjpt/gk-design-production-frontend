import { useEffect, useState } from "react";
import { api, USE_LIVE_API } from "./api";

export type SiteSettingsData = {
  businessName: string;
  whatsappNumber: string;
  email: string;
  address: string;
  businessHours: string;
  socials?: Record<string, string>;
};

const DEFAULT_SETTINGS: SiteSettingsData = {
  businessName: "Gk Design",
  whatsappNumber: "919999999999",
  email: "hello@gkdesign.in",
  address: "4th Cross, Indiranagar, Bengaluru 560038",
  businessHours: "Mon–Sat, 10am–7pm",
};

// Module-level cache so non-component code (buildWhatsAppUrl) can read the
// latest fetched settings synchronously, not just React components. Updated
// once the live fetch resolves; every consumer re-renders via the same
// custom-event pattern used by wishlist.ts / recentlyViewed.ts.
let currentSettings: SiteSettingsData = DEFAULT_SETTINGS;
let hasFetched = false;
let fetchPromise: Promise<void> | null = null;

const EVENT_NAME = "gk_settings_change";

function setSettings(next: SiteSettingsData) {
  currentSettings = next;
  window.dispatchEvent(new Event(EVENT_NAME));
}

/** Synchronous read for non-React code (e.g. src/lib/whatsapp.ts). */
export function getSiteSettings(): SiteSettingsData {
  return currentSettings;
}

/** Called by the admin Settings page right after a successful save, so the
 * rest of the app (in the same browser tab/session) reflects the change
 * immediately instead of waiting for the next fetch. */
export function updateCachedSettings(next: SiteSettingsData) {
  hasFetched = true;
  setSettings(next);
}

/** Kicks off the live fetch at most once per page load; safe to call from multiple places. */
function ensureFetched() {
  if (!USE_LIVE_API || hasFetched || fetchPromise) return;
  fetchPromise = api.settings
    .get()
    .then((data) => {
      setSettings({ ...DEFAULT_SETTINGS, ...data });
      hasFetched = true;
    })
    .catch(() => {
      // Best-effort — keep defaults if this fails, never break the site over it
      hasFetched = true;
    });
}

/** React hook for components that need to display settings and re-render when they change. */
export function useSiteSettings(): SiteSettingsData {
  const [settings, setLocalSettings] = useState(currentSettings);

  useEffect(() => {
    ensureFetched();
    const sync = () => setLocalSettings(currentSettings);
    window.addEventListener(EVENT_NAME, sync);
    return () => window.removeEventListener(EVENT_NAME, sync);
  }, []);

  return settings;
}
