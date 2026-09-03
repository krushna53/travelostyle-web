"use client";

import { useState } from "react";
import JourneysWeLove from "./JourneysWeLove";

export default function YourNextTrip({ initialJourneys = null }) {
  const [activeTab, setActiveTab] = useState("journeys");

  return (
    <section className="overflow-hidden py-8 md:py-[5vw]">
      <div className="mx-auto w-[95%]">
        <div className="flex flex-col items-start text-left px-4 md:items-center md:text-center md:px-0">
          <h2 className="font-nohemi max-w-[391px] md:max-w-none text-[32px] leading-[40px] font-semibold tracking-[0.05em] text-[#1A1A1A] md:text-[3vw] md:leading-[1.25] md:tracking-[-0.08vw] md:text-ink">
            Take your next trip with TravelOStyle
          </h2>

          <p className="mt-2 max-w-[337px] font-nohemi text-[16px] font-light leading-[24px] tracking-[0.05em] text-[#1A1A1A] md:mt-3 md:max-w-[43vw] md:text-[0.92vw] md:font-normal md:leading-[1.8] md:tracking-normal md:text-[#6D6D6D]">
            The journeys we know well, believe in genuinely, and can deliver on —{" "}
            <br className="hidden md:inline" />
            every single time.
          </p>
        </div>

        <div className="mt-6 md:mt-[4vw]">
  <div className="mx-auto w-[calc(100%-32px)] max-w-[1416px] overflow-x-auto border-b border-#1A1A1A px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible">
    
    <div className="flex w-max items-end whitespace-nowrap md:w-full md:min-w-0">
      
      <button
        onClick={() => setActiveTab("journeys")}
        className={`relative flex h-[48px] shrink-0 items-end justify-center px-2 pb-3 font-nohemi text-[21px] leading-[32px] tracking-[0.05em] transition-all duration-300 md:h-[52px] md:w-1/3 md:px-0 md:pb-[10px] md:text-[24px] md:leading-[32px] md:tracking-[0.05em] ${
          activeTab === "journeys"
            ? "font-semibold text-[#1A1A1A]"
            : "font-light text-[#707070]"
        }`}
      >
        Journeys We Love

        {activeTab === "journeys" && (
          <span className="absolute bottom-[-1px] left-0 z-10 h-[5px] w-full bg-[#1A1A1A]" />
        )}
      </button>

      <button
        onClick={() => setActiveTab("destinations")}
        className={`relative flex h-[48px] shrink-0 items-end justify-center px-2 pb-3 font-nohemi text-[21px] leading-[32px] tracking-[0.05em] transition-all duration-300 md:h-[52px] md:w-1/3 md:px-0 md:pb-[10px] md:text-[24px] md:leading-[32px] md:tracking-[0.05em] ${
          activeTab === "destinations"
            ? "font-semibold text-[#1A1A1A]"
            : "font-light text-[#707070]"
        }`}
      >
        Popular Destinations

        {activeTab === "destinations" && (
          <span className="absolute bottom-[-1px] left-0 z-10 h-[5px] w-full bg-[#1A1A1A]" />
        )}
      </button>

      <button
        onClick={() => setActiveTab("deals")}
        className={`relative flex h-[48px] shrink-0 items-end justify-center px-2 pb-3 font-nohemi text-[21px] leading-[32px] tracking-[0.05em] transition-all duration-300 md:h-[52px] md:w-1/3 md:px-0 md:pb-[10px] md:text-[24px] md:leading-[32px] md:tracking-[0.05em] ${
          activeTab === "deals"
            ? "font-semibold text-[#1A1A1A]"
            : "font-light text-[#707070]"
        }`}
      >
        Exclusive Deals

        {activeTab === "deals" && (
          <span className="absolute bottom-[-1px] left-0 z-10 h-[5px] w-full bg-[#1A1A1A]" />
        )}
      </button>

    </div>
  </div>
</div>

        {activeTab === "journeys" && (
          <JourneysWeLove initialJourneys={initialJourneys} />
        )}

        {activeTab === "destinations" && <JourneysWeLove onlyPopular />}

        {activeTab === "deals" && <JourneysWeLove onlyWithOffer />}
      </div>
    </section>
  );
}