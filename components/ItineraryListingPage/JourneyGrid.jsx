import JourneyCard from "@/components/JourneyCard";

export default function JourneyGrid({ journeys }) {
  if (!journeys.length) {
    return (
      <div className="py-10 text-center text-[#757575]">
        No journeys found
      </div>
    );
  }

  // Columns follow the listing column beside the filter sidebar, not the
  // window: a card needs ~300px, and that column is only 533px at 1024, 651
  // at 1142, 880 at 1440 and 995 at 1600. Three across from md had the cards
  // at ~190px with View Trip pushed out of them. min-[] steps only -- named
  // md/lg variants are emitted after arbitrary min-[] ones and would win.
  return (
    <div className="grid grid-cols-1 min-[1100px]:grid-cols-2 min-[1560px]:grid-cols-3 md:max-w-[1266px] md:mx-auto md:justify-items-center gap-4 md:gap-[7px] md:max-[1910px]:gap-[7px] md:max-[1700px]:gap-[6px] md:max-[1500px]:gap-[5px] md:max-[1281px]:gap-[5px] md:max-[1250px]:gap-[5px] md:max-[1200px]:gap-[4px] min-[1920px]:gap-[48px]">
      {journeys.map((trip) => (
        <JourneyCard
          key={trip.id}
          trip={trip}
          variant="grid"
        />
      ))}
    </div>
  );
}