import { getFilterOptions } from "@/lib/getFilterOptions";
import {
  getAllDestinationSearchOptions,
  getPopularDestinations,
} from "@/lib/getPopularDestinations";
import { getJourneyCards } from "@/lib/journeyCard";
import SearchBarClient from "./SearchBarClient";

export default async function SearchBar() {
  const [
    { destinations, months },
    allDestinations,
    { popularDestinations, popularMonths },
    journeys,
  ] = await Promise.all([
    getFilterOptions(),
    getAllDestinationSearchOptions(),
    getPopularDestinations(),
    getJourneyCards(),
  ]);

  return (
    <SearchBarClient
      destinations={destinations}
      months={months}
      allDestinations={allDestinations}
      popularDestinations={popularDestinations}
      popularMonths={popularMonths}
      journeys={journeys}
    />
  );
}
