"use client";

import Image from "@/components/SafeImage";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, CirclePlus, Info } from "lucide-react";
import JourneyCardImage from "@/components/JourneyCardImage";
import BookingModal from "@/components/BookingModal";
import {
  COMPARE_CHANGED_EVENT,
  addTripToCompare,
  isTripInCompare,
} from "@/lib/compareCart";

const TAG_COLORS = {
  "group journey": "bg-[#E1EEDB] text-[#1A1A1A]",
  "private journey": "bg-[#FFDDBD] text-[#1A1A1A]",
  "tailormade journey": "bg-[#FFDDBD] text-[#1A1A1A]",
};
const DEFAULT_TAG_COLOR = "bg-[#EAEBCB] text-[#1A1A1A]";

function getTagColor(tag) {
  return TAG_COLORS[tag?.toLowerCase().trim()] || DEFAULT_TAG_COLOR;
}

// Shared card shell — plain white card with rounded corners and a soft
// drop shadow. The scalloped bottom edge comes from the shared
// .card-scallop-bottom class (card-bg.png), not from a card-shaped SVG.
const CARD_BASE =
  "card-scallop-bottom relative isolate flex shrink-0 flex-col rounded-[16px]  px-[14px] pt-3 pb-4 max-md:snap-center md:h-[640px] md:pt-4 md:pb-11";

// Single journey card used across the site (home carousel, journey-type
// listing grids, "other destinations" rail). `variant` only changes the
// outer sizing/background so it drops into either a horizontal scroller
// or a CSS grid — the content markup is identical everywhere so a fix here
// fixes it everywhere.
export default function JourneyCard({ trip, variant = "carousel", onCompare, mobileWidthClass }) {
  const [isSelected, setIsSelected] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const isBookingOpen = trip.isBookingOpen === true;
  const showFrom = trip.experienceType?.toLowerCase().includes("inspir");

  const handleBookNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isBookingOpen) return;
    setShowBooking(true);
  };

  // BookingModal expects { title, image, destinationsList, location, date,
  // duration, price } — destinationsList/location fall back to this card's
  // region (no per-city list at the card level), and date to the nearest
  // departure's start date when one was fetched for this journey.
  const bookingJourney = {
    title: trip.title,
    image: trip.image,
    destinationsList: trip.region,
    location: trip.region,
    date: trip.nearestDeparture?.startDate || "",
    duration: trip.days,
    price: trip.price,
  };
  // Kept in sync with the cart so removing a trip in the compare modal
  // flips this card back to "Add to Compare".
  useEffect(() => {
    const sync = () => setIsSelected(isTripInCompare(trip.id));
    sync();
    window.addEventListener(COMPARE_CHANGED_EVENT, sync);
    return () => window.removeEventListener(COMPARE_CHANGED_EVENT, sync);
  }, [trip.id]);

  const handleAddToCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (onCompare) {
        onCompare(trip);
      } else {
        addTripToCompare(trip);
      }
    } catch (error) {
      console.error("Failed to add trip to comparison:", error);
    }
  };

  return (
    <div
      style={isBookingOpen ? { paddingTop: "44px" } : undefined}
      className={`${CARD_BASE} ${
        mobileWidthClass || "w-[293px] min-w-[293px]"
      } ${
        variant === "carousel"
          ? "md:w-[390px] md:min-w-[390px] md:px-8"
          : variant === "fill"
            ? // Stretches so the visible card face fills its grid cell, making the
              // row run edge to edge with the rule above it (listing page).
              // Union.png is 420 wide with a 15px shadow either side of a 390
              // face, so the box overhangs the cell by 15/390 = 3.846% a side
              // (percentages resolve against the cell) and pads that back in.
              "mx-auto md:mx-0 md:-ml-[3.846%] md:w-[107.69%] md:min-w-0 md:max-w-none md:px-[calc(3.846%+14px)]"
            : "mx-auto md:mx-0 md:w-full md:min-w-0 md:max-w-[390px] md:px-6 min-[1920px]:w-[390px] min-[1920px]:min-w-[390px] min-[1920px]:shrink-0 min-[1920px]:px-5"
      }`}
    >
      {isBookingOpen && (
        <div className="absolute inset-x-0 top-0 flex h-8 items-center justify-center rounded-t-[16px] border border-[#2F2E8B] bg-[#F1F3CE] text-[12px] font-medium tracking-[0.05em] text-[#2F2E8B] md:text-[14px]">
          Bookings Open
        </div>
      )}
      <div className="mb-2 flex min-h-[16px] flex-wrap gap-2 md:mb-3 md:min-h-[28px] md:gap-2">
        {trip.tags?.map((tag) => (
          <span
            key={tag}
            className={`rounded-[2px] px-2 text-[10px] leading-[16px] tracking-[0.05em] font-normal md:rounded-[5px] md:px-3 md:py-1 md:text-[14px] md:font-medium ${getTagColor(tag)}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={trip.viewTripUrl}
        onClick={(e) => e.stopPropagation()}
        className="relative block h-[128px] w-full shrink-0 overflow-hidden md:h-[213px] md:w-full"
      >
        <JourneyCardImage src={trip.image} alt={trip.title} />
      </a>

      <div className="flex flex-1 flex-col pt-2 text-left md:pt-4 justify-between">
        <h3 className="line-clamp-2 h-[48px] text-[16px] font-semibold leading-[24px] tracking-[0.05em] text-ink md:h-auto md:min-h-[2.6em] md:text-[21px] md:leading-[1.3] md:tracking-normal md:text-[#232323]">
          <a href={trip.viewTripUrl} onClick={(e) => e.stopPropagation()}>
            {trip.title}
          </a>
        </h3>

        <p className="mt-2 line-clamp-3 h-[48px] text-[10px] font-light leading-[16px] tracking-[0.05em] text-ink md:mt-2 md:line-clamp-2 md:h-auto md:min-h-[3.1em] md:text-[14px] md:font-normal md:leading-[1.55] md:tracking-normal md:text-[#666666]">
          {trip.desc}
        </p>
        <div className="mt-1 flex h-[44px] flex-col gap-2 text-[10px] leading-[16px] tracking-[0.05em] text-ink md:mt-3 md:h-auto md:flex-row md:items-center md:gap-4 md:text-[14px] md:tracking-normal md:text-[#717171]">
          <div className="flex items-center gap-2 md:gap-1">
            {/* <CalendarDays size={16} strokeWidth={1.8} className="md:size-3" /> */}
            <Image
              src="/Calender.svg"
              alt="Calendar"
              height={16}
              width={16}
              className="w-[16px] h-[16px] md:w-[12px] md:h-[12px]"
            />
            {trip.days}
          </div>

          <div className="flex items-center gap-2 md:gap-1">
            {/* <MapPinned size={16} strokeWidth={1.8} className="md:size-3" /> */}
            <Image
              src="/Destination.svg"
              alt="Destination"
              height={16}
              width={16}
              className="w-[16px] h-[16px] md:w-[12px] md:h-[12px]"
            />
            {trip.destinations}
          </div>
        </div>

        <div className="flex-0" />

        <div className="mt-3 md:mt-4 flex items-end justify-between">
          <div className="flex flex-col items-start md:flex-row md:items-end md:gap-1">
           {showFrom && (
 <span className="text-[10px] leading-[21px] tracking-[0.05em] text-ink md:hidden">
  from
 </span>
 )}

            {/* Mobile (per Figma): "$3000*" and "/person" share a baseline,
                with "double occupancy*" wrapping onto the line below. Desktop
                keeps the original stacked-label + two-line-note arrangement. */}
            <div className="flex items-baseline gap-0 md:hidden">
             <h4 className="text-[16px] font-medium leading-[21px] tracking-[0.05em] text-ink">
    ${Number(trip.price).toLocaleString()}
    <span className="relative -top-[3px] text-[10px] align-top">*</span>
  </h4>

  <span className="relative -top-[3px] text-[10px] leading-[14px] tracking-[0.05em] text-ink">
    /person
  </span>

            </div>
            <span className="text-[10px] leading-[14px] tracking-[0.05em] text-ink md:hidden">
              double occupancy*
            </span>

            <div className="hidden md:flex md:flex-col">
             {showFrom && (
 <span className="md:text-[9px] md:leading-[1.15] md:text-[#7B7B7B]">
  from
 </span>
 )}
              <div className="md:flex md:items-baseline md:gap-0">
                <h4 className="md:text-[20px] md:font-semibold md:leading-none md:text-[#1D1D1D]">
                  ${Number(trip.price).toLocaleString()}
                  <span className="md:relative md:-top-[0px] md:text-[12px] md:align-top">*</span>
                </h4>
                <span className="md:relative md:-top-[8px] text-[10px] md:leading-[1.90] md:text-black">
                  /person
                </span>
              </div>
              {trip.originalPrice > trip.price && (
                <span className="md:mt-[2px] md:text-[11px] md:leading-none md:text-[#7B7B7B]">
                  was{" "}
                  <span className="line-through">
                    ${Number(trip.originalPrice).toLocaleString()}
                  </span>
                </span>
              )}
              <span className="md:text-[9px] md:leading-[1.15] md:text-[#7B7B7B]">
                double occupancy*
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={trip.viewTripUrl}
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 shrink-0 items-center justify-center rounded-full bg-[#2C3078] px-6 text-[16px] font-semibold tracking-[0.05em] text-[#FAFAFA] w-auto md:h-[29px] md:w-[93px] md:px-0 md:text-[11px] md:tracking-normal md:bg-[#2D3482]"
            >
              {trip.viewTripText || "View Trip"}
            </a>

            {/* "Is booking open" (field_is_booking_open) lets an editor
                remove this per journey — sold out, dates not published
                yet, etc. */}
            {isBookingOpen && (
              <button
                type="button"
                onClick={handleBookNow}
                className="flex h-8 shrink-0 items-center justify-center rounded-full border border-[#2C3078] px-6 text-[16px] font-semibold tracking-[0.05em] text-[#2C3078] w-auto md:h-[29px] md:w-[93px] md:px-0 md:text-[11px] md:tracking-normal"
              >
                Book Now
              </button>
            )}
          </div>
        </div>

        {showBooking &&
          createPortal(
            // This card's root wrapper has `isolate` (own stacking context,
            // for the scalloped-edge decoration), so nesting the modal here
            // would trap its z-50 inside that context — another card
            // elsewhere on the page could still render on top and steal
            // its clicks. Portal straight to <body> to escape that.
            <BookingModal journey={bookingJourney} onClose={() => setShowBooking(false)} />,
            document.body
          )}

        <div className="mt-2 md:mt-4 md:min-h-8">
          {trip.offer && (
            <div className="flex items-center gap-2 rounded-md bg-[#F4E5DA] px-3 py-2 text-xs text-[#65574D] md:gap-1.5 md:rounded-[5px] md:px-2.5 md:py-2 md:text-[8px] md:my-2">
              <Info size={11} className="shrink-0" />
              <span className="line-clamp-1">{trip.offer}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCompare}
          className="mt-3 mb-6 md:mt-4 md:mb-5 flex cursor-pointer items-center gap-2 text-[14px] leading-[18px] tracking-[0.05em] text-ink md:gap-1.5 md:text-[11px] md:tracking-normal md:text-[#4E4E4E]"
        >
          {isSelected ? (
            <>
              <CheckCircle2 size={24} strokeWidth={1} className="text-green-600 md:size-3.5 md:stroke-[2]" />
              <span>Added to Compare</span>
            </>
          ) : (
            <>
              <CirclePlus size={24} strokeWidth={1} className="md:size-3.5 md:stroke-[1.8]" />
              <span>Add to Compare</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
