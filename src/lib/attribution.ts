/**
 * Ad attribution for the estimate form: the Meta click id (`fbclid`, from the ad URL)
 * and the Meta browser id (`_fbp` cookie, set by the Pixel). Both travel with the lead to
 * GoHighLevel so its Conversions API events (Schedule, Purchase) can be matched to the ad.
 * Neither one is personal data on its own: they are random identifiers.
 */

const STORAGE_KEY = "elitewdi_fbclid";
const MAX_AGE = 90 * 24 * 60 * 60 * 1000; // same window Meta uses for its own _fbc cookie

/** fbclid is URL-safe base64-like; anything else is dropped. */
export const FBCLID_PATTERN = /^[A-Za-z0-9_-]{10,300}$/;
/** _fbp looks like fb.1.1700000000000.1234567890 */
export const FBP_PATTERN = /^fb\.\d\.\d{10,13}\.\d{5,12}$/;

function fromUrl(): string {
  const value = new URLSearchParams(window.location.search).get("fbclid") ?? "";
  return FBCLID_PATTERN.test(value) ? value : "";
}

function fromStorage(): string {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as
      | { value?: string; at?: number }
      | null;
    if (saved?.value && FBCLID_PATTERN.test(saved.value) && Date.now() - (saved.at ?? 0) < MAX_AGE) {
      return saved.value;
    }
  } catch {
    // Storage blocked or corrupt: behave as if nothing was saved.
  }
  return "";
}

/** Call on every page load: keeps the click id from the landing URL for later pages. */
export function captureAttribution() {
  const fbclid = fromUrl();
  if (!fbclid) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: fbclid, at: Date.now() }));
  } catch {
    // Storage blocked: the URL value is still used if the form is on the landing page.
  }
}

export function getAttribution(): { fbclid: string; fbp: string } {
  const cookie = document.cookie.split("; ").find((c) => c.startsWith("_fbp="));
  const fbp = cookie ? decodeURIComponent(cookie.slice(5)) : "";
  return {
    fbclid: fromUrl() || fromStorage(),
    fbp: FBP_PATTERN.test(fbp) ? fbp : "",
  };
}
