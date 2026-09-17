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
// `columns` sets the desktop grid width — 3 (default, used by the
// Group/Private/Tailor-made listing pages) or 4 (the Destinations page's
// "Destinations TravelOStyle Knows Best" rail). Written as an explicit
// branch rather than a template-interpolated class so Tailwind's JIT scan
// can still find the literal class names.
//
// "4-stepped" is the Group/Private RTB listing grids: four across as on the
// 1920 board, but stepping down to 3 and then 2 on narrower windows. A grid
// card needs ~330px -- below that the tag pills wrap under the photo and the
// View Trip button pushes out of the card (seen at 1366 and 1024). All three
// steps use min-[Npx] on purpose: Tailwind emits arbitrary min-[] variants
// ahead of the named md/lg/xl ones, so mixing the two let xl:grid-cols-3
// override min-[1441px]:grid-cols-4 and 1920 came out three across.
// Four starts ABOVE 1440 -- a 1440 laptop keeps three across.
const GRID_COLS_CLASS = {
  3: "md:grid-cols-3 md:max-w-[1218px]",
  4: "md:grid-cols-4 md:max-w-[1632px]",
  "4-stepped":
    "min-[768px]:grid-cols-2 min-[1280px]:grid-cols-3 min-[1441px]:grid-cols-4 md:max-w-[1632px]",
};

export default function TravelJourneyCard({
  journeys = [],
  selectedTrips = [],
  onCompare,
  mobileSlider = false,
  mobileWidthClass,
  columns = 3,
  sliderPadClass = "pl-4 pr-4 scroll-pl-4",
}) {
  const gridColsClass = GRID_COLS_CLASS[columns] || GRID_COLS_CLASS[3];

  return (
    <div className="w-full  mx-auto pt-6 md:pb-12 md:mb-6 overflow-hidden">
      <div
        className={`${
          mobileSlider
            ? `flex overflow-x-auto snap-x snap-mandatory gap-4 scroll-smooth ${sliderPadClass} max-md:[&>*]:snap-start pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:mx-auto md:justify-items-center md:gap-6 md:overflow-visible md:px-0 md:pb-0`
            : "flex flex-row flex-wrap overflow-x-auto snap-x snap-mandatory gap-4 scroll-smooth pt-2 pb-6 pl-4 pr-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-center md:grid md:mx-auto md:justify-items-center md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:pt-0"
        } ${gridColsClass}`}
      >
        {journeys.map((journey) => {
          const trip = mapJourneyToTrip(journey);
          return (
            <JourneyCard
              key={journey.id}
              trip={trip}
              variant="grid"
              mobileWidthClass={mobileWidthClass}
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
