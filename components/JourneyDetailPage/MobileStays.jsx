import Image from "next/image";
import React, { useState } from "react";
import GalleryMobileView from "./GalleryMobileView";
import JourneyCardImage from "@/components/JourneyCardImage";

export default function MobileStays({ onBack, StaysRecord }) {
  const staysData = Array.isArray(StaysRecord) ? StaysRecord : [];

  const [selectedStay, setSelectedStay] = useState(null);

  if (selectedStay) {
    return (
      <GalleryMobileView
        selectedStay={selectedStay}
        onBack={() => setSelectedStay(null)}
      />
    );
  }
  return (
    <div className="w-full max-w-md p-6 flex flex-col">
      <div className="mb-4 flex items-center justify-between pb-3">
        <button
          onClick={onBack}
          className="flex h-6 w-12 items-center justify-center rounded-full bg-white transition active:scale-95"
        >
          <Image src="/LeftArrow.svg" alt="Back" width={56} height={24} />
        </button>

        <h1 className="text-base font-bold tracking-tight text-ink">
          Stays
        </h1>

        <div className="w-12" />
      </div>
      {staysData.length === 0 ? (
        <div className="flex min-h-[120px] items-center justify-center rounded-lg border p-4">
          <p className="text-base font-medium text-ink">Coming Soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {staysData.map((stay, index) => (
            <div
              key={index}
              className="flex h-full flex-col bg-white border-2 border-neutral-800 rounded-lg overflow-hidden shadow-sm"
            >
              {/* Image Container */}
              <div className="h-28 w-full relative overflow-hidden border-b-2 border-neutral-800 shrink-0">
                <JourneyCardImage src={stay.image} alt={stay.name} />
              </div>
              <div className="flex-1 p-3">
                <div>
                  <h2 className="font-bold text-[13px] leading-tight text-neutral-950 mb-1 line-clamp-2">
                    {stay.name}
                  </h2>
                  <p className="text-[10px] text-neutral-500 leading-snug line-clamp-3">
                    {stay.desc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStay(stay)}
                className="w-full shrink-0 py-2 bg-white border-t-2 border-neutral-800 text-[11px] font-bold text-neutral-900 underline underline-offset-2 hover:bg-neutral-50 transition-colors"
              >
                View Gallery
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
