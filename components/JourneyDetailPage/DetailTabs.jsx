"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import HighlightsSection from "./HighlightsSection";
import ItinerarySection from "./ItinerarySection";
import StaysSection from "./StaysSection";
import CtaBanner from "./CtaBanner";
import InclusionsExclusions from "./Inclusionexclusion";
import JourneyPricing from "./DatePricing";
import AdditionalInformationSection from "./AdditionalInformationSection";
const TABS = [
  "Highlights",
  "Itinerary",
  "Stays",
  "Inclusions & Exclusions",
  "Dates & Pricing",
  "Additional Information",
];

const DetailTabs = forwardRef(function DetailTabs(
  { journey, departures, journeyId, inclusions, exclusions },
  ref,
) {
  const [activeTab, setActiveTab] = useState("Highlights");
  const containerRef = useRef(null);
 console.log("DETAIL TABS INCLUSIONS", inclusions);
  console.log("DETAIL TABS EXCLUSIONS", exclusions);

  // Inspirational journeys have no bookable departures, so the Dates &
  // Pricing tab doesn't apply to them at all — it's dropped from the tab
  // list entirely rather than just disabled.
  const tabs = journey?.isInspirational
    ? TABS.filter((tab) => tab !== "Dates & Pricing")
    : TABS;

  // Exposed to JourneyDetailClient so the hero card's "Check Dates &
  // Availability" button (Group journeys only) can jump straight to this
  // tab without lifting `activeTab` state out of this component.
  useImperativeHandle(ref, () => ({
    showDatesPricing: () => {
      if (journey?.isInspirational) return;
      setActiveTab("Dates & Pricing");
      requestAnimationFrame(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
  }));

  return (
    <>
    <div ref={containerRef} className="bg-white hidden md:block">
      <div className="sticky top-0 z-20 bg-white border-b border-[#E5E5E5] shadow-[0_6px_16px_-6px_rgba(0,0,0,0.15)] flex items-center h-[78px] px-[64px] max-[900px]:h-[64px] max-[900px]:px-[16px] max-[1200px]:h-[68px] max-[1200px]:px-[24px] max-[1250px]:h-[72px] max-[1250px]:px-[32px] max-[1281px]:h-[74px] max-[1281px]:px-[40px] max-[1910px]:h-[78px] max-[1910px]:px-[64px] min-[1919px]:h-[80px] min-[1919px]:px-[84px]">
        <div className="flex items-center w-full max-w-[1548px] h-full mx-auto overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-x-[24px] max-[900px]:gap-x-[8px] max-[1200px]:gap-x-[12px] max-[1250px]:gap-x-[16px] max-[1281px]:gap-x-[20px] max-[1910px]:gap-x-[24px] min-[1919px]:gap-x-[28px] justify-between max-[900px]:justify-between max-[1200px]:justify-between max-[1250px]:justify-between max-[1281px]:justify-between max-[1910px]:justify-between min-[1919px]:justify-between">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative shrink-0 px-[10px] max-[900px]:px-[10px] max-[1200px]:px-[14px] max-[1250px]:px-[16px] max-[1281px]:px-[18px] max-[1910px]:px-[22px] min-[1919px]:px-[26px] py-[18px] max-[900px]:py-[8px] max-[1200px]:py-[10px] max-[1250px]:py-[13px] max-[1281px]:py-[15px] max-[1910px]:py-[18px] min-[1919px]:py-[21px] whitespace-nowrap font-[Nohemi] leading-[1.5] tracking-[0.05em] transition-colors text-[19px] max-[900px]:text-[13px] max-[1200px]:text-[15px] max-[1250px]:text-[16px] max-[1281px]:text-[18px] max-[1910px]:text-[19px] min-[1919px]:text-[21px] ${
                activeTab === tab
                  ? "font-bold text-black"
                  : "font-light text-black/50 hover:text-black/80"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "Highlights" && (
          <>
            <HighlightsSection
              highlights={journey?.highlights}
              drupalData={journey?.tabHighlights}
            />
            <CtaBanner
              formType="private"
              journey={journey}
              showDepartureDate={false}
            />
          </>
        )}

        {activeTab === "Itinerary" && (
          <>
            <ItinerarySection
              itinerary={journey?.itinerary}
              drupalData={journey?.tabItinerary}
              mapImage={journey.mapImage}
            />
            <CtaBanner
              buttonText="Request A Private Journey"
              formType="private"
              journey={journey}
              showDepartureDate={false}
            />
          </>
        )}


        {activeTab === "Stays" && (
  <StaysSection
    stays={journey?.stays}
    drupalData={journey?.tabStays}
  />
)}


{activeTab === "Inclusions & Exclusions" && (
  <InclusionsExclusions
    inclusions={inclusions}
    exclusions={exclusions}
  />
)}
    

{activeTab === "Dates & Pricing" && !journey?.isInspirational && (
  <>
    <JourneyPricing
      journey={journey}
      departures={departures}
      journeyId={journeyId}
    />
    <CtaBanner
      buttonText="Request A Private Journey"
      formType="private"
      journey={journey}
      showDepartureDate={false}
    />
  </>
)}

        {activeTab === "Additional Information" && (
          <AdditionalInformationSection
            drupalData={journey?.tabAdditionalInfo}
          />
        )}
      </div>

    </div>

    </>
  );
});

export default DetailTabs;
