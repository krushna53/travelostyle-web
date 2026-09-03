import { API_BASE_URL, buildFileUrl } from "@/lib/config";

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
      `${API_BASE_URL}/jsonapi/node/location?filter[field_ispopular][value]=1&include=field_region,field_months`,
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
