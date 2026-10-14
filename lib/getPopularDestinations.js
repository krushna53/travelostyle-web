import { API_BASE_URL, buildFileUrl } from "@/lib/config";

// Converts an address field's ISO country_code (e.g. "IN") into its display
// name ("India") without a hardcoded lookup table — same approach used for
// the journey detail page's Starts In/Ends In.
const countryDisplayNames =
  typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

// Powers the homepage "Find Your Journey" widget's popular-destination and
// popular-month suggestions.
//
// Two Drupal sources feed this, both flagged with a boolean
// `field_ispopular`:
//   - node/location  — field_region (single taxonomy_term:region reference),
//                       field_months (unlimited taxonomy_term:month reference)
//   - taxonomy_term/region — field_region_image (media), field_months
//                            (unlimited taxonomy_term:month reference)
//
// IMPORTANT — this deliberately does NOT introduce a new filter value: the
// itinerary page's region filter (FilterSidebar.jsx / getFilterOptions.js)
// only ever matches against Region taxonomy term names. So a popular
// Location's *city* name is shown to the person as the visible label, but
// the value actually stored for filtering/routing is always its parent
// Region's name — the same region string getFilterOptions() already
// produces. That keeps this addition from conflicting with the existing
// itinerary filter contract (see FilterSidebar.jsx's sessionStorage
// "journeyData" effect).
export async function getPopularDestinations() {
  const [locationRes, regionRes] = await Promise.all([
    fetch(
      `${API_BASE_URL}/jsonapi/node/location?filter[status][value]=1&filter[field_ispopular][value]=1&include=field_region,field_months`,
      { next: { revalidate: 60 } },
    ),
    fetch(
      `${API_BASE_URL}/jsonapi/taxonomy_term/region?filter[field_ispopular][value]=1&sort=-drupal_internal__tid&include=field_region_image.field_media_image,field_months`,
      { next: { revalidate: 60 } },
    ),
  ]);

  const monthNames = new Set();
  const destinations = [];
  const seenRegionNames = new Set();

  // --- Popular Locations: city + its region, plus that location's months ---
  if (locationRes.ok) {
    const { data = [], included = [] } = await locationRes.json();

    for (const item of data) {
      const city = item.attributes?.title || item.attributes?.name || "";

      const regionRef = item.relationships?.field_region?.data;
      const regionEntity = regionRef
        ? included.find(
            (inc) => inc.type === "taxonomy_term--region" && inc.id === regionRef.id,
          )
        : null;
      const regionName = regionEntity?.attributes?.name || "";

      const monthRefsRaw = item.relationships?.field_months?.data;
      const monthRefs = Array.isArray(monthRefsRaw)
        ? monthRefsRaw
        : monthRefsRaw
          ? [monthRefsRaw]
          : [];

      for (const ref of monthRefs) {
        const monthEntity = included.find(
          (inc) => inc.type === "taxonomy_term--month" && inc.id === ref.id,
        );
        const name = monthEntity?.attributes?.name;
        if (name) monthNames.add(name);
      }

      if (city && regionName) {
        destinations.push({
          id: item.id,
          city,
          region: regionName,
          // What the person sees in the chip/list.
          label: `${city}, ${regionName}`,
          // What actually gets filtered/routed on — always the region name.
          value: regionName,
        });
      }
    }
  }

  // --- Popular Regions: region image + that region's own months ---
  const popularRegions = [];
  if (regionRes.ok) {
    const { data = [], included = [] } = await regionRes.json();

    for (const item of data) {
      const name = item.attributes?.name || "";
      if (!name) continue;

      const monthRefsRaw = item.relationships?.field_months?.data;
      const monthRefs = Array.isArray(monthRefsRaw)
        ? monthRefsRaw
        : monthRefsRaw
          ? [monthRefsRaw]
          : [];

      for (const ref of monthRefs) {
        const monthEntity = included.find(
          (inc) => inc.type === "taxonomy_term--month" && inc.id === ref.id,
        );
        const monthName = monthEntity?.attributes?.name;
        if (monthName) monthNames.add(monthName);
      }

      const mediaId = item.relationships?.field_region_image?.data?.id;
      const mediaEntity = mediaId
        ? included.find((inc) => inc.type === "media--image" && inc.id === mediaId)
        : null;
      const fileId = mediaEntity?.relationships?.field_media_image?.data?.id;
      const fileEntity = fileId
        ? included.find((inc) => inc.type === "file--file" && inc.id === fileId)
        : null;
      const image = buildFileUrl(fileEntity?.attributes?.uri?.url) || null;

      popularRegions.push({ id: item.id, name, image, value: name });

      if (!seenRegionNames.has(name)) {
        seenRegionNames.add(name);
        // A popular Region with no popular Location under it still deserves
        // a chip in "Where do you want to go?" — value/label are the same
        // here since there's no city to show.
        destinations.push({
          id: item.id,
          city: "",
          region: name,
          label: name,
          value: name,
        });
      }
    }
  }

  return {
    // "Where do you want to go?" — popular Location cities (each labeled
    // with its region) plus any popular Region with no popular Location.
    popularDestinations: destinations,
    // "When do you want to travel?" — union of months drawn from popular
    // Locations and popular Regions, deduped.
    popularMonths: Array.from(monthNames),
    // Popular Regions with their image, for anywhere that wants the image
    // (e.g. an eventual "popular destinations" visual grid).
    popularRegions,
  };
}

// Follows Drupal's `links.next` until there are no more pages, merging
// `data` + `included` — same pattern as lib/journeyCard.js's
// fetchAllPages(), duplicated locally so this file has no cross-module
// coupling for what's a one-off need.
async function fetchAllLocationPages(url) {
  let nextUrl = url;
  let data = [];
  let included = [];
  while (nextUrl) {
    const res = await fetch(nextUrl, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`JSON:API request failed (${res.status})`);
    const json = await res.json();
    data = data.concat(json.data || []);
    included = included.concat(json.included || []);
    nextUrl = json.links?.next?.href || null;
  }
  return { data, included };
}

// Every published Location, with enough fields to search on — not just the
// handful flagged "popular" above. Backs the "Where do you want to go?"
// free-text search so typing a country, city or state actually finds
// something even when it isn't one of the curated popular chips.
//
// Location titles are inconsistent across how each was authored: ones
// created through the "Find city" geocoder widget (e.g. for a journey's
// Starts In/Ends In) get an auto-generated "<postal>, <country>, <city>"
// title but DO have a clean field_address.locality; ones hand-entered for
// this widget are often just a plain place name with no address data at
// all. Preferring locality when present, falling back to the raw title,
// covers both without the "110001, India, delhi" junk ever reaching the
// screen.
export async function getAllDestinationSearchOptions() {
  try {
    const { data, included } = await fetchAllLocationPages(
      `${API_BASE_URL}/jsonapi/node/location?filter[status][value]=1&include=field_region`,
    );

    return data
      .map((item) => {
        const address = item.attributes?.field_address;
        const locality = address?.locality;
        const city = locality
          ? locality.charAt(0).toUpperCase() + locality.slice(1)
          : item.attributes?.title || "";

        const countryCode = address?.country_code || "";
        const country = countryCode ? countryDisplayNames?.of(countryCode) || "" : "";
        const state = address?.administrative_area || "";

        const regionRef = item.relationships?.field_region?.data;
        const regionEntity = regionRef
          ? included.find(
              (inc) => inc.type === "taxonomy_term--region" && inc.id === regionRef.id,
            )
          : null;
        const region = regionEntity?.attributes?.name || "";

        if (!city && !region) return null;

        // A Location with no linked Region has nothing real to store as
        // `value` for the itinerary page's region filter — falling back to
        // the city used to leak that city name into the "region" URL
        // param/sessionStorage as if it were one. FilterSidebar now only
        // ever renders real Region taxonomy terms regardless of what's in
        // that param, so it's safe to still surface these in search
        // results (rather than hiding them entirely) — selecting one just
        // won't narrow anything by region, same as typing a term with no
        // match did before this search existed.
        return {
          id: item.id,
          city,
          region,
          country,
          state,
          label: region ? `${city}, ${region}` : city,
          value: region || city,
          // Lowercased once here rather than on every keystroke — what the
          // search box's input actually matches against.
          searchText: [city, region, country, state]
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
        };
      })
      .filter(Boolean);
  } catch (err) {
    console.error("Failed to fetch destination search options", err);
    return [];
  }
}
