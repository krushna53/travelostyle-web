"use client";

import Image from "@/components/SafeImage";
import React, { useState } from "react";
import CtaBanner from "./CtaBanner";

export default function MobileItinerary({
  onBack,
  itineraryRecord,
  mapImage,
  journey,
}) {
  const [openDay, setOpenDay] = useState(1);
  const itinerary = Array.isArray(itineraryRecord) ? itineraryRecord : [];
  const toggleDay = (dayNum) => {
    setOpenDay(openDay === dayNum ? null : dayNum);
  };

  return (
    <div className="w-full max-w-[390px] mx-auto bg-[#F9F9F9] min-h-screen font-sans p-4 antialiased selection:bg-gray-200">
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
        <button
          onClick={onBack}
          className="flex h-6 w-12 items-center justify-center rounded-full bg-white transition active:scale-95"
        >
          <Image src="/LeftArrow.svg" alt="Back" width={56} height={24} />
        </button>

        <h1 className="text-base font-bold tracking-tight text-ink">
          Itinerary
        </h1>

        <div className="w-12" />
      </div>
      <h2 className="text-sm font-bold text-neutral-800 mb-3 tracking-tight">
        Learn How Your Days Unfold
      </h2>

      <div className="relative w-full h-52 bg-white border-2 border-neutral-800 overflow-hidden flex items-center justify-center mb-4 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
        {mapImage ? (
          <Image
            src={mapImage}
            alt="Journey Map"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <span className="text-xs font-semibold text-neutral-700 tracking-wide">
            No map available
          </span>
        )}
      </div>
      <div className="space-y-3 pb-8">
        {itinerary.length === 0 ? (
          <div className="flex min-h-[120px] items-center justify-center rounded-xl border p-4">
            <p className="text-base font-medium text-ink">Coming Soon</p>
          </div>
        ) : (
        itinerary.map((item) => {
          const isOpen = openDay === item.day;

          return (
            <div
              key={item.day}
              className="bg-white border-2 border-neutral-800 overflow-hidden shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all"
            >
              <button
                onClick={() => toggleDay(item.day)}
                className="w-full text-left p-4 flex justify-between items-start focus:outline-none"
              >
                <div className="space-y-0.5">
                  <span className="block text-[11px] font-black uppercase tracking-wider text-neutral-900">
                    DAY {item.day}
                  </span>
                  <h3 className="text-[15px] font-extrabold text-neutral-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600">
                    <span className="font-bold text-neutral-900">Stay:</span>{" "}
                    {item.stay}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2 w-6 h-6 rounded-full bg-[#F3EBE6] border border-neutral-400 flex items-center justify-center font-mono font-bold text-neutral-700 text-sm select-none">
                  {isOpen ? "−" : "+"}
                </div>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen
                    ? "max-h-[500px] border-t-2 border-neutral-100"
                    : "max-h-0"
                }`}
              >
                <div className="p-4 pt-2 text-[12.5px] text-neutral-800 leading-relaxed font-normal whitespace-pre-line">
                  {item.description}
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>

      <div className="-mx-4">
        <CtaBanner
          buttonText="Request A Private Journey"
          formType="private"
          journey={journey}
          showDepartureDate={false}
        />
      </div>
    </div>
  );
}
