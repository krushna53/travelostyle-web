"use client";

import { useRef } from "react";
import TestimonialSection from "@/components/HomePage/TestimonialSection";
import { buildFileUrl } from "@/lib/config";
import DetailTabs from "./DetailTabs";
import HeroSection from "./HeroSection";
import OtherDestinations from "./OtherDestinations";
import TrustBar from "./TrustBar";
function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const MOCK_JOURNEY = {
  title: "The Moroccan Getaway",
  tags: ["Culture & Heritage", "Culture"],
  desc: "From imperial cities to Saharan silence — a journey through Morocco's most celebrated contrasts.",
  image: "/Morocco.svg",
  days: "13 Days | 12 Nights",
  destinations: "10 Destinations",
  price: "$5000",
  startCity: "Casablanca",
  endCity: "Marrakech",
  bestSeason: "Jan–March, July–Sep",
  pace: "Moderate",
  offer: "Black Friday offer available for August & September departure/s",
  earlyBird: true,
  highlights: [
    {
      type: "text",
      text: "Ancient Medinas where the call to prayer still echoes off the same walls of always-narrow alleyways, where the spice merchant and silk traders are still there.",
    },
    { type: "image", image: "/Morocco.svg", alt: "Morocco Medina" },
    {
      type: "text",
      text: "Cedar Forests, mountain passes, a valley that seems to go on forever — this is the Morocco that changes you. All of it.",
    },
    {
      type: "text",
      text: "You've seen Ait Benhaddou in the films. Nothing prepares you for it in person.",
    },
    {
      type: "text",
      text: "Three days in Marrakech — the souks at dawn, the square at dusk, and a garden you won't forget where you are.",
    },
    {
      type: "image",
      image: "/Kenya.svg",
      alt: "Marrakech",
      caption: "Marrakech — Show Me It Is If Necessary",
    },
  ],
};

function resolveImage(item, included) {
  const mediaId = item.relationships?.field_journey_image?.data?.id;
  const media = included.find((i) => i.type === "media--image" && i.id === mediaId);
  const fileId = media?.relationships?.field_media_image?.data?.id;
  const file = included.find((i) => i.type === "file--file" && i.id === fileId);
  const raw = file?.attributes?.uri?.url;
  return buildFileUrl(raw) || "/Morocco.svg";
}

// field_journey_tag ("Journey Type" field in Drupal, machine name
// field_journey_tag) references the "Journey Style" taxonomy vocabulary
// (e.g. "Private Journey"). Resolves each referenced term to both its
// label and its plain Drupal id (drupal_internal__tid) in one pass, so
// the two always stay paired correctly.
function resolveJourneyStyleTerms(item, included) {
  const data = item.relationships?.field_journey_tag?.data;
  const arr = Array.isArray(data) ? data : data ? [data] : [];

  return arr
    .filter(
      (t) =>
        t.type === "taxonomy_term--journey_style" ||
        t.type === "taxonomy_term--tags",
    )
    .map((t) => {
      // The relationship entry itself carries the real plain id via
      // meta.drupal_internal__target_id — read it straight from there
      // instead of re-deriving it by matching through `included`, which
      // depends on the referenced entity actually being present there.
      const id = t.meta?.drupal_internal__target_id;
      const e = included.find((i) => i.id === t.id && i.type === t.type);
      const label = e?.attributes?.name || e?.attributes?.title;
      return label && id != null ? { id: Number(id), label } : null;
    })
    .filter(Boolean);
}

// The webform's `journeytype` entity-autocomplete field only accepts
// references to the "Journey Style" vocabulary (JSON:API type
// taxonomy_term--journey_style). resolveJourneyStyleTerms() above also
// matches taxonomy_term--tags "for safety" so display tags/chips never
// go missing, but forwarding a taxonomy_term--tags id as `journeytype`
// on submit fails Drupal's entity-reference validation with "The
// referenced entity (taxonomy_term: X) does not exist." — the term does
// exist, it's just outside the field's allowed target bundle, and
// Drupal reports that the same way it reports a truly missing id. Build
// a submission-safe id list restricted to the one bundle the webform
// actually accepts, kept separate from the (intentionally broader)
// display list above.
function resolveJourneyTypeSubmissionIds(item, included) {
  const data = item.relationships?.field_journey_tag?.data;
  const arr = Array.isArray(data) ? data : data ? [data] : [];

  return arr
    .filter((t) => t.type === "taxonomy_term--journey_style")
    .map((t) => {
      const id = t.meta?.drupal_internal__target_id;
      const e = included.find((i) => i.id === t.id && i.type === t.type);
      const label = e?.attributes?.name || e?.attributes?.title;
      return label && id != null ? Number(id) : null;
    })
    .filter((id) => id != null);
}
function resolveLocation(rel, included) {
  const id = rel?.data?.id;

  if (!id) return "";

  const node = included.find(
    (i) =>
      i.type === "node--location" &&
      i.id === id
  );

  if (!node) return "";

  const locality = node.attributes?.field_address?.locality;

  return locality
    ? locality.charAt(0).toUpperCase() + locality.slice(1)
    : "";
}
function resolveBestSeasons(item, included) {
  const data = item.relationships?.field_best_seasons?.data || [];
  return data
    .map((s) => {
      const e = included.find(
        (i) => i.type === "taxonomy_term--best_seasons" && i.id === s.id,
      );
      return e?.attributes?.name;
    })
    .filter(Boolean)
    .join(", ");
}

function resolvePace(item, included) {
  const id = item.relationships?.field_pace?.data?.id;
  if (!id) return "";
  const e = included.find((i) => i.id === id);
  return e?.attributes?.name || "";
}



function resolveTabSections(item, included) {
  // Level 1: journey_tabs_section container(s). This field only has one
  // value in the intended content model, but it used to only ever read
  // containerRefs[0] — if a content editor ends up with a second
  // "Journey Tabs Section" paragraph on the node (easy to do by accident
  // in the Paragraphs widget — "add another item" instead of editing the
  // existing one), EVERYTHING nested under that second container
  // (every tab: Highlights, Itinerary, Stays, Additional Information)
  // was silently ignored, which looks exactly like "I edited it and
  // nothing shows up" for all tabs at once. Now every container's
  // field_section_tabs is merged, so a stray extra container still gets
  // picked up instead of dropped.
  const containerRefs = item.relationships?.field_journey_tabs_section?.data;
  if (!Array.isArray(containerRefs) || containerRefs.length === 0) return {};

  const tabRefs = containerRefs.flatMap((ref) => {
    const container = included.find((inc) => inc.id === ref.id);
    return container?.relationships?.field_section_tabs?.data || [];
  });
  if (tabRefs.length === 0) return {};

  const tabs = {};

  tabRefs.forEach((ref) => {
    const para = included.find((inc) => inc.id === ref.id);
    if (!para) return;

    switch (para.type) {
      // ── HIGHLIGHTS ─────────────────────────────────────────────────────
      case "paragraph--highlights_tab": {
        const cardRefs = para.relationships?.field_highlight_cards?.data || [];
        tabs.highlights = cardRefs
          .map((r) => {
            const card = included.find((inc) => inc.id === r.id);
            if (!card) return null;
            return {
              type: "text",
              text: stripHtml(card.attributes?.field_card_content?.processed),
            };
          })
          .filter(Boolean);
        break;
      }

      // ── ITINERARY ──────────────────────────────────────────────────────
      case "paragraph--itinerary_tab": {
        const dayRefs = para.relationships?.field_days?.data || [];
         const mapMediaId =
    para.relationships?.field_journey_map?.data?.id;

  const mapMedia = included.find(
    (inc) =>
      inc.type === "media--image" &&
      inc.id === mapMediaId
  );

  const mapFileId =
    mapMedia?.relationships?.field_media_image?.data?.id;

  const mapFile = included.find(
    (inc) =>
      inc.type === "file--file" &&
      inc.id === mapFileId
  );

  const mapImage =
    buildFileUrl(
      mapFile?.attributes?.uri?.url
    );

  console.log("MAP IMAGE:", mapImage);
  // MAP IMAGE END

tabs.itinerary = {
    days: dayRefs
      .map((r) => {

        const day = included.find(
          (inc) => inc.id === r.id
        );

        if (!day) return null;

        const a = day.attributes || {};

        const hotelId =
          day.relationships?.field_stay?.data?.id;

        const hotel = hotelId
          ? included.find(
              (inc) => inc.id === hotelId
            )
          : null;

        return {
          day: a.field_day_number,
          title: a.field_day_title || "",
          stay: hotel?.attributes?.title || "",
          description: stripHtml(
            a.field_description?.processed
          ),
        };

      })
      .filter(Boolean),

    mapImage,
  };


  break;
}

      // ── STAYS ──────────────────────────────────────────────────────────
      case "paragraph--stays_tab": {
        const hotelRefs = para.relationships?.field_hotels?.data || [];
        tabs.stays = hotelRefs
          .map((r) => {
            const hotel = included.find((inc) => inc.id === r.id);
            if (!hotel) return null;
            const a = hotel.attributes || {};

            // Featured image (card thumbnail)
            const featuredMediaId = hotel.relationships?.field_featured_image?.data?.id;
            const featuredMedia = featuredMediaId ? included.find((inc) => inc.id === featuredMediaId) : null;
            const featuredFileId = featuredMedia?.relationships?.field_media_image?.data?.id;
            const featuredFile = featuredFileId ? included.find((inc) => inc.id === featuredFileId) : null;
            const featuredRaw = featuredFile?.attributes?.uri?.url;
            const image = buildFileUrl(featuredRaw) || "/Morocco.svg";

            // Gallery images (all media--image in field_gallery)
            const galleryRefs = hotel.relationships?.field_gallery?.data || [];
            const images = galleryRefs
              .map((gr) => {
                const gMedia = included.find((inc) => inc.id === gr.id);
                const gFileId = gMedia?.relationships?.field_media_image?.data?.id;
                const gFile = gFileId ? included.find((inc) => inc.id === gFileId) : null;
                const gRaw = gFile?.attributes?.uri?.url;
                return buildFileUrl(gRaw);
              })
              .filter(Boolean);

            return {
              name: a.title || "",
              desc: a.field_description || "",
              image,
              images: [image, ...images],
            };
          })
          .filter(Boolean);
        break;
      }

      // ── ADDITIONAL INFORMATION ────────────────────────────────────────
      // Multiple paragraphs of this type can appear (one per group, e.g.
      // "Things To Know Before You Book" / "...Before You Travel"), so they
      // accumulate into an array rather than a single tabs.* value.
      case "paragraph--additional_information_section": {
        const itemRefs = para.relationships?.field_information_item?.data || [];
        const items = itemRefs
          .map((r) => {
            const info = included.find((inc) => inc.id === r.id);
            if (!info) return null;
            return {
              title: info.attributes?.field_information_title || "",
              content: info.attributes?.field_content?.processed || "",
            };
          })
          .filter(Boolean);

        if (!tabs.additionalInfo) tabs.additionalInfo = [];
        tabs.additionalInfo.push({
          title: para.attributes?.field_section_title || "",
          items,
        });
        break;
      }
    }
  });

  return tabs;
}

// field_journey_experience_type ("Group" / "Inspirational" radio on the
// journey node) decides what the hero summary card + Dates & Pricing tab
// show: Group journeys get "Check Dates & Availability" (which opens the
// Dates & Pricing tab) plus a "Request a Private Journey" link pre-filled
// with the closest offer/upcoming departure; Inspirational journeys skip
// dates entirely and only offer "Request a Private Journey" (submitted as
// the Inspirational Itineraries webform) + "Tailor This Journey For You".
// Handles either a plain text-list attribute or (defensively) an entity
// reference, and defaults to "group" when the field is unset so journeys
// created before this field existed keep the fuller, dates-enabled card.
function resolveExperienceType(item, included) {
  const attr = item.attributes?.field_journey_experience_type;

  // Plain string ("Group" / "inspirational" / ...).
  if (typeof attr === "string" && attr) return attr;

  // A formatted-text-style field comes through as { value: "...", ... }
  // instead of a bare string.
  if (attr && typeof attr === "object" && typeof attr.value === "string") {
    return attr.value;
  }

  // A multi-value list field comes through as an array of either shape
  // above — only one value is expected here, so just take the first.
  if (Array.isArray(attr) && attr.length) {
    const first = attr[0];
    if (typeof first === "string") return first;
    if (first && typeof first.value === "string") return first.value;
  }

  // Entity-reference shape (e.g. a taxonomy term instead of a plain list
  // field) — resolve it the same way field_journey_tag is resolved.
  const rel = item.relationships?.field_journey_experience_type?.data;
  if (rel) {
    const relId = Array.isArray(rel) ? rel[0]?.id : rel.id;
    const entity = included.find((i) => i.id === relId);
    return entity?.attributes?.field_key || entity?.attributes?.name || "";
  }

  return "";
}

function transformItem(item, included) {
  const tabSections = resolveTabSections(item, included);
  const journeyStyleTerms = resolveJourneyStyleTerms(item, included);
  const journeyTypeSubmissionIds = resolveJourneyTypeSubmissionIds(item, included);
  const experienceTypeRaw = resolveExperienceType(item, included);
  const isInspirational = experienceTypeRaw.toLowerCase().includes("inspir");
  const experienceType = isInspirational ? "inspirational" : "group";
  // TEMP debug — remove once experience-type detection is confirmed
  // working against the live Drupal data (field_journey_experience_type is
  // an entity reference to the "Journey Experience Type" taxonomy
  // vocabulary, now included via the page's INCLUDE list). If "raw" still
  // prints "" here, paste this console line back — it now also shows the
  // raw relationship + whatever entity (if any) matched in `included`.
  console.log("JOURNEY EXPERIENCE TYPE:", {
    raw: experienceTypeRaw,
    isInspirational,
    relationship: item.relationships?.field_journey_experience_type?.data,
    matchedEntity: included.find(
      (i) => i.id === item.relationships?.field_journey_experience_type?.data?.id,
    ),
  });

  return {
    ...MOCK_JOURNEY,
    experienceType,
    isInspirational,
        id: item.id,
        // Drupal's JSON:API `id` is the node UUID. The webform_rest
        // submission (see PrivateInquiryForm) needs the plain node ID
        // instead, which JSON:API exposes as `drupal_internal__nid` on
        // node attributes.
        nodeId: item.attributes?.drupal_internal__nid ?? null,

    title: item.attributes.title || MOCK_JOURNEY.title,
    desc: item.attributes.field_short_description || MOCK_JOURNEY.desc,
    image: resolveImage(item, included),
    days: `${item.attributes.field_duration_days || 13} Days | ${item.attributes.field_duration_nights || 12} Nights`,
    destinations: `${item.attributes.field_destinations_count || 10} Destinations`,
    offerPrice: item.attributes.field_offer_price,
originalPrice: item.attributes.field_original_price,
    offer: item.attributes.field_offer_message || "",

    
    // field_early_bird is a plain Boolean attribute on the journey node
    // (not a relationship), so it's already present in item.attributes —
    // no change to the `include` param needed to fetch it.
    earlyBird: Boolean(item.attributes.field_early_bird),
    // {id, label} pairs for the field_journey_tag ("Journey Style")
    // terms — used to build the "Label (id)" value the webform's
    // journeytype entity-autocomplete field expects.
    journeyStyleTerms,
    tags: journeyStyleTerms.map((t) => t.label),
    // Plain IDs for the same terms — kept for any caller still using the
    // bare ID (most webform entity-autocomplete fields need the "Label
    // (id)" form instead — see journeyStyleTerms above).
    // Restricted to the journey_style bundle only — see
    // resolveJourneyTypeSubmissionIds() above for why the broader
    // journeyStyleTerms list isn't safe to submit as-is.
    tagIds: journeyTypeSubmissionIds,
    startCity: resolveLocation(item.relationships?.field_starts_in, included) || MOCK_JOURNEY.startCity,
    endCity: resolveLocation(item.relationships?.field_ends_in, included) || MOCK_JOURNEY.endCity,
    bestSeason: resolveBestSeasons(item, included) || MOCK_JOURNEY.bestSeason,
    pace: resolvePace(item, included) || MOCK_JOURNEY.pace,
    // Tab section data from field_journey_tabs_section paragraphs
    tabHighlights: tabSections.highlights || null,
   tabItinerary: tabSections.itinerary?.days || null,

mapImage: tabSections.itinerary?.mapImage || null,
    tabStays: tabSections.stays || null,
    tabAdditionalInfo: tabSections.additionalInfo || null,
    // IDs of the "Stopover Journey" nodes selected on this specific journey
    // in Drupal (field_stopover_journey, entity reference, multi-value).
    // Used to filter the "Take your journey a little further" step of the
    // inquiry form down to only the stopovers configured for this journey,
    // instead of showing every stopover journey that exists.
    stopoverJourneyIds: (() => {
      const rel = item.relationships?.field_stopover_journey?.data;
      const refs = Array.isArray(rel) ? rel : rel ? [rel] : [];
      return refs.map((r) => r.id).filter(Boolean);
    })(),
  };
}

export default function JourneyDetailClient({
  initialData,
  departures,
  journeyId,
  inclusions,
  exclusions,
  otherJourneys,
}) {
  const journey =
    initialData?.data
      ? transformItem(initialData.data, initialData.included || [])
      : MOCK_JOURNEY;

  // "Check Dates & Availability" on the hero card (Group journeys only)
  // needs to switch DetailTabs over to its "Dates & Pricing" tab and
  // scroll it into view — DetailTabs owns that tab state internally, so
  // it's exposed here via a ref instead of lifting the state up.
  const detailTabsRef = useRef(null);
  const handleCheckAvailability = () => {
    detailTabsRef.current?.showDatesPricing();
  };

  return (
    <main>
      <HeroSection
        journey={journey}
        departures={departures}
        inclusions={inclusions}
        exclusions={exclusions}
        rawItem={initialData?.data}
        included={initialData?.included || []}
        onCheckAvailability={handleCheckAvailability}
      />
      <TrustBar isInspirational={Boolean(journey?.isInspirational)} />
      <DetailTabs
        ref={detailTabsRef}
        journey={journey}
        departures={departures}
        journeyId={journeyId}
        inclusions={inclusions}
        exclusions={exclusions}
      />     <OtherDestinations otherJourneys={otherJourneys} />
    </main>
  );
}