"use client";
import React from "react";
import TravelJourneyCard from "../TravelJourneyCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJourneyCards, filterByType } from "@/lib/journeyCard";

export default function NotSureWhereToBegin() {
   const router = useRouter();
   const [journeys, setJourneys] = useState([]);

    // "Explore All Curated Journeys" takes the visitor to the full itinerary
    // listing, pre-filtered to Tailormade journeys (the sidebar's "style"
    // filter reads this same sessionStorage key on mount).
    const goToAllJourneys = () => {
      sessionStorage.setItem(
        "journeyData",
        JSON.stringify({ style: ["Tailormade Journey"] })
      );
      router.push("/itinerary");
    };
  
    useEffect(() => {
      async function loadJourneys() {
        try {
          const drupalJourneys = await getJourneyCards();
          setJourneys(filterByType(drupalJourneys, "Tailormade Journey"));
        } catch (err) {
          console.error(err);
        }
      }

      loadJourneys();
    }, []);

  return (
    <div className="py-16 max-w-[1704px] mx-auto font-sans" style={{ paddingInline: "clamp(26px, 3.6vw, 69px)" }}>
      <div className="max-w-[800px] mx-auto mb-12 max-md:mb-4 text-left md:text-center">
        <p className="md:hidden mb-3 font-taprom text-[24px] font-normal leading-[28px] tracking-[0.05em] text-black [text-box-trim:cap] [text-box-edge:cap_alphabetic]">
          get inspired
        </p>
        <h2 className="mb-5 text-[32px] lg:text-[26px] xl:text-[32px] text-left md:text-center font-semibold leading-[40px] lg:leading-[34px] xl:leading-[40px] tracking-[0.05em] text-black [text-box-trim:cap] [text-box-edge:cap_alphabetic]">
          Not sure where to begin? Start here
        </h2>
        <p className="font-nohemi text-[#000000] text-left md:text-center text-[16px] sm:text-base leading-[28px] md:leading-relaxed tracking-[0.05em] md:tracking-normal max-w-[335px] md:max-w-[720px] md:mx-auto font-normal">
          Explore our collection of inspirational itineraries – journey ideas
          across regions and travel styles that work as a starting point. Think
          of them as conversation starters. We’ll take it from there.
        </p>
      </div>

      <div className="max-md:mx-[calc(-1*clamp(26px,3.6vw,69px))]">
        <TravelJourneyCard journeys={journeys}
          mobileSlider
          columns="4-stepped"
          mobileWidthClass="w-[293px] min-w-[293px]"
          sliderPadClass="pl-4 pr-4 scroll-pl-4 md:pl-0 md:pr-0"
        />
      </div>
      <div className="md:flex justify-center md:mt-10">
        <button
          onClick={goToAllJourneys}
          // Figma: 600 18/32 5%, #FAFAFA, radius 100, 37px tall, hugging the
          // label -- 306 wide with 16px sides on mobile (flush with the copy
          // above), 322 with 24px sides on desktop. Font family is inherited
          // like the site's other buttons, not Figma's Nohemi. Figma trims the line
          // box to cap height, so the 37px is a fixed height with the label
          // centred rather than 12px + 32px line + 12px. Below ~390 the label
          // scales down (4.62vw = 18px at 390) so it never outgrows a 320
          // screen.
          className="inline-flex h-[37px] items-center justify-center whitespace-nowrap rounded-[100px] bg-[#1C355E] px-4 text-[min(18px,4.62vw)] font-semibold leading-[32px] tracking-[0.05em] text-[#FAFAFA] transition-all duration-200 hover:bg-[#12233F] md:px-6 md:text-[18px]"
        >
          Explore All Curated Journeys
        </button>
      </div>
    </div>
  );
}
