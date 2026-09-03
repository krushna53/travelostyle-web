"use client";
import React from "react";
import TravelJourneyCard from "../TravelJourneyCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJourneyCards, filterByType } from "@/lib/journeyCard";

export default function NotSureWhereToBegin() {
   const router = useRouter();
   const [journeys, setJourneys] = useState([]);
    const [selectedTrips, setSelectedTrips] = useState([]);

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
      const compareTrips = JSON.parse(
        localStorage.getItem("compareTrips") || "[]",
      );
  
      setSelectedTrips(compareTrips.map((trip) => trip.id));
    }, []);
    const handleCompareSelection = (trip) => {
      const existingTrips = JSON.parse(
        localStorage.getItem("compareTrips") || "[]",
      );
  
      const alreadyExists = existingTrips.some((item) => item.id === trip.id);
  
      if (alreadyExists) {
        return;
      }
  
      const compareTrip = {
        viewTripUrl: trip.viewTripUrl,
        id: trip.id,
        title: trip.title,
        image: trip.image,
        duration: trip.duration,
        destinations: trip.destinations,
        offer: trip.earlyBird,
        price: `$${Number(trip.price).toLocaleString()}`,
        itinerary: [],
        stays: "-",
        region: trip.region,
        travelMode: "-",
      };
  
      localStorage.setItem(
        "compareTrips",
        JSON.stringify([...existingTrips, compareTrip]),
      );
  
      setSelectedTrips((prev) => [...prev, trip.id]);
  
      localStorage.setItem(
        "compareSourcePage",
        window.location.pathname + window.location.search,
      );
  
      sessionStorage.setItem(
        "comparisonReturnPage",
        window.location.pathname + window.location.search,
      );
  
      window.location.href = "/comparison";
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
    <div className="min-h-screen py-16 max-w-[1704px] mx-auto font-sans" style={{ paddingInline: "clamp(16px, 3.6vw, 69px)" }}>
      <div className="max-w-[800px] mx-auto mb-12 text-left md:text-center">
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

      <TravelJourneyCard journeys={journeys}
       selectedTrips={selectedTrips}
        onCompare={handleCompareSelection}
        mobileSlider
        mobileWidthClass="max-md:w-[262.53px] max-md:min-w-[262.53px]"
      />
      <div className="md:flex justify-center ml-3.5 md:ml-auto md:mt-10">
        <button
          onClick={goToAllJourneys}
          className="bg-[#1C355E] hover:bg-[#12233F] text-white text-xs font-semibold px-4 md:px-6 py-2.5 rounded-full shadow-sm transition-all duration-200"
        >
          Explore All Curated Journeys
        </button>
      </div>
    </div>
  );
}
