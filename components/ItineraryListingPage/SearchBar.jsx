import { getFilterOptions } from "@/lib/getFilterOptions";
import {
  getAllDestinationSearchOptions,
  getPopularDestinations,
} from "@/lib/getPopularDestinations";
import SearchBarClient from "./SearchBarClient";

export default async function SearchBar() {
  const [
    { destinations, months },
    allDestinations,
    { popularDestinations, popularMonths },
  ] = await Promise.all([
    getFilterOptions(),
    getAllDestinationSearchOptions(),
    getPopularDestinations(),
  ]);

  return (
    <SearchBarClient
      destinations={destinations}
      months={months}
      allDestinations={allDestinations}
      popularDestinations={popularDestinations}
      popularMonths={popularMonths}
    />
  );
}
