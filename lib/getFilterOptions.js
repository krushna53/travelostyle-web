import { API_BASE_URL } from "@/lib/config";

// Shared across every page that renders SearchBar / ListingSearchForm /
// FindYourJourneyMobile, so this fetch must stay cheap: three requests,
// revalidated on Next.js's data cache rather than "no-store", since
// regions/months/journey-styles don't change from one page load to the
// next the way journeys/blogs do. Kept short (60s, not the hour-long
// window this used to have) — a long window meant a term just
// added/edited in Drupal could silently look "missing" from these
// dropdowns for up to an hour.
export async function getFilterOptions() {
  const [regionRes, monthRes, styleRes] = await Promise.all([
    fetch(`${API_BASE_URL}/jsonapi/taxonomy_term/region?sort=-drupal_internal__tid`, {
      next: { revalidate: 60 },
    }),
    fetch(`${API_BASE_URL}/jsonapi/taxonomy_term/month?sort=-drupal_internal__tid`, {
      next: { revalidate: 60 },
    }),
    // Same "tags" taxonomy the itinerary sidebar's own "Travel Style"
    // filter reads from (AllJourneysPage.jsx) — reused here so the
    // homepage's "Choose a way to travel" list always matches exactly
    // what the itinerary page can actually filter on.
    fetch(`${API_BASE_URL}/jsonapi/taxonomy_term/tags?sort=-drupal_internal__tid`, {
      next: { revalidate: 60 },
    }),
  ]);

  let destinations = [];
  if (regionRes.ok) {
    const { data = [] } = await regionRes.json();
    destinations = data.map((term) => term.attributes?.name).filter(Boolean);
  } else {
    console.error("Failed to fetch destination regions");
  }

  let months = [];
  if (monthRes.ok) {
    const { data = [] } = await monthRes.json();
    months = data.map((term) => term.attributes?.name).filter(Boolean);
  } else {
    console.error("Failed to fetch travel months");
  }

  let styles = [];
  if (styleRes.ok) {
    const { data = [] } = await styleRes.json();
    styles = data.map((term) => term.attributes?.name).filter(Boolean);
  } else {
    console.error("Failed to fetch travel styles");
  }

  return { destinations, months, styles };
}
