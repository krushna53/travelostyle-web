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
      <div className="sticky top-0 z-20 bg-white border-b border-[#E5E5E5] shadow-[0_6px_16px_-6px_rgba(0,0,0,0.15)] flex items-center h-[78px] px-[20px] max-[901px]:h-[64px] max-[901px]:px-[20px] max-[1200px]:h-[68px] max-[1200px]:px-[26px] max-[1250px]:h-[72px] max-[1250px]:px-[32px] max-[1281px]:h-[74px] max-[1281px]:px-[38px] max-[1910px]:h-[78px] max-[1910px]:px-[48px] min-[1919px]:h-[80px] min-[1919px]:px-[64px]">
        <div className="flex items-center w-full h-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-x-[10px] max-[901px]:gap-x-[4px] max-[1200px]:gap-x-[8px] max-[1250px]:gap-x-[10px] max-[1281px]:gap-x-[12px] max-[1910px]:gap-x-[16px] min-[1919px]:gap-x-[18px] justify-between pl-[48px] max-[901px]:pl-[48px] max-[1200px]:pl-[56px] max-[1250px]:pl-[64px] max-[1281px]:pl-[70px] max-[1910px]:pl-[76px] min-[1919px]:pl-[80px]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative shrink-0 px-[6px] max-[901px]:px-[6px] max-[1200px]:px-[10px] max-[1250px]:px-[12px] max-[1281px]:px-[14px] max-[1910px]:px-[18px] min-[1919px]:px-[22px] py-[18px] max-[901px]:py-[6px] max-[1200px]:py-[10px] max-[1250px]:py-[13px] max-[1281px]:py-[15px] max-[1910px]:py-[18px] min-[1919px]:py-[21px] whitespace-nowrap font-[Nohemi] leading-[1.5] tracking-[0.05em] transition-colors max-[901px]:tracking-normal text-[19px] max-[901px]:text-[11px] max-[1200px]:text-[15px] max-[1250px]:text-[16px] max-[1281px]:text-[18px] max-[1910px]:text-[19px] min-[1919px]:text-[21px] ${
                tab === "Additional Information"
                  ? journey?.isInspirational
                    ? "mr-[43px] max-[901px]:mr-[43px] max-[1200px]:mr-[24px] max-[1250px]:mr-[25px] max-[1281px]:mr-[10px] max-[1910px]:mr-[77px] min-[1911px]:mr-[60px]"
                    : "mr-[43px] max-[901px]:mr-[43px] max-[1200px]:mr-[24px] max-[1250px]:mr-[25px] max-[1281px]:mr-[10px] max-[1910px]:mr-[77px] min-[1911px]:mr-[60px] max-[1451px]:-mr-[12px]"
                  : ""
              } ${
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
