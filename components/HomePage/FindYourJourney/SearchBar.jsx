import { getFilterOptions } from "@/lib/getFilterOptions";
import {
  getPopularDestinations,
  getAllDestinationSearchOptions,
} from "@/lib/getPopularDestinations";
import { getJourneyCards } from "@/lib/journeyCard";
import { getAllJourneysList } from "@/lib/allJourneys";
import SearchBarClient from "./SearchBarClient";

// Server Component: fetches the destination list once per page render and
// hands it down, so none of the 7 pages that mount this SearchBar (and none
// of the client-side dropdowns inside it) need their own fetch call.
export default async function SearchBar() {
  const [
    { destinations, months, styles },
    { popularDestinations, popularMonths },
    allDestinations,
    journeys,
    filterJourneys,
  ] = await Promise.all([
    getFilterOptions(),
    getPopularDestinations(),
    getAllDestinationSearchOptions(),
    getJourneyCards(),
    // Full journey data (month, tags, duration, price) — used only to hide
    // search options that would lead to zero results.
    getAllJourneysList().catch(() => []),
  ]);

  return (
    <SearchBarClient
      destinations={destinations}
      months={months}
      styles={styles}
      popularDestinations={popularDestinations}
      popularMonths={popularMonths}
      allDestinations={allDestinations}
      journeys={journeys}
      filterJourneys={filterJourneys}
    />
  );
}
