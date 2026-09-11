import JourneyCard from "@/components/JourneyCard";

export default function JourneyList({
  trips,
  containerRef,
}) {
  return (
    <div
      ref={containerRef}
      className="flex gap-[1.4vw] overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {trips.map((trip) => (
        <JourneyCard
          key={trip.id}
          trip={trip}
          variant="grid"
        />
      ))}
    </div>
  );
}