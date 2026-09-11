import JourneyCard from "@/components/JourneyCard";

export default function JourneyGrid({ journeys }) {
  if (!journeys.length) {
    return (
      <div className="py-10 text-center text-[#757575]">
        No journeys found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:max-w-[1266px] md:mx-auto md:justify-items-center gap-4 md:gap-[7px] md:max-[1910px]:gap-[7px] md:max-[1700px]:gap-[6px] md:max-[1500px]:gap-[5px] md:max-[1281px]:gap-[5px] md:max-[1250px]:gap-[5px] md:max-[1200px]:gap-[4px] min-[1920px]:gap-[48px]">
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