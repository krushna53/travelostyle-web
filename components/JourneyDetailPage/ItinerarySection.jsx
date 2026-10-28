"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, Minus } from "lucide-react";
import Image from "@/components/SafeImage";

const JourneyMap = dynamic(() => import("./JourneyMap"), { ssr: false });

function DayAccordion({ item, isOpen, onToggle, onHover, onHoverEnd }) {
  return (
    <div
      className="border-2 border-black rounded-[0.5vw] overflow-hidden"
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between px-[1.2vw] py-[1vw] text-left"
      >
        <div className="flex-1 pr-4">
          <p className="text-[18px] font-semibold uppercase tracking-[0.1em] text-[#000000] mb-[0.2vw]">
            DAY {item.day}
          </p>
          <p className="text-[18px] font-semibold text-ink">
            {item.cityPair ? `${item.cityPair} - ` : ""}
            {item.title}
          </p>
          {item.stay ? (
            <p className="text-[18px] font-normal text-[#000000] mt-[0.2vw]">
              <span className="font-bold text-ink">Stay:</span> {item.stay}
            </p>
          ) : null}
          {isOpen && (
            <p className="text-[18px] text-[#000000] leading-[1.6] mt-[0.8vw]">
              {item.description || ""}
            </p>
          )}
        </div>
        <div className="flex h-[2.2vw] w-[2.2vw] shrink-0 items-center justify-center rounded-full bg-[#F2E2DA]">
          {isOpen ? (
            <Minus size={16} className="text-ink" />
          ) : (
            <Plus size={16} className="text-ink" />
          )}
        </div>
      </button>
    </div>
  );
}

// A broken location chain for one day (missing stay, missing hotel
// location, or missing/empty geofield) shouldn't crash the map — it just
// can't contribute a route point, so it's skipped here.
function buildJourneyMarkers(days) {
  const markers = [];
  days.forEach((d) => {
    if (typeof d.lat !== "number" || typeof d.lon !== "number") return;

    const last = markers[markers.length - 1];
    const isSameLocation =
      last &&
      Math.abs(last.lat - d.lat) < 1e-6 &&
      Math.abs(last.lon - d.lon) < 1e-6;

    if (isSameLocation) {
      last.days.push({ day: d.day, title: d.title });
    } else {
      markers.push({
        id: `${d.lat},${d.lon}`,
        lat: d.lat,
        lon: d.lon,
        stayName: d.stay,
        days: [{ day: d.day, title: d.title }],
      });
    }
  });
  return markers;
}

export default function ItinerarySection({
  drupalData,
  mapImage,
}) {
  const days = drupalData || [];
  const [openDay, setOpenDay] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  const toggle = (day) => setOpenDay((prev) => (prev === day ? null : day));

  const journeyMarkers = useMemo(() => buildJourneyMarkers(days), [days]);
  const hasInteractiveMap = journeyMarkers.length >= 2;
  const activeDay = hoveredDay ?? openDay;

  return (
    <div className="px-[5.5vw] py-[3vw]">
      <h2 className="text-center text-[32px] font-semibold text-ink mb-[2.5vw]">
        Here&apos;s How Your Days Unfold
      </h2>

      <div className="grid grid-cols-[2fr_3fr] gap-[2vw]">
        {/* Left: Journey map */}
      <div
        className={`border border-[#D9D9D9] rounded-[8px] overflow-hidden sticky top-[20px] self-start relative ${
          mapImage || hasInteractiveMap ? "min-h-[576px]" : ""
        }`}
      >
  {hasInteractiveMap ? (
    <div className="absolute inset-0">
      <JourneyMap markers={journeyMarkers} activeDay={activeDay} />
    </div>
  ) : mapImage ? (
    <Image
      src={mapImage}
      alt="Journey Map"
      fill
      className="object-cover"
    />
  ) : (
    // No map uploaded for this journey -> default "Journey Map Coming Soon"
    // image. Sized by its own aspect ratio (1566x1005) so it fills the box
    // edge to edge with no gap above or below.
    <Image
      src="/journey-map-placeholder.jpg"
      alt="Journey Map"
      width={1566}
      height={1005}
      className="block w-full h-auto"
    />
  )}
</div>
        {/* Right: Day accordion */}
        <div className="flex flex-col gap-[0.7vw]">
        
       {days.length === 0 ? (
  <div className="flex items-center justify-center min-h-[200px]">
    <p className="text-[24px] font-medium text-ink">
      Coming Soon
    </p>
  </div>
) : (
  days.map((item, index) => (
    <DayAccordion
      key={item.day ?? index}
      item={item}
      isOpen={openDay === item.day}
      onToggle={() => toggle(item.day)}
      onHover={() => setHoveredDay(item.day)}
      onHoverEnd={() => setHoveredDay(null)}
    />
  ))
)}
        </div>
      </div>
    </div>
  );
}
