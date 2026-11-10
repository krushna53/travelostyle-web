import { getFilterOptions } from "@/lib/getFilterOptions";
import {
  getAllDestinationSearchOptions,
  getPopularDestinations,
} from "@/lib/getPopularDestinations";
import { getJourneyCards } from "@/lib/journeyCard";
import { getAllJourneysList } from "@/lib/allJourneys";
import SearchBarClient from "./SearchBarClient";

export default async function SearchBar() {
  const [
    { destinations, months },
    allDestinations,
    { popularDestinations, popularMonths },
    journeys,
    filterJourneys,
  ] = await Promise.all([
    getFilterOptions(),
    getAllDestinationSearchOptions(),
    getPopularDestinations(),
    getJourneyCards(),
    // Full journey data (month, tags, duration, price) — used only to hide
    // search options that would lead to zero results.
    getAllJourneysList().catch(() => []),
  ]);

  return (
    <SearchBarClient
      destinations={destinations}
      months={months}
      allDestinations={allDestinations}
      popularDestinations={popularDestinations}
      popularMonths={popularMonths}
      journeys={journeys}
      filterJourneys={filterJourneys}
    />
  );
}
