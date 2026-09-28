/**
 * Business configuration — the ONE place to edit company facts.
 *
 * Every value marked `TODO` is a placeholder until the real business data is
 * supplied. Pages, footer, SEO metadata and structured data (JSON-LD) all read
 * from here, so each fact only ever needs to be changed once.
 */

export type ServiceArea = {
  county: string;
  cities: string[];
};

export const site = {
  // TODO: legal / brand name
  name: "Company Name",
  // TODO: short name used in the nav wordmark
  shortName: "Company",
  // TODO: production URL (used for canonical URLs, sitemap and hreflang)
  url: "https://www.example.com",

  contact: {
    // TODO: real phone. `phoneHref` must be E.164 (+1XXXXXXXXXX).
    phone: "(239) 555-0100",
    phoneHref: "+12395550100",
    // TODO: real email
    email: "info@example.com",
    // TODO: WhatsApp number in E.164 without "+" (leave empty to hide)
    whatsapp: "",
  },

  // TODO: real address. Leave `street` empty to show only the city/region.
  address: {
    street: "",
    city: "Fort Myers",
    region: "FL",
    postalCode: "",
    country: "US",
  },

  // TODO: real opening hours
  hours: {
    en: "Mon – Fri 8:00 AM – 5:00 PM · Sat by appointment",
    es: "Lun – Vie 8:00 AM – 5:00 PM · Sáb con cita",
    // schema.org format for structured data
    schema: ["Mo-Fr 08:00-17:00"],
  },

  // TODO: Florida contractor license number (shown in footer — required on advertising in FL)
  license: "",
  // TODO: set true only if the business carries general liability + workers' comp
  insured: false,
  // TODO: year founded (leave null to hide "years of experience")
  foundedYear: null as number | null,

  // TODO: confirm the brands actually installed
  brands: [] as string[],

  // TODO: social profile URLs (empty string = hidden)
  social: {
    facebook: "",
    instagram: "",
    google: "",
    youtube: "",
  },

  serviceAreas: [
    {
      county: "Lee County",
      cities: [
        "Fort Myers",
        "Cape Coral",
        "Bonita Springs",
        "Estero",
        "Lehigh Acres",
        "Sanibel",
        "Fort Myers Beach",
      ],
    },
    {
      county: "Collier County",
      cities: ["Naples", "Marco Island", "Golden Gate", "Ave Maria"],
    },
    {
      county: "Charlotte County",
      cities: ["Punta Gorda", "Port Charlotte"],
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

export const yearsInBusiness = site.foundedYear
  ? new Date().getFullYear() - site.foundedYear
  : null;
