"use client";
import React from "react";
import TravelJourneyCard from "../TravelJourneyCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJourneyCards, filterByType } from "@/lib/journeyCard";

export default function ChoosePopularGroupJourney() {
  const router = useRouter();
  const [journeys, setJourneys] = useState([]);

  // "Discover All Group Journeys" takes the visitor to the full itinerary
  // listing, pre-filtered to Group journeys (the sidebar's "style" filter
  // reads this same sessionStorage key on mount).
  const goToAllJourneys = () => {
    sessionStorage.setItem(
      "journeyData",
      JSON.stringify({ style: ["Group Journey"] })
    );
    router.push("/itinerary");
  };

  useEffect(() => {
    async function loadJourneys() {
      try {
        const drupalJourneys = await getJourneyCards();
        setJourneys(filterByType(drupalJourneys, "Group Journey"));
      } catch (err) {
        console.error(err);
      }
    }

    loadJourneys();
  }, []);
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden mb-3">
      <div className="mb-12 max-md:mb-4">
        <p
          className="hidden md:block font-taprom font-normal leading-[40px] tracking-[0.05em] text-black lowercase [text-box-trim:cap] [text-box-edge:cap_alphabetic] md:text-center responsive-text-size-[28px]"
        >
          Choose from our popular group journeys
        </p>
        <p
          className="block md:hidden whitespace-nowrap font-taprom text-[28px] font-normal leading-[40px] tracking-[0.05em] text-[#000000] lowercase [text-box-trim:cap] [text-box-edge:cap_alphabetic]"
        >
          our popular group journeys
        </p>
        <h2 className="mt-1 max-w-[337px] md:max-w-none font-nohemi font-semibold leading-[40px] tracking-[0.05em] text-[#000000] [text-box-trim:cap] [text-box-edge:cap_alphabetic] md:text-center responsive-text-size-[28px]">
          Where are you headed to next?
        </h2>
      </div>

      {/* Same mobile rail as tailor-made: bleeds through the section's 16px
          padding to the window edge, first card 16 in, 293 wide — same as the homepage. */}
      <div className="max-md:-mx-4">
        <TravelJourneyCard
          journeys={journeys}
          mobileSlider
          columns="4-stepped"
          mobileWidthClass="w-[293px] min-w-[293px]"
          sliderPadClass="pl-4 pr-4 scroll-pl-4 md:pl-0 md:pr-0"
        />
      </div>
      <div className="flex justify-center">
        <button
          onClick={goToAllJourneys}
          className="bg-[#1C355E] hover:bg-[#12233F] text-white text-xs font-semibold px-6 py-2 rounded-full shadow transition-all duration-200"
        >
          Discover All Group Journeys
        </button>
      </div>
    </div>
  );
}
