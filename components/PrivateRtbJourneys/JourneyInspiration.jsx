"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TravelJourneyCard from "../TravelJourneyCard";
import { getJourneyCards, filterByType } from "@/lib/journeyCard";



export default function JourneyInspiration() {
  const router = useRouter();
  const [journeys, setJourneys] = useState([]);
  const [selectedTrips, setSelectedTrips] = useState([]);

  // "Explore All Private Journeys" takes the visitor to the full itinerary
  // listing, pre-filtered to both Group and Private journeys (the sidebar's
  // "style" filter reads this same sessionStorage key on mount).
  const goToAllJourneys = () => {
    sessionStorage.setItem(
      "journeyData",
      JSON.stringify({ style: ["Group Journey", "Private Journey"] })
    );
    router.push("/itinerary");
  };
  useEffect(() => {
  const compareTrips = JSON.parse(
    localStorage.getItem("compareTrips") || "[]"
  );


  setSelectedTrips(compareTrips.map((trip) => trip.id));
}, []);
const handleCompareSelection = (trip) => {
  const existingTrips = JSON.parse(
    localStorage.getItem("compareTrips") || "[]"
  );

  const alreadyExists = existingTrips.some(
    (item) => item.id === trip.id
  );

  if (alreadyExists) return;

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
    JSON.stringify([...existingTrips, compareTrip])
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
        setJourneys(filterByType(drupalJourneys, "Private Journey"));
      } catch (err) {
        console.error(err);
      }
    }

    loadJourneys();
  }, []);

  return (
    <div className=" min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-12">
        <p
          className="md:hidden font-taprom text-[32px] font-normal leading-[40px] tracking-[0.05em] text-black lowercase [text-box-trim:cap] [text-box-edge:cap_alphabetic]"
        >
          get inspired
        </p>
        <p
          className="hidden md:block font-taprom text-[32px] font-normal leading-[40px] tracking-[0.05em] text-black [text-box-trim:cap] [text-box-edge:cap_alphabetic] md:text-center"
        >
          Inspire from our curated itineraries
        </p>
        <h2 className="mt-1 font-[Nohemi] text-[32px] font-semibold leading-[40px] tracking-[0.05em] text-black [text-box-trim:cap] [text-box-edge:cap_alphabetic] md:text-center">
          Find a journey you love!
        </h2>
      </div>

{/* <div className="grid grid-cols-4 gap-6"> */}
 <TravelJourneyCard
  journeys={journeys}
  selectedTrips={selectedTrips}
  onCompare={handleCompareSelection}
  mobileSlider
  mobileWidthClass="max-md:w-[262.53px] max-md:min-w-[262.53px]"
/>
{/* </div>    */}
  <div className="flex justify-left md:justify-center md:mt-8">
        <button
          onClick={goToAllJourneys}
          className="bg-[#1C355E] hover:bg-[#12233F] text-white text-xs font-semibold  px-6 py-2 p-6 ml-7 rounded-full shadow transition-all duration-200"
        >
        Discover All Private Journeys
        </button>
      </div>
    </div>
  );
}
