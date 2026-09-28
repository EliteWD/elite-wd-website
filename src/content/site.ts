/**
 * Business configuration — the ONE place to edit company facts.
 *
 * Pages, footer, SEO metadata and structured data (JSON-LD) all read from
 * here, so each fact only ever needs to be changed once.
 */

export type ServiceArea = {
  county: string;
  cities: string[];
};

export const site = {
  name: "Elite W&D Installers LLC",
  shortName: "Elite W&D Installers",
  // TODO: production URL (used for canonical URLs, sitemap and hreflang)
  url: "https://www.example.com",

  contact: {
    phone: "(305) 963-8935",
    phoneHref: "+13059638935",
    email: "carlosq@elitewdi.com",
    // WhatsApp number in E.164 without "+" (empty = hidden)
    whatsapp: "",
  },

  /**
   * Service-area business: no street address is published. Only the region
   * is used, for structured data.
   */
  region: { name: "Southwest Florida", state: "FL", country: "US" },

  // Registered and insured (shown in footer, about page and structured data).
  registered: true,
  insured: true,
  // Florida contractor license number — shown in the footer when set.
  // Intentionally empty: the owner will provide it when ready.
  license: "",

  // Social profile URLs (empty string = hidden). None yet.
  social: {
    facebook: "",
    instagram: "",
    google: "",
    youtube: "",
  },

  serviceAreas: [
    {
      county: "Lee County",
      cities: ["Cape Coral", "Fort Myers", "Lehigh Acres", "Bonita Springs", "Estero"],
    },
    {
      county: "Collier County",
      cities: ["Naples"],
    },
    {
      county: "Charlotte County",
      cities: ["Port Charlotte", "Punta Gorda"],
    },
  ] as ServiceArea[],

  /**
   * Estimate form delivery. Leave empty until a provider is chosen
   * (e.g. Formspree: "https://formspree.io/f/xxxxxxx"). While empty the form
   * validates normally and then asks the visitor to call instead.
   */
  formEndpoint: "",
};

export const allCities = site.serviceAreas.flatMap((area) => area.cities);
