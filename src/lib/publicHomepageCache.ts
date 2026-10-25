import { api, type HomepageSection } from "./api";

// Public homepage sections are read by the layout and several individual
// sections. Share one request so a cold Render wake-up isn't multiplied into
// a queue of identical requests.
let sectionsPromise: Promise<HomepageSection[]> | null = null;

export function getPublicHomepageSections(): Promise<HomepageSection[]> {
  if (!sectionsPromise) {
    sectionsPromise = api.homepageSections.list().catch((error) => {
      // Permit a later retry if the initial request failed.
      sectionsPromise = null;
      throw error;
    });
  }
  return sectionsPromise;
}
