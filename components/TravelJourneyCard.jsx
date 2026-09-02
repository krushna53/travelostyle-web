"use client";

import { toast } from "sonner";
import JourneyCard from "@/components/JourneyCard";

function mapJourneyToTrip(journey) {
  return {
    id: journey.id,
    title: journey.title,
    desc: journey.description,
    days: journey.duration,
    destinations: journey.destinations,
    price: journey.price,
    offer: journey.earlyBird || "",
    image: journey.image,
    region: journey.region,
    tags: journey.types,
    viewTripUrl: journey.viewTripUrl,
    viewTripText: journey.viewTripText,
  };
}

// Grid-layout counterpart of JourneysWeLove's carousel — same JourneyCard
// markup, just laid out in a responsive grid instead of a horizontal
// scroller. Used on the journey-type listing pages (Private/TailorMade/
// Group/Destinations).
export default function TravelJourneyCard({
  journeys = [],
  selectedTrips = [],
  onCompare,
}) {
  return (
    <div className="w-full  mx-auto pt-6 md:pb-12 overflow-hidden">
      <div className="flex flex-row flex-wrap overflow-x-auto snap-x snap-mandatory gap-4 scroll-smooth pt-2 pb-6 pl-4 pr-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-center md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:pt-0">
        {journeys.map((journey) => {
          const trip = mapJourneyToTrip(journey);
          return (
            <JourneyCard
              key={journey.id}
              trip={trip}
              variant="grid"
              onCompare={() => {
                if (selectedTrips?.includes(journey.id)) {
                  toast("Trip already added to comparison");
                  return;
                }
                onCompare(journey);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
