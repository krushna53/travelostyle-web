"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";



function DayAccordion({ item, isOpen, onToggle }) {
  return (
    <div className="border-2 border-black rounded-[0.5vw] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between px-[1.2vw] py-[1vw] text-left"
      >
        <div className="flex-1 pr-4">
          <p className="text-[18px] font-semibold uppercase tracking-[0.1em] text-[#000000] mb-[0.2vw]">
            DAY {item.day}
          </p>
          <p className="text-[18px] font-semibold text-ink">
            {item.title}
          </p>
          <p className="text-[18px] font-normal text-[#000000] mt-[0.2vw]">
            <span className="font-bold text-ink">Stay:</span> {item.stay}
          </p>
          {isOpen && (
            <p className="text-[18px] text-[#000000] leading-[1.6] mt-[0.8vw]">
              {item.description}
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

export default function ItinerarySection({
  drupalData,
  mapImage,
}) {
  const days = drupalData || [];
  const [openDay, setOpenDay] = useState(null);

  const toggle = (day) => setOpenDay((prev) => (prev === day ? null : day));

  return (
    <div className="px-[5.5vw] py-[3vw]">
      <h2 className="text-center text-[32px] font-semibold text-ink mb-[2.5vw]">
        Here&apos;s How Your Days Unfold
      </h2>

      <div className="grid grid-cols-[2fr_3fr] gap-[2vw]">
        {/* Left: Map placeholder */}
      <div className="border border-[#D9D9D9] rounded-[0.4vw] overflow-hidden min-h-[30vw] sticky top-[1vw] self-start relative">
  {mapImage ? (
    <Image
      src={mapImage}
      alt="Journey Map"
      fill
      className="object-cover"
    />
  ) : (
    <div className="flex items-center justify-center h-full">
      No map available
    </div>
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
    />
  ))
)}
        </div>
      </div>
    </div>
  );
}
