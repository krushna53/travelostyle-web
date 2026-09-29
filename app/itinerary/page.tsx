import AllJourneysPage from "@/components/ItineraryListingPage/AllJourneysPage";
import Footer from "@/components/Footer";
import SearchBar from "@/components/ItineraryListingPage/SearchBar";
import { getAllJourneysList, getJourneyFilterOptions } from "@/lib/allJourneys";

// Rendered per request because the listing reads its filters from the URL
// (useSearchParams); the Drupal fetches behind it are still cached for 60s.
export const dynamic = "force-dynamic";

export default async function ItineraryPage() {
  const [initialJourneys, initialFilterOptions] = await Promise.all([
    getAllJourneysList(),
    getJourneyFilterOptions(),
  ]);

  return (
    <>
      <SearchBar/>


      <AllJourneysPage
        initialJourneys={initialJourneys}
        initialFilterOptions={initialFilterOptions}
      />
      <Footer />
    </>
  );
}