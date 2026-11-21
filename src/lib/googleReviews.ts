import "server-only";
import type { Locale } from "@/lib/i18n";

/**
 * Google reviews for the business, read from the Places API (New).
 *
 * Needs two server-only env vars (Netlify → Site configuration → Environment
 * variables, and .env.local for local work):
 *   GOOGLE_PLACES_API_KEY  API key restricted to "Places API (New)"
 *   GOOGLE_PLACE_ID        Place ID of the Google Business Profile
 *
 * Without them, or while the profile has no reviews, this returns null and the
 * reviews section is not rendered. Google returns at most 5 reviews; the
 * section links to the profile for the rest.
 *
 * Only real Google reviews are ever shown in production (FTC fake-review rule).
 * The sample data below is used only by `next dev` when no key is configured.
 */

export type GoogleReview = {
  author: string;
  authorUri?: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  relativeTime: string;
};

export type GoogleReviewsData = {
  rating: number;
  total: number;
  mapsUri: string;
  reviews: GoogleReview[];
  sample?: boolean;
};

/** Profile review link (opens the "write a review" box on Google). */
export const googleReviewUrl = "https://g.page/r/CcJaXeWcrhlNEBM/review";

// Refresh at most every 3 hours per language: ~480 calls/month, inside the
// Places API monthly free usage.
const REVALIDATE_SECONDS = 60 * 60 * 3;

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }[];
};

export async function getGoogleReviews(lang: Locale): Promise<GoogleReviewsData | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!key || !placeId) {
    return process.env.NODE_ENV === "development" ? sampleReviews : null;
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${lang}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) {
      console.error(`Google reviews: Places API returned ${res.status}`);
      return null;
    }
    const data = (await res.json()) as PlacesResponse;

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        authorUri: r.authorAttribution?.uri,
        authorPhoto: r.authorAttribution?.photoUri,
        rating: r.rating ?? 0,
        text: r.text?.text ?? r.originalText?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
      }))
      .filter((r) => r.rating > 0);

    if (!reviews.length || !data.rating || !data.userRatingCount) return null;

    return {
      rating: data.rating,
      total: data.userRatingCount,
      mapsUri: data.googleMapsUri ?? googleReviewUrl,
      reviews,
    };
  } catch (err) {
    console.error("Google reviews: request failed", err);
    return null;
  }
}

/** Development-only placeholder so the layout can be previewed. Never shipped. */
const sampleReviews: GoogleReviewsData = {
  rating: 5,
  total: 3,
  mapsUri: googleReviewUrl,
  sample: true,
  reviews: [
    {
      author: "Sample Reviewer",
      rating: 5,
      text: "Placeholder review text used only in local development to preview the layout. Real Google reviews replace this automatically.",
      relativeTime: "2 weeks ago",
    },
    {
      author: "Reseña de ejemplo",
      rating: 5,
      text: "Texto de ejemplo solo para ver el diseño en desarrollo local.",
      relativeTime: "1 month ago",
    },
    {
      author: "Another Sample",
      rating: 4,
      text: "Short sample.",
      relativeTime: "3 months ago",
    },
  ],
};
