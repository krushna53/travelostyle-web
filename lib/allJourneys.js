import { API_BASE_URL, buildFileUrl } from "@/lib/config";
import { slugify } from "@/lib/slugify";

// Resolves the ISO country code from a journey's starting-location
// reference (node--location -> field_address.country_code), used only
// to filter journeys clicked from the homepage map — not shown as a
// filter option in the sidebar.
function resolveCountryCode(rel, included) {
  const id = rel?.data?.id;
  if (!id) return "";

  const node = included.find(
    (inc) => inc.type === "node--location" && inc.id === id,
  );

  return node?.attributes?.field_address?.country_code || "";
}

// Fetches every journey node for the "All Journeys" listing page. Server-side
// (called from app/itinerary/page.tsx) so it goes through Node's fetch —
// which honors NODE_TLS_REJECT_UNAUTHORIZED for the ddev backend's
// self-signed cert — instead of the browser's fetch, which was failing
// every load with ERR_CERT_AUTHORITY_INVALID.
export async function getAllJourneysList() {
  // Drupal's JSON:API caps a single response at 50 resources by default.
  // A one-shot fetch silently drops every journey past that first page —
  // on a dev/test site with a lot of seed content, newly-created journeys
  // are exactly the ones most likely to land past that cutoff and vanish
  // from every listing/filter with no error anywhere. Follow `links.next`
  // until Drupal stops returning one, merging `data` + `included` from
  // every page.
  let nextUrl = `${API_BASE_URL}/jsonapi/node/journey?include=field_journey_image.field_media_image,field_journey_tag,field_month,field_category,field_region,field_starts_in`;
  let allData = [];
  let allIncluded = [];

  while (nextUrl) {
    const res = await fetch(nextUrl, { cache: "no-store" });
    const pageJson = await res.json();

    allData = allData.concat(pageJson.data || []);
    allIncluded = allIncluded.concat(pageJson.included || []);
    nextUrl = pageJson.links?.next?.href || null;
  }

  const included = allIncluded;

  return allData.map((item, index) => {
    const mediaId = item.relationships?.field_journey_image?.data?.id;
    const mediaEntity = included.find(
      (inc) => inc.type === "media--image" && inc.id === mediaId,
    );

    // field_month can be a multi-value taxonomy reference (a journey may
    // run across several months), so `.data` can be either a single
    // relationship object or an array — reading it as `.data?.id`
    // unconditionally silently broke for any multi-value field: `.id` on
    // an array is undefined, so monthId was always undefined and
    // monthName was always "" for every journey, which made the month
    // filter match nothing.
    const monthRelationship = item.relationships?.field_month?.data;
    const monthRefs = Array.isArray(monthRelationship)
      ? monthRelationship
      : monthRelationship
        ? [monthRelationship]
        : [];

    const monthNames = monthRefs
      .map((ref) => {
        const monthEntity = included.find(
          (inc) => inc.type === "taxonomy_term--month" && inc.id === ref.id,
        );
        return monthEntity?.attributes?.name || "";
      })
      .filter(Boolean);

    const fileId = mediaEntity?.relationships?.field_media_image?.data?.id;
    const fileEntity = included.find((inc) => inc.type === "file--file" && inc.id === fileId);
    const rawUrl = fileEntity?.attributes?.uri?.url;
    const imageUrl = buildFileUrl(rawUrl) || "/GoldenTriange.svg";

    const tagData = item.relationships?.field_journey_tag?.data;
    const tagArray = Array.isArray(tagData) ? tagData : tagData ? [tagData] : [];

    // field_journey_tag references the "Journey Style" vocabulary, whose
    // JSON:API resource type is taxonomy_term--journey_style —
    // taxonomy_term--tags is also accepted for safety. Resolve name and id
    // together from the matched `included` entity so a dangling reference
    // to a deleted/unpublished term (present in the relationship but
    // absent from `included`) never makes it into tagIds — that's what was
    // getting forwarded to the inquiry-form webform and triggering its
    // "referenced entity does not exist" validation error.
    const resolvedTags = tagArray
      .map((tag) => {
        const tagEntity = included.find(
          (inc) =>
            (inc.type === "taxonomy_term--tags" ||
              inc.type === "taxonomy_term--journey_style") &&
            inc.id === tag.id,
        );
        const name = tagEntity?.attributes?.name;
        const id =
          tag.meta?.drupal_internal__target_id ??
          tagEntity?.attributes?.drupal_internal__tid;
        return name ? { id, name } : null;
      })
      .filter(Boolean);

    const tagNames = resolvedTags.map((t) => t.name);

    const cta = item.attributes?.field_cta;

    // Use Drupal's real Pathauto-generated alias as-is (already present on
    // every node's JSON:API "path" attribute, no include needed) so this
    // link always matches whatever URL pattern Drupal is currently
    // configured with, without hardcoding a prefix here. Fall back to a
    // client-computed slug only if path/alias is missing.
    const alias = item.attributes?.path?.alias || "";
    let viewTripUrl = alias || `/journey/${slugify(item.attributes.title || "")}`;
    if (cta?.uri && !cta.uri.startsWith("entity:")) {
      viewTripUrl = cta.uri;
    }

    const regionRelationship =
      item.relationships?.field_region?.data || item.relationships?.field_country?.data;
    const regionArray = Array.isArray(regionRelationship)
      ? regionRelationship
      : regionRelationship
        ? [regionRelationship]
        : [];
    const regionNames = regionArray
      .map((relation) => {
        const regionEntity = included.find(
          (inc) =>
            inc.id === relation.id &&
            (inc.type === "taxonomy_term--region" || inc.type === "taxonomy_term--country"),
        );
        return regionEntity?.attributes?.name || "";
      })
      .filter(Boolean);
    const regionName = regionNames[0] || "";

    // field_category is a taxonomy-term relationship, not a plain
    // attribute — resolved the same way as region/tags above (a journey
    // can carry more than one category).
    const categoryRelationship = item.relationships?.field_category?.data;
    const categoryArray = Array.isArray(categoryRelationship)
      ? categoryRelationship
      : categoryRelationship
        ? [categoryRelationship]
        : [];
    const categoryNames = categoryArray
      .map((relation) => {
        const categoryEntity = included.find(
          (inc) => inc.id === relation.id && inc.type === "taxonomy_term--category",
        );
        return categoryEntity?.attributes?.name || "";
      })
      .filter(Boolean);

    return {
      id: item.id,
      title: item.attributes.title || "",
      desc: item.attributes.field_short_description || "",
      days: `${item.attributes.field_duration_days || 0} Days | ${
        item.attributes.field_duration_nights || 0
      } Nights`,
      destinations: `${item.attributes.field_destinations_count || 0} Destinations`,
      price: Number(item.attributes.field_offer_price) || 0,
      originalPrice: Number(item.attributes.field_original_price) || 0,
      offer: item.attributes.field_offer_message || "",
      image: imageUrl,
      tags: tagNames,
      style: tagNames[0] || "Group Journey",
      region: regionName,
      countryCode: resolveCountryCode(item.relationships?.field_starts_in, included),
      category: categoryNames,
      month: monthNames,
      viewTripUrl,
      viewTripText: cta?.title || "View Trip",
      active: index === 0,
    };
  });
}

const FILTER_ENDPOINTS = {
  region: "taxonomy_term/region",
  style: "taxonomy_term/tags",
  offer: "taxonomy_term/offers",
  category: "taxonomy_term/category",
  month: "taxonomy_term/month",
};

// Fetches the taxonomy-term options shown in the "All Journeys" filter
// sidebar. Server-side for the same reason as getAllJourneysList().
export async function getJourneyFilterOptions() {
  const results = {};

  for (const key in FILTER_ENDPOINTS) {
    const res = await fetch(
      `${API_BASE_URL}/jsonapi/${FILTER_ENDPOINTS[key]}?sort=-drupal_internal__tid`,
      { cache: "no-store" },
    );
    const json = await res.json();
    results[key] = (json.data || []).map((item) => item?.attributes?.name);
  }

  return results;
}
