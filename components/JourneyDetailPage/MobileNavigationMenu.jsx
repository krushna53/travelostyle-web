"use client";

import Itinerary from "./Itinerary";
import MobileHighlightsPage from "./MobileHighlightsPage";
import InclusionsExclusions from "./Inclusionexclusion";
import MobileAdditionalInformation from "./MobileAdditionalInformation";
import MobileStays from "./MobileStays";
import JourneyPricing from "./DatePricing";
import BookYourJourneyMobile from "./BookYourJourneyMobile";
import CtaBanner from "./CtaBanner";

export default function MobileNavigationMenu({
  journey,
  departures,
  activeView,
  inclusions,
  exclusions,
  setActiveView
}){
  // Inspirational journeys have no bookable departures, so "Dates &
  // Pricing" is left out of the mobile menu entirely (matches the desktop
  // DetailTabs behavior).
  const menuItems = [
    { label: "Highlights", id: "highlights" },
    { label: "Itinerary", id: "itinerary" },
    { label: "Stays", id: "stays" },
    { label: "Inclusions & Exclusions", id: "inclusions-exclusions" },
    ...(journey?.isInspirational ? [] : [{ label: "Dates & Pricing", id: "dates-pricing" }]),
    { label: "Additional Information", id: "additional-information" },
  ];

 if (activeView === "menu") {
    return (
      <div className="block w-full bg-[#F9F9F9] md:hidden">
        {/* Figma: rows separated by 2px #1A1A1A rules (y=858…1234, ~61px
            apart), label 18px/400 at x=27, and a 56x24 outlined pill with a
            right-arrow at x=307 instead of the old RightArrow.svg. */}
        <div className="border-t-2 border-[#1A1A1A]">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveView(item.id);
                window.scrollTo({ top: 0, behavior: "auto" });
              }}
              className="flex h-[61px] w-full items-center justify-between border-b-2 border-[#1A1A1A] px-[27px] text-left transition active:bg-black/5"
            >
              <span className="text-[18px] font-normal leading-[36px] tracking-[0.05em] text-[#1A1A1A]">
                {item.label}
              </span>

              <span className="flex h-[24px] w-[56px] shrink-0 items-center justify-center rounded-[30px] border-2 border-[#1A1A1A] transition active:scale-95">
                <svg
                  width="24"
                  height="8"
                  viewBox="0 0 24 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 4h22M18 1l4 3-4 3"
                    stroke="#1A1A1A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-[66px] pb-[64px]">
          <CtaBanner
            variant="card"
            buttonText="Request A Private Journey"
            formType="private"
            journey={journey}
            showDepartureDate={false}
          />
        </div>
      </div>
    );
 }

  // ── VIEW 2: FULL HIGHLIGHTS PAGE ──────────────────────────────────
if (activeView === "inclusions-exclusions") {
  return (
    <InclusionsExclusions
      inclusions={inclusions}
      exclusions={exclusions}
      onBack={() => setActiveView("menu")}
    />
  );
}
if (activeView === "highlights") {
  return (
    <MobileHighlightsPage
      onBack={() => setActiveView("menu")}
      onNext={() => setActiveView("itinerary")}
      highlightsRecord={journey.tabHighlights}
      journey={journey}
    />
  );
}
if (activeView === "itinerary") {
  return (
    <Itinerary
      onBack={() => setActiveView("highlights")}
      onNext={() => setActiveView("stays")}
      itineraryRecord={journey.tabItinerary}
      mapImage={journey.mapImage}
      journey={journey}
    />
  );
}
if (activeView === "additional-information") {
  return (
    <MobileAdditionalInformation
      onBack={() => setActiveView("stays")}
      drupalData={journey.tabAdditionalInfo}
    />
  );
}

if (activeView === "stays") {
  return (
    <MobileStays
      onBack={() => setActiveView("itinerary")}
      onNext={() => setActiveView("additional-information")}
       StaysRecord={journey.tabStays}
    />
  );
}
if (activeView === "dates-pricing") {
  return (
    <JourneyPricing
      journey={journey}
      departures={departures}
      onBack={() => setActiveView("menu")}
    />
  );
}
}
