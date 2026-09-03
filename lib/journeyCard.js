import { API_BASE_URL, buildFileUrl } from "@/lib/config";
import { slugify } from "@/lib/slugify";

const INCLUDE =
  "field_journey_image.field_media_image,field_journey_tag,field_region";

// Fetches every "book your journey" departure node and reduces them to a
// map of journeyId -> soonest upcoming departure ({startDate, endDate}).
// Used by getJourneyCards() so listing-page journey cards (e.g. the
// "Explore All Private Journeys" inquiry form) can show a real departure
// date when one exists, instead of always omitting it.
async function getNearestDeparturesByJourney() {
  try {
    const res = await fetch(`${API_BASE_URL}/jsonapi/node/book_your_journey`, {
      cache: "no-store",
    });
    if (!res.ok) return {};
    const json = await res.json();

    const byJourney = {};
    (json.data || []).forEach((item) => {
      const journeyId = item.relationships?.field_journey?.data?.id;
      const startDate = item.attributes?.field_departure_date;
      const endDate = item.attributes?.field_return_date;
      if (!journeyId || !startDate) return;

      const existing = byJourney[journeyId];
      if (!existing || new Date(startDate) < new Date(existing.startDate)) {
        byJourney[journeyId] = { startDate, endDate };
      }
    });
    return byJourney;
  } catch (err) {
    console.error("Failed to load departures for journey cards", err);
    return {};
  }
}

// Fetches every journey node and resolves each into the flat card shape
// used across the journey-type listing sections (Group/Private/Tailor-made/
// Home/Journey-Detail "you'll also love" rails). All of these previously
// duplicated this exact fetch + media/tag resolution independently.
export async function getJourneyCards() {
  const [res, nearestDeparturesByJourney] = await Promise.all([
    fetch(`${API_BASE_URL}/jsonapi/node/journey?include=${INCLUDE}&sort=-changed`, {
      cache: "no-store",
    }),
    getNearestDeparturesByJourney(),
  ]);
  const json = await res.json();
  const included = json.included || [];

  return (json.data || []).map((item, index) => {
    const mediaId = item.relationships?.field_journey_image?.data?.id;
    const mediaEntity = included.find(
      (inc) => inc.type === "media--image" && inc.id === mediaId,
    );
    const fileId = mediaEntity?.relationships?.field_media_image?.data?.id;
    const fileEntity = included.find((inc) => inc.type === "file--file" && inc.id === fileId);
    const imageUrl = buildFileUrl(fileEntity?.attributes?.uri?.url) || "/GoldenTriange.svg";

    const tagData = item.relationships?.field_journey_tag?.data;
    const tagArray = Array.isArray(tagData) ? tagData : tagData ? [tagData] : [];
    const tagNames = tagArray
      .map((tag) => {
        // field_journey_tag references the "Journey Style" vocabulary,
        // whose JSON:API resource type is taxonomy_term--journey_style —
        // taxonomy_term--tags was also accepted here for safety, but
        // matching only that type was silently dropping every tag,
        // which is why cards were rendering with no tags at all.
        const tagEntity = included.find(
          (inc) =>
            (inc.type === "taxonomy_term--tags" ||
              inc.type === "taxonomy_term--journey_style") &&
            inc.id === tag.id,
        );
        return tagEntity?.attributes?.name;
      })
      .filter(Boolean);

    const regionRelationship =
      item.relationships?.field_region?.data ||
      item.relationships?.field_country?.data;
    const regionArray = Array.isArray(regionRelationship)
      ? regionRelationship
      : regionRelationship
        ? [regionRelationship]
        : [];
    const regionName =
      regionArray
        .map((relation) => {
          const regionEntity = included.find(
            (inc) =>
              inc.id === relation.id &&
              (inc.type === "taxonomy_term--region" ||
                inc.type === "taxonomy_term--country"),
          );
          return regionEntity?.attributes?.name || "";
        })
        .filter(Boolean)[0] || "";

    const cta = item.attributes?.field_cta;
    const alias = item.attributes?.path?.alias || "";
    let viewTripUrl = alias || `/journey/${slugify(item.attributes?.title || "")}`;
    if (cta?.uri && !cta.uri.startsWith("entity:")) {
      viewTripUrl = cta.uri;
    }

    return {
      id: item.id,
      title: item.attributes?.title || "",
      description: item.attributes?.field_short_description || "",
      duration: `${item.attributes?.field_duration_days || 0} Days | ${
        item.attributes?.field_duration_nights || 0
      } Nights`,
      destinations: `${item.attributes?.field_destinations_count || 0} Destinations`,
      price: Number(item.attributes?.field_offer_price) || 0,
      earlyBird: item.attributes?.field_offer_message || null,
      isPopular: item.attributes?.field_is_popular === true,
      image: imageUrl,
      region: regionName,
      types: tagNames,
      viewTripUrl,
      viewTripText: cta?.title || "View Trip",
      nearestDeparture: nearestDeparturesByJourney[item.id] || null,
      _index: index,
    };
  });
}

export function filterByType(journeys, typeName) {
  return journeys.filter((journey) => journey.types?.includes(typeName));
}
