"use client";

import { Info } from "lucide-react";
import Image from "next/image";
import MobileNavigationMenu from "./MobileNavigationMenu";
import PrivateInquiryForm from "@/components/PrivateInquiryForm";
import BuildYourJourneyForm from "@/components/BuildYourJourneyForm";
import JourneyCardImage from "@/components/JourneyCardImage";
import { useMemo, useState, useEffect, useRef } from "react";
import { pickPriorityDeparture } from "@/lib/departures";

// Fixed badge colors matching the design (Figma) reference:
// Early Bird / offer = peach, tags (field_journey_tag, e.g. Group/Private
// Journey) = green, categories (field_category, e.g. Culture & Heritage,
// Leisure) = blue. All badge text is black, font-semibold, rounded-[5px].

// field_category is an entity reference to the "Category" taxonomy
// vocabulary (unlimited cardinality) on the journey node. We resolve it
// right here from the raw JSON:API item + included data (rather than in
// JourneyDetailClient) so all category-related logic stays in one place.
// Matching by id only (not resource type) since ids are unique across the
// whole `included` array.
function resolveCategories(item, included) {
  const data = item?.relationships?.field_category?.data;
  const arr = Array.isArray(data) ? data : data ? [data] : [];
  return arr
    .map((c) => {
      const e = included.find((i) => i.id === c.id);
      return e?.attributes?.name;
    })
    .filter(Boolean);
}
function trimByWords(text, maxWords = 25) {
  if (!text) return "";

  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text.trim();
  }

  return words.slice(0, maxWords).join(" ") + "...";
}

const MOCK_CATEGORIES = ["Culture & Heritage", "Leisure"];

export default function HeroSection({
  journey,
  departures,
  inclusions,
  exclusions,
  rawItem,
  included = [],
  // Group journeys only — switches DetailTabs to "Dates & Pricing" and
  // scrolls it into view (see JourneyDetailClient).
  onCheckAvailability,
}) {
  const [activeView, setActiveView] = useState("menu");
  const [isPrivateFormOpen, setIsPrivateFormOpen] = useState(false);
  const [isCraftFormOpen, setIsCraftFormOpen] = useState(false);
  // Remembers where the mobile menu list was scrolled to when a tab was
  // opened, so the "back" button can return there instead of dumping the
  // user back at the top of the page.
  const menuScrollPositionRef = useRef(0);
  const handleSetActiveView = (view) => {
    if (view === "menu") {
      setActiveView(view);
      // Restore after the menu view has rendered.
      requestAnimationFrame(() => {
        window.scrollTo({ top: menuScrollPositionRef.current, behavior: "auto" });
      });
      return;
    }
    if (activeView === "menu") {
      menuScrollPositionRef.current = window.scrollY;
    }
    setActiveView(view);
  };
  useEffect(() => {
  if (activeView !== "menu") {
    window.scrollTo(0, 0);
  }
}, [activeView]);
  const categories = rawItem ? resolveCategories(rawItem, included) : MOCK_CATEGORIES;
  const isInspirational = Boolean(journey?.isInspirational);
  // Group journeys: "Request a Private Journey" from the summary card has
  // no specific date attached, so it's pre-filled with whichever upcoming
  // departure is most relevant — the soonest one currently on offer, or
  // failing that the soonest upcoming date at all.
  const priorityDeparture = useMemo(
    () => (isInspirational ? null : pickPriorityDeparture(departures)),
    [isInspirational, departures],
  );
  return (
    <>
    <section className="w-full bg-white hidden md:block">
      <div className="flex items-center justify-between border-b border-[#E8E8E8] bg-white px-[16px] py-[8px] md:px-[28px] md:py-[9px] lg:px-[36px] xl:px-[48px] xl:py-[10px]">

<div className="flex items-center gap-[10px] flex-wrap">
  {journey?.earlyBird && (
    <span
      className="cursor-pointer rounded-[5px] px-[10px] py-[6px] text-[10px] md:px-[12px] md:py-[7px] md:text-[11px] xl:py-[8px] xl:text-[12px] font-semibold tracking-[0.05em]"
      style={{
        backgroundColor: "#F2E2DA",
        color: "#000000",
      }}
    >
      Early Bird
    </span>
  )}

  

  {categories?.map((category) => (
    <span
      key={category}
      className="cursor-pointer rounded-[5px] px-[10px] py-[6px] text-[10px] md:px-[12px] md:py-[7px] md:text-[11px] xl:py-[8px] xl:text-[12px] font-semibold tracking-[0.05em]"
      style={{
        backgroundColor: "#C2E5FF",
        color: "#000000",
      }}
    >
      {category}
    </span>
  ))}
   {journey?.tags?.map((tag) => (
    <span
      key={tag}
      className="cursor-pointer rounded-[5px] px-[10px] py-[6px] text-[10px] md:px-[12px] md:py-[7px] md:text-[11px] xl:py-[8px] xl:text-[12px] font-semibold tracking-[0.05em]"
      style={{
        backgroundColor: "#EFF3CF",
        color: "#000000",
      }}
    >
      {tag}
    </span>
  ))}
</div>
        <div className="flex items-center gap-[4px] text-[10px] md:text-[11px] xl:text-[12px] text-[#888]">
          <span className="cursor-pointer hover:underline">Home</span>
          <span className="text-[#BBB]">&gt;</span>
          <span className="cursor-pointer hover:underline">All Journeys</span>
          <span className="text-[#BBB]">&gt;</span>
          <span className="text-ink">{journey.title}</span>
        </div>
      </div>

      <div className="relative grid w-full overflow-hidden min-h-[640px] max-[900px]:min-h-[600px] max-[1200px]:min-h-[600px] max-[1250px]:min-h-[610px] max-[1281px]:min-h-[620px] max-[1910px]:min-h-[640px] min-[1919px]:min-h-[680px]">
        <div className="relative col-start-1 row-start-1 col-end-2 row-end-2">
          <div className="absolute inset-0">
            <JourneyCardImage
              src={journey.image}
              alt={journey.title || "Journey"}
            />
          </div>
        </div>

        <div
          className="relative z-10 col-start-1 row-start-1 col-end-2 row-end-2 justify-self-start self-start h-auto rounded-[10px] border-2 border-[#2f2d89] bg-white shadow-[0_6px_28px_rgba(0,0,0,0.22)] w-[260px] ml-[14px] mt-[14px] p-[14px] max-[900px]:w-[300px] max-[900px]:ml-[16px] max-[900px]:mt-[16px] max-[900px]:p-[16px] max-[1200px]:w-[300px] max-[1200px]:ml-[24px] max-[1200px]:mt-[20px] max-[1200px]:p-[18px] max-[1250px]:w-[320px] max-[1250px]:ml-[32px] max-[1250px]:mt-[24px] max-[1250px]:p-[18px] max-[1281px]:w-[350px] max-[1281px]:ml-[48px] max-[1281px]:mt-[32px] max-[1281px]:p-[20px] max-[1910px]:w-[390px] max-[1910px]:ml-[80px] max-[1910px]:mt-[42px] max-[1910px]:p-[22px] min-[1919px]:w-[414px] min-[1919px]:ml-[108px] min-[1919px]:mt-[50px] min-[1919px]:p-[25px]"
        >
          <h1 className="text-[15px] max-[900px]:text-[16px] max-[1250px]:text-[17px] max-[1910px]:text-[18px] min-[1919px]:text-[18px] font-bold leading-[1.3] text-ink">
            {journey.title}
          </h1>
          <p className="mt-[8px] text-[11px] max-[1250px]:text-[12px] max-[1910px]:text-[13px] min-[1919px]:text-[13px] leading-[1.5] text-[#444]">
           {trimByWords(journey.desc, 25)}
          </p>
          <div className="mt-[12px] flex items-center gap-[12px] xl:gap-[16px] text-[11px] xl:text-[12px] text-[#333]">
            <div className="flex items-center gap-[6px]">
              <Image src="/CalenderIcon.svg" alt="" width={14} height={14} className="shrink-0" />
              <span>{journey.days || "13 Days | 12 Nights"}</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <Image src="/Destination.svg" alt="" width={14} height={14} className="shrink-0" />
              <span>{journey.destinations || "10 Destinations"}</span>
            </div>
          </div>

          <div className="my-[14px] border-t border-[#EBEBEB]" />

          <div className="flex flex-col gap-[6px] text-[12px] xl:text-[13px]">
            <div>
              <span className="font-bold text-ink">Starts In: </span>
              <span className="text-[#444]">{journey.startCity || "Casablanca"}</span>
            </div>
            <div>
              <span className="font-bold text-ink">Ends In: </span>
              <span className="text-[#444]">{journey.endCity || "Marrakech"}</span>
            </div>
            <div>
              <span className="font-bold text-ink">Best Seasons: </span>
              <span className="text-[#444]">{journey.bestSeason || "Jan–March, July–Sep"}</span>
            </div>
            <div>
              <span className="font-bold text-ink">Pace: </span>
              <span className="text-[#444]">{journey.pace }</span>
            </div>
          </div>

          {/* Divider */}
         <div className="mt-[14px] flex items-start gap-[14px]">
  <div className="shrink-0">

    {/* From */}
    <p className="text-[11px] text-[#787878]">
      from
    </p>

    {/* Offer Price + per person */}
    <p className="flex items-baseline gap-0 text-[18px] max-[1250px]:text-[20px] max-[1910px]:text-[24px] min-[1919px]:text-[24px] font-bold leading-none text-[#1D1D1D]">
      <span>
        ${Number(journey.offerPrice).toLocaleString()}
        <span className="relative -top-[1px] text-[12px] align-top">*</span>
      </span>
      <span className="relative -top-[2px] text-[11px] font-normal text-[black]">/person</span>
    </p>

    {/* Original Price */}
    {journey.originalPrice && (
      <p className="mt-[4px] text-[13px] font-medium text-[#777]">
        was{" "}
        <span className="line-through">
          ${Number(journey.originalPrice).toLocaleString()}
        </span>
      </p>
    )}

    {/* Double occupancy */}
    <p className="mt-[2px] text-[11px] leading-[1.3] text-[#777]">
      double occupancy*
    </p>

  </div>

          {journey?.offer && (
  <span
    className="w-fit cursor-pointer rounded-[5px] px-[12px] py-[8px] text-[11px] font-semibold tracking-[0.02em]"
    style={{
      backgroundColor: "#F2E2DA",
      color: "#000000",
    }}
  >
    {journey.offer}
  </span>
)}
          </div>

          {isInspirational ? (
            <>
              <button
                onClick={() => setIsPrivateFormOpen(true)}
                className="mt-[16px] h-[44px] w-full rounded-full bg-[#2D3482] text-[14px] font-semibold text-white transition hover:bg-[#252b78]"
              >
                Request a Private Journey
              </button>

              <div className="mt-[12px] text-[12px] text-[#555]">
                Want to make this itinerary entirely your own?
                <br />
                <button
                  onClick={() => setIsCraftFormOpen(true)}
                  className="mt-[2px] font-bold text-ink underline underline-offset-[2px]"
                >
                  Tailor This Journey For You
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={onCheckAvailability}
                className="mt-[16px] h-[44px] w-full rounded-full bg-[#2D3482] text-[14px] font-semibold text-white transition hover:bg-[#252b78]"
              >
                Check Dates & Availability
              </button>

              <div className="mt-[12px] text-[12px] text-[#555]">
                Want to customize this itinerary?
                <br />
                <button
                  onClick={() => setIsPrivateFormOpen(true)}
                  className="mt-[2px] font-bold text-ink underline underline-offset-[2px]"
                >
                  Request a Private Journey
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>

     {/* ================= MOBILE DESIGN ================= */}
     <div className="block bg-[#F9F9F9] md:hidden">
        <div className="px-[27px] pt-[22px] pb-[18px] text-[12px] font-light leading-[20px] tracking-[0.05em] text-[#1A1A1A]">
          Home &gt; All Journeys &gt;
          <span> {journey.title}</span>
        </div>
          
       {activeView === "menu"&&<div className="relative">
          <div className="relative h-[640px] w-full">
            <JourneyCardImage
              src={journey.image}
              alt={journey.title}
            />
            <div className="absolute left-[27px] right-[27px] top-[20px] rounded-[5px] border-2 border-[#1A1A1A] bg-[#FAFAFA] px-[19px] py-[15px]">
              <h1 className="text-[18px] font-semibold leading-[24px] tracking-[0.05em] text-black">
                {journey.title}
              </h1>

              <p className="mt-[10px] text-[12px] font-light leading-[18px] tracking-[0.05em] text-black">
              {trimByWords(journey.desc, 25)}
              </p>

              <div className="mt-[14px] flex items-center gap-[16px] text-[12px] font-light leading-[18px] tracking-[0.05em] text-black">
                <div className="flex items-center gap-[8px]">
                  <Image src="/CalenderIcon.svg" alt="" width={16} height={16} className="shrink-0" />
                  <span>{journey.days || "13 Days | 12 Nights"}</span>
                </div>

                <div className="flex items-center gap-[8px]">
                  <Image src="/Destination.svg" alt="" width={16} height={16} className="shrink-0" />
                  <span>{journey.destinations || "10 Destinations"}</span>
                </div>
              </div>
              <div className="mt-[14px] space-y-[8px] text-[12px] font-light leading-[16px] tracking-[0.05em] text-black">
                <div>
                  <span className="font-semibold">Best Seasons:</span>{" "}
                  {journey.bestSeason || "Jan–March, July–Sep"}
                </div>

                <div>
                  <span className="font-semibold">Pace:</span>{" "}
                  {journey.pace || "Moderate"}
                </div>

                <div>
                  <span className="font-semibold">Group Size:</span> upto 18 guests
                </div>
              </div>
              <div className="mt-[18px] flex flex-wrap gap-[8px]">
                {categories?.map((category) => (
                  <span
                    key={category}
                    className="rounded-[2px] px-[12px] py-[8px] text-[12px] font-medium leading-[9px] tracking-[0.05em]"
                    style={{ backgroundColor: "#C2E5FF", color: "#000000" }}
                  >
                    {category}
                  </span>
                ))}

                {journey?.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[2px] px-[12px] py-[8px] text-[12px] font-medium leading-[9px] tracking-[0.05em]"
                    style={{ backgroundColor: "#EFF3CF", color: "#000000" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:mx-[27px] overflow-hidden rounded-[5px] border-2 border-[#1A1A1A] bg-[#FAFAFA]">
            <div className="flex border-b-2 border-[#1A1A1A]">
           <div className="flex-1 px-[14px] py-[12px]">

  {/* From */}
  <p className="text-[10px] font-light leading-[16px] tracking-[0.05em] text-[#1A1A1A]">
    from
  </p>

  {/* Offer Price */}
  <div className="flex items-end gap-[2px]">
    <span className="text-[24px] font-semibold leading-[28px] tracking-[0.05em] text-[#1A1A1A] md:text-[28px] md:leading-[32px]">
      ${Number(journey.offerPrice).toLocaleString()}
    </span>

    <span className="mb-[3px] text-[11px] font-normal leading-[14px] tracking-[0.05em] text-[#000000]">
      /person
    </span>
  </div>

  {/* Original Price */}
  {journey.originalPrice && (
    <p className="text-[12px] font-light leading-[16px] tracking-[0.05em] text-[#777]">
      was{" "}
      <span className="line-through">
        ${Number(journey.originalPrice).toLocaleString()}
      </span>
    </p>
  )}
</div>
{journey?.earlyBird && (
<div className="my-[8px] mr-[14px] w-[168px] shrink-0 self-start rounded-[2px] bg-[#F2E2DA] px-[10px] py-[8px] md:m-0 md:w-[52%] md:shrink md:self-auto md:rounded-none md:border-l-2 md:border-[#1A1A1A] md:px-[14px] md:py-[12px]">
  <div className="flex gap-[8px]">
    <Info size={16} strokeWidth={1.5} className="mt-[1px] shrink-0" />
    <p className="text-[8px] font-semi-bold leading-[16px] tracking-[0.05em] text-black">
      {journey.offer || "Early Bird Offers available"}
    </p>
  </div>
</div>
)}
            </div>
            {isInspirational ? (
              <>
                <div className="flex items-center justify-center gap-3 bg-[#FAFAFA] px-4 py-[12px]">
                  <button
                    onClick={() => setIsPrivateFormOpen(true)}
                    className="h-[37px] rounded-full bg-[#2C3078] px-6 text-[16px] font-semibold tracking-[0.05em] text-[#FAFAFA]"
                  >
                    Request a Private Journey
                  </button>
                </div>

                <div className="border-t-2 border-[#1A1A1A] bg-[#FAFAFA] px-4 py-[12px] text-center text-[12px] font-light leading-[18px] tracking-[0.05em] text-[#1A1A1A]">
                  Want to make this itinerary entirely your own?
                  <br />
                  <button
                    onClick={() => setIsCraftFormOpen(true)}
                    className="mt-1 font-bold text-ink underline underline-offset-2"
                  >
                    Tailor This Journey For You
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-nowrap items-center gap-[10px] whitespace-nowrap bg-[#FAFAFA] px-[27px] py-[9px]">
                <button
                  onClick={() => setActiveView("dates-pricing")}
                  className="h-[31px] w-[138px] shrink-0 rounded-[15.5px] bg-[#2C3078] text-[16px] font-semibold tracking-[0.05em] text-[#FAFAFA]"
                >
                  Check Dates
                </button>

                <span className="shrink-0 text-[12px] font-bold tracking-[0.05em] text-black">
                  OR
                </span>

                <button
                  onClick={() => setIsPrivateFormOpen(true)}
                  className="shrink-0 text-[12px] font-bold text-ink underline underline-offset-[3px]"
                >
                  Request a Private Journey
                </button>
              </div>
            )}
          </div>
        </div>}
      </div>
        <MobileNavigationMenu
  journey={journey}
  departures={departures}
  activeView={activeView}
  inclusions={inclusions}
  exclusions={exclusions}
  setActiveView={handleSetActiveView}
/>
      {/* Inspirational: same as before — the generic "Inspirational
          Itineraries" webform, no specific departure attached. Group: the
          standard private-journey webform, pre-filled with the soonest
          offer/upcoming departure computed above. */}
      <PrivateInquiryForm
        isOpen={isPrivateFormOpen}
        onClose={() => setIsPrivateFormOpen(false)}
        onSubmit={(data) => console.log("Private journey inquiry submitted:", data)}
        journey={journey}
        departure={isInspirational ? undefined : priorityDeparture}
        showDepartureDate={!isInspirational}
        label={isInspirational ? "Inspirational Itineraries Form" : undefined}
      />
      {/* "Tailor This Journey For You" (inspirational/tailor-made journeys
          only) opens the full "Craft Your Journey" build form instead,
          pre-selected to the journey currently being viewed — e.g. an
          Africa journey page pre-fills "Africa" as the Step 1
          destination rather than leaving it blank for the visitor to
          search for again. */}
      {isInspirational && (
        <BuildYourJourneyForm
          isOpen={isCraftFormOpen}
          onClose={() => setIsCraftFormOpen(false)}
          onSubmit={(data) => console.log("Journey inquiry submitted:", data)}
          prefillDestination={{
            id: journey?.nodeId,
            title: journey?.title,
            tagIds: journey?.tagIds,
          }}
        />
      )}
    </>
  );
}
