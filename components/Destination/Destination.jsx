"use client";
import React, { useEffect, useState } from "react";
import TravelJourneyCard from "../TravelJourneyCard";
import { getJourneyCards } from "@/lib/journeyCard";

export default function Destination() {
    
     const [journeys, setJourneys] = useState([]);
      const [selectedTrips, setSelectedTrips] = useState([]);
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
          id: trip.id,
          title: trip.title,
          image: trip.image,
          duration: trip.duration,
          destinations: trip.destinations,
          offer: trip.earlyBird,
          price: `$${Number(trip.price).toLocaleString()}`,
          viewTripUrl: trip.viewTripUrl,
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
            setJourneys(drupalJourneys);
          } catch (err) {
            console.error(err);
          }
        }
        loadJourneys();
      }, []);

  return (
  <section
    className="
  w-full overflow-hidden flex flex-col items-start md:items-center text-left
  mx-auto max-w-[1920px]
  px-4
  lg:px-[58px]
  xl:px-[73px]
  min-[1366px]:px-[78px]
  min-[1440px]:px-[82px]
  min-[1920px]:px-[140px]
"
  >
  <div className="flex flex-col items-start min-[500px]:items-center min-[500px]:mx-auto text-left min-[500px]:text-center">
    <h2 className="
  font-nohemi mt-5 font-semibold tracking-[0.05em] text-black
  w-full
  min-[500px]:mx-auto
  text-[32px] min-[500px]:text-[38px] md:text-[48px]
  leading-[40px] min-[500px]:leading-[46px] md:leading-[56px]
">
        Destinations TravelOStyle Knows Best
    </h2>

    <p className="
  font-nohemi font-normal text-[#000000] tracking-[0.05em]
  w-full
  max-w-[339px] min-[500px]:max-w-[600px] md:max-w-[1100px]
  min-[500px]:mx-auto
  mt-4
  text-[16px] min-[500px]:text-[17px] md:text-[18px]
  leading-[24px] min-[500px]:leading-[28px] md:leading-[32px]
">
      Choose from the locations that consistently deliver. These are places we know
      <br className="hidden md:block" />
      well enough to recommend without reservation, and that our travelers reliably come home
      <br className="hidden md:block" />
        grateful they chose!
    </p>
  </div>

 <div className="mt-12 w-full overflow-hidden">
  <TravelJourneyCard
    journeys={journeys.slice(0, 8)}
    selectedTrips={selectedTrips}
    onCompare={handleCompareSelection}
    mobileSlider
    mobileWidthClass="max-md:w-[262.53px] max-md:min-w-[262.53px]"
  />
</div>
</section>


  )
}