import JourneyCard from "./JourneyCard";

export default function JourneyGrid({ journeys }) {
  if (!journeys.length) {
    return (
      <div className="py-10 text-center text-[#757575]">
        No journeys found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:flex md:flex-wrap md:gap-[45px]">
      {journeys.map((trip) => (
        <JourneyCard
          key={trip.id}
          trip={trip}
        />
      ))}
    </div>
  );
}