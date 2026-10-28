import { getFilterOptions } from "@/lib/getFilterOptions";
import {
  getPopularDestinations,
  getAllDestinationSearchOptions,
} from "@/lib/getPopularDestinations";
import { getJourneyCards } from "@/lib/journeyCard";
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
  ] = await Promise.all([
    getFilterOptions(),
    getPopularDestinations(),
    getAllDestinationSearchOptions(),
    getJourneyCards(),
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
    />
  );
}
