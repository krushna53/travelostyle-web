import AllJourneysPage from "@/components/ItineraryListingPage/AllJourneysPage";
import Footer from "@/components/Footer";
import SearchBar from "@/components/ItineraryListingPage/SearchBar";
import { getAllJourneysList, getJourneyFilterOptions } from "@/lib/allJourneys";

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