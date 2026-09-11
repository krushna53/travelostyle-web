import { notFound } from "next/navigation";
import SearchBar from "@/components/JourneyDetailPage/SearchBar";
import JourneyDetailClient from "@/components/JourneyDetailPage/JourneyDetailClient";
import Footer from "@/components/Footer";
import TestimonialSection from "@/components/HomePage/TestimonialSection";
import TravelOStylePromise from "@/components/HomePage/TravelOStylePromise";
import { API_BASE_URL } from "@/lib/config";
import { getJourneyCards } from "@/lib/journeyCard";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
const INCLUDE = [
  "field_journey_image.field_media_image",
  "field_journey_tag",
  // Entity reference to the "Journey Experience Type" taxonomy vocabulary
  // (Group / Inspirational) — without this include, the relationship's
  // referenced term never shows up in `included`, so the frontend can't
  // resolve its name even though the relationship id is present.
  "field_journey_experience_type",
  "field_category",
  "field_month",
  "field_starts_in",
  "field_ends_in",
  "field_best_seasons",
  "field_pace",
  "field_journey_tabs_section.field_section_tabs.field_include_exclude",
  // "field_journey_tabs_section.field_section_tabs.field_inclusions",
  // "field_journey_tabs_section.field_section_tabs.field_exclusions",

  // "field_journey_tabs_section.field_section_tabs.field_inclusions.field_inclusion",
  // "field_journey_tabs_section.field_section_tabs.field_exclusions.field_exclusion",

  "field_journey_tabs_section",
  "field_journey_tabs_section.field_section_tabs",
    "field_journey_tabs_section.field_section_tabs.field_highlight_cards",
  "field_journey_tabs_section.field_section_tabs.field_days",
  "field_journey_tabs_section.field_section_tabs.field_hotels",
  "field_journey_tabs_section.field_section_tabs.field_include_exclude.field_inclusion",
"field_journey_tabs_section.field_section_tabs.field_include_exclude.field_exclusion",
  "field_journey_tabs_section.field_section_tabs.field_journey_map",
  "field_journey_tabs_section.field_section_tabs.field_journey_map.field_media_image",
"field_journey_tabs_section.field_section_tabs.field_include_exclude.field_inclusion.field_icon.field_media_image",
"field_journey_tabs_section.field_section_tabs.field_include_exclude.field_exclusion.field_icon.field_media_image",
  // "field_journey_tabs_section.field_section_tabs.field_inclusions.field_inclusion.field_icon.field_media_image",
  // "field_journey_tabs_section.field_section_tabs.field_exclusions.field_exclusion.field_icon.field_media_image",

  "field_journey_tabs_section.field_section_tabs.field_days.field_stay",
  "field_journey_tabs_section.field_section_tabs.field_hotels.field_featured_image.field_media_image",
  "field_journey_tabs_section.field_section_tabs.field_hotels.field_gallery.field_media_image",
  "field_journey_tabs_section.field_section_tabs.field_information_item",

  // "field_journey_tabs_section.field_section_tabs.field_inclusions.field_inclusion.field_icon",
  // "field_journey_tabs_section.field_section_tabs.field_exclusions.field_exclusion.field_icon",
  // "field_journey_tabs_section.field_section_tabs.field_inclusions.field_inclusion.field_icon.field_media_image",
  // "field_journey_tabs_section.field_section_tabs.field_exclusions.field_exclusion.field_icon.field_media_image",

].join(",");
const TESTIMONIAL_INCLUDE =
  "field_testimonial_image.field_media_image,field_testimonial_journey";

async function getTestimonials() {
  const res = await fetch(
    `${API_BASE_URL}/jsonapi/node/testimonial?include=${TESTIMONIAL_INCLUDE}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch testimonials");
    return { data: [], included: [] };
  }

  return res.json();
}
export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Custom Drupal endpoint: resolves the /journey/{slug} alias to its node
  // internally and returns the same JSON:API shape for that node.
  let res: Response | null = null;
  try {
    res = await fetch(`${API_BASE_URL}/api/journey/${id}?include=${INCLUDE}`, {
      cache: "no-store",
    });
  } catch {
    // Connection failure (backend truly unreachable) — fall back to mock
    // data below rather than a hard 404.
  }

  if (res) {
    // The backend answered at all, so any non-2xx here is Drupal genuinely
    // saying this alias doesn't resolve — a real 404. notFound() throws, so
    // it must stay outside the try/catch above or it'd be swallowed as a
    // network failure.
    if (!res.ok) {
      notFound();
    }
  }

  const journeyData = res ? await res.json() : null;

  if (!journeyData?.data) {
    // Backend was unreachable, or returned a payload with no node data.
    // There's no mock-data fallback in place, so treat this the same as
    // a real 404 rather than crashing on journeyData.data.id below.
    notFound();
  }

  const initialData = journeyData;

  const included = journeyData?.included || [];

  const inclusions: any[] = [];
  const exclusions: any[] = [];

  const inclusionItems = included.filter(
    (item: any) => item.type === "paragraph--inclusion_exclusion_item"
  );

  inclusionItems.forEach((item: any) => {
  const processItem = (
    relation: "field_inclusion" | "field_exclusion",
    targetArray: any[]
  ) => {
    const ref = item.relationships?.[relation]?.data;

    if (!ref) return;

    const term = included.find(
      (x: any) =>
        x.type === "taxonomy_term--inclusion_exclusion" &&
        x.id === ref.id
    );

    if (!term) return;

    const mediaId =
      term.relationships?.field_icon?.data?.id;

    const media = included.find(
      (x: any) =>
        x.type === "media--image" &&
        x.id === mediaId
    );

    const fileId =
      media?.relationships?.field_media_image?.data?.id;

    const file = included.find(
      (x: any) =>
        x.type === "file--file" &&
        x.id === fileId
    );

    targetArray.push({
  title: term.attributes?.name || "",
  description: stripHtml(
    term.attributes?.description?.value || ""
  ),
  icon: file?.attributes?.uri?.url
    ? `${API_BASE_URL}${file.attributes.uri.url}`
    : "",
});
  };

  processItem("field_inclusion", inclusions);
  processItem("field_exclusion", exclusions);
});

  const journeyId = journeyData.data.id;
  const testimonialData = await getTestimonials();

  const testimonialsForThisJourney = (testimonialData.data || []).filter(
    (testimonial: any) => {
      const relationshipData =
        testimonial.relationships?.field_testimonial_journey?.data;

      // Drupal can return either:
      // 1. an array when multiple journeys are allowed
      // 2. an object when only one journey is allowed
      const testimonialJourneys = Array.isArray(relationshipData)
        ? relationshipData
        : relationshipData
          ? [relationshipData]
          : [];

      return testimonialJourneys.some(
        (journey: any) => journey.id === journeyId
      );
    },
  );

  // Most journeys don't have a testimonial linked to them specifically —
  // fall back to the general pool (same as the homepage) rather than
  // hiding the section entirely.
  const journeyTestimonials = {
    ...testimonialData,
    data: testimonialsForThisJourney.length
      ? testimonialsForThisJourney
      : testimonialData.data,
  };
  // Fetch departures linked to this journey
  const departureRes = await fetch(
    `${API_BASE_URL}/jsonapi/node/book_your_journey`,
    { cache: "no-store" }
  );

  const departureData = await departureRes.json();

  const departures = departureData.data.filter(
    (departure: any) =>
      departure.relationships?.field_journey?.data?.id === journeyId
  );

  // "Other Destinations We Know You'll Love" (rendered inside
  // JourneyDetailClient via OtherDestinations -> JourneysWeLove) used to
  // fetch this itself client-side, which always failed against the ddev
  // backend's self-signed cert (ERR_CERT_AUTHORITY_INVALID). Fetching it
  // here and passing it down avoids that browser fetch entirely.
  const otherJourneys = await getJourneyCards();

  return (
    <>
      <SearchBar />
      <JourneyDetailClient
        initialData={initialData}
        departures={departures}
        journeyId={journeyId}
        inclusions={inclusions}
        exclusions={exclusions}
        otherJourneys={otherJourneys}
      />
     <TestimonialSection
  testimonialData={journeyTestimonials}
/>

      <TravelOStylePromise />

      <Footer />
    </>
  );
}
