"use client";
import React, { useEffect, useState } from "react";
import TravelJourneyCard from "../TravelJourneyCard";

// `initialJourneys` is fetched server-side (see app/destination/page.jsx)
// and handed down as a prop — this used to fetch it itself in a useEffect,
// which ran in the browser and always failed against the ddev backend's
// self-signed cert (ERR_CERT_AUTHORITY_INVALID). The server's fetch honors
// NODE_TLS_REJECT_UNAUTHORIZED, so doing it there works.
export default function Destination({ initialJourneys = [] }) {

     const [journeys] = useState(initialJourneys);
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

  return (
  <section className="w-full overflow-hidden flex flex-col items-start md:items-center text-left px-4">
  <div className="flex flex-col items-start md:items-center text-left md:text-center">
    <h2 className="font-nohemi mt-5 text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] font-semibold tracking-[0.05em] text-black">
        Destinations TravelOStyle Knows Best
    </h2>

    <p className="font-nohemi font-normal w-full max-w-[339px] md:max-w-[1100px] text-[16px] mt-4 leading-[24px] md:text-[18px] md:leading-[32px] tracking-[0.05em] text-[#000000]">
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
    columns={4}
  />
</div>
</section>


  )
}