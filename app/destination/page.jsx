import SearchBar from "../../components/HomePage/FindYourJourney/SearchBar";
import Destination from "../../components/Destination/Destination";
import Footer from "../../components/Footer";
import ExploreAllJourneys from "../../components/Destination/ExploreAllJourneys";
import Form from '../../components/Destination/Form';
import Region from "../../components/Destination/Region";
import { getRegions } from "@/lib/regions";
import { getJourneyCards } from "@/lib/journeyCard";


export default async function Page() {
    const [regions, journeys] = await Promise.all([
      getRegions(),
      getJourneyCards(),
    ]);

    return(
    <>
    <SearchBar/>
    <ExploreAllJourneys/>
    <Region regions={regions}/>
    <Destination initialJourneys={journeys}/>
    <Form/>
      <Footer />
    </>
  );
}
