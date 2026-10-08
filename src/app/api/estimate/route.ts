import { es } from "@/content/dictionaries/es";

/**
 * Estimate form relay → GoHighLevel inbound webhook.
 *
 * The webhook URL lives only in the GHL_WEBHOOK_URL environment variable
 * (.env.local locally, Netlify → Site configuration → Environment variables
 * in production), so it never ships in page code. Every premium-trigger run
 * costs money, so spam is dropped here before it reaches GoHighLevel:
 * honeypot, server-side validation and a per-IP rate limit.
 */

const MAX_PER_HOUR = 5;
const HOUR = 60 * 60 * 1000;
// Best effort: serverless instances don't share memory, so this slows a
// single flood rather than guaranteeing a global cap.
const recent = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < HOUR);
  if (hits.length >= MAX_PER_HOUR) return true;
  hits.push(now);
  recent.set(ip, hits);
  return false;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const form = es.contact.form;

/** Readable label for a choice value; unknown values are rejected. */
function label(options: Record<string, string>, value: string) {
  return Object.hasOwn(options, value) ? options[value] : null;
}

export async function POST(request: Request) {
  const webhook = process.env.GHL_WEBHOOK_URL;
  if (!webhook) return Response.json({ error: "not configured" }, { status: 503 });

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const get = (key: string) => String(data.get(key) ?? "").trim().slice(0, 2000);

  // Bots fill the hidden field; pretend success so they don't retry.
  if (get("company")) return Response.json({ ok: true });

  const ip = request.headers.get("x-nf-client-connection-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim()
    ?? "unknown";
  if (rateLimited(ip)) return Response.json({ error: "too many requests" }, { status: 429 });

  const name = get("name");
  const digits = get("phone").replace(/\D/g, "");
  const email = get("email");
  const city = get("city");
  const project = label(form.projectOptions, get("project"));
  const propertyType = label(form.propertyTypeOptions, get("propertyType"));
  const timeline = label(form.timelineOptions, get("timeline"));

  if (
    name.length < 2 ||
    digits.length < 10 ||
    !emailPattern.test(email) ||
    !city ||
    !project ||
    !propertyType ||
    !timeline
  ) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const [firstName, ...rest] = name.split(/\s+/);
  const payload = {
    first_name: firstName,
    last_name: rest.join(" "),
    full_name: name,
    phone: digits.length === 10 ? `+1${digits}` : `+${digits}`,
    email,
    city,
    state: "FL",
    project,
    property_type: propertyType,
    timeline,
    openings: get("openings"),
    message: get("message"),
    language: get("language") === "es" ? "Español" : "English",
    source: "elitewdi.com – Estimate form",
  };

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(String(response.status));
  } catch {
    return Response.json({ error: "upstream" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
