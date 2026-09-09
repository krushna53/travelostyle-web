"use client";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PrivateInquiryForm from "@/components/PrivateInquiryForm";
import GroupInquiryForm from "@/components/GroupInquiryForm";
import GeneralInquiryForm from "../GeneralInquiryForm";


export default function JourneyPricing({
    journey,
    departures = [],
     journeyId,
    // Mobile tab view passes this so the back button sits inline with the
    // "Book Your Journey" title, matching the other mobile tab headers.
    onBack,
}) {
      console.log("DATE PRICING JOURNEY ID:", journeyId);

    const [expandedCard, setExpandedCard] = useState(null);
    const [privateFormDeparture, setPrivateFormDeparture] = useState(null);
    const [groupFormTrip, setGroupFormTrip] = useState(null);
    const [isOpenGeneralInquiryForm, setIsOpenGeneralInquiryForm] = useState(false);
    const router = useRouter();

    const openPrivateForm = (trip) =>
        setPrivateFormDeparture({
            id: trip.id,
            nodeId: trip.nodeId,
            title: trip.title,
            startDate: trip.startDate,
            endDate: trip.endDate,
            // So JourneySummaryCard shows this specific departure's price
            // (incl. any offer) instead of falling back to the journey's
            // generic "from" price.
            originalPrice: trip.originalPrice,
            offerPercentage: trip.offerPercentage,
            discountedPrice: trip.discountedPrice,
        });
    const openGroupForm = (trip) => setGroupFormTrip(trip);

    const toggleCard = (index) => {
        setExpandedCard(expandedCard === index ? null : index);
    };
    const [selectedYear, setSelectedYear] = useState("2026");

   const trips = departures.map((item) => {

    // Original Price comes from Drupal field_original_price
    const originalPrice = Number(
        item.attributes?.field_original_price || 0
    );

    // Offer comes from Drupal field_offer
    const offerPercentage = Number(
        item.attributes?.field_offer || 0
    );

    // Early Bird is a separate flag on the departure (field_early_bird) —
    // only relevant when an offer/discount is also present on this trip.
    const isEarlyBird = Boolean(item.attributes?.field_early_bird);

    const discountedPrice =
        offerPercentage > 0
            ? originalPrice * (1 - offerPercentage / 100)
            : originalPrice;

    const hasEarlyBirdOffer = isEarlyBird && offerPercentage > 0;
    const isSoldOut = item.attributes?.field_status === "soldout";

    return {
        id: item.id,
        // Node ID (not the JSON:API UUID) — needed for the Drupal
        // webform_rest submission in PrivateInquiryForm.
        nodeId: item.attributes?.drupal_internal__nid ?? null,
        // Node title — paired with nodeId to build the "Label (id)"
        // value the webform's journey_departure entity-autocomplete
        // field expects.
        title: item.attributes?.title || "",

        startDate: item.attributes?.field_departure_date,
        endDate: item.attributes?.field_return_date,

        statusType: item.attributes?.field_status,

        originalPrice,
        offerPercentage,
        discountedPrice,
        isEarlyBird,
        hasEarlyBirdOffer,

        button: isSoldOut
            ? "Request a Private Journey"
            : hasEarlyBirdOffer
                ? "Claim Early Bird Call"
                : "Enquire For This Date",
    };
});
    const filteredTrips = trips.filter((trip) => {
        const year = new Date(trip.startDate)
            .getFullYear()
            .toString();

        return year === selectedYear;
    });
    if (filteredTrips.length === 0) {
  return (
    <section className="w-full px-4 py-10">
      {onBack && (
        <div className="mb-6 flex items-center gap-4 md:hidden">
          <button
            onClick={onBack}
            className="shrink-0 transition active:scale-95"
          >
            <Image src="/LeftArrow.svg" alt="Back" width={56} height={24} />
          </button>

          <h1 className="text-[20px] font-bold leading-[28px] tracking-tight text-ink">
            Book Your Journey
          </h1>
        </div>
      )}

      <h2
        className={`text-center text-[32px] font-semibold ${
          onBack ? "hidden md:block" : ""
        }`}
      >
        Book Your Journey
      </h2>

      <div className="flex justify-center mt-4">
        <div className="flex border-2 border-black rounded-[5px] overflow-hidden">
          {["2026", "2027"].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-2 ${
                selectedYear === year
                  ? "bg-[#F2E2DA] font-bold text-[#222222]"
                  : "bg-white"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <p className="text-[#757575]">
          No departures currently available for {selectedYear}
        </p>
      </div>
    </section>
  );
}
    console.log("Departures:", departures);
    console.log("Trips:", trips);
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    const getDay = (date) =>
        new Date(date).toLocaleDateString("en-GB", {
            weekday: "long",
        });
       const formatPrice = (price) =>
    `$${Math.round(Number(price))}`;

    return (
        <section className="w-full max-w-full py-6 overflow-x-hidden">
            <div className="mb-8 px-4 md:px-[20px] md:max-[901px]:px-[20px] md:max-[1200px]:px-[26px] md:max-[1250px]:px-[32px] md:max-[1281px]:px-[38px] md:max-[1910px]:px-[48px] md:min-[1911px]:px-[64px]">
                {onBack && (
                    <div className="mb-6 flex items-center gap-4 md:hidden">
                        <button
                            onClick={onBack}
                            className="shrink-0 transition active:scale-95"
                        >
                            <Image src="/LeftArrow.svg" alt="Back" width={56} height={24} />
                        </button>

                        <h1 className="text-[20px] font-bold leading-[28px] tracking-tight text-ink">
                            Book Your Journey
                        </h1>
                    </div>
                )}

                <h2
                    className={`
          text-center
          font-semibold
          text-[28px] md:text-[32px]
          leading-[36px] md:leading-[56px]
          tracking-[0.05em]
          text-ink
          ${onBack ? "hidden md:block" : ""}
        `}
                >
                    Book Your Journey
                </h2>

                <div className="flex justify-center">
                    <div
                        className="flex w-[110px] h-[34px] md:w-[160px] md:h-[40px] border-2 border-black rounded-[5px] overflow-hidden"
                    >
                        {["2026", "2027"].map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`flex-1 flex items-center justify-center transition-colors duration-200
              ${selectedYear === year
                                        ? "bg-[#F2E2DA] text-[#222222] font-bold"
                                        : "bg-white text-[#666666]"
                                    }`}
                                style={{
                                    fontSize: "14px",
                                    lineHeight: "13px",
                                }}
                            >
                                {year}
                            </button>
                        ))}
                    </div>

                </div>
            </div>
            <div className="md:hidden w-full space-y-4 px-4">
                {filteredTrips.map((trip, index) => {
                    const isExpanded = expandedCard === index;

                    return (
                        <div
                            key={index}
                            className="border-2 border-black rounded-[4px] bg-white overflow-hidden"
                        >
                            {/* Top Section - Always Visible */}
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                      <p className="text-[12px]">
    <span className="font-semibold">Trip Start:</span>{" "}
    {formatDate(trip.startDate)}
</p>

<p className="text-[12px] mt-1">
    <span className="font-semibold">Trip End:</span>{" "}
    {formatDate(trip.endDate)}
</p>

                                        <div className="mt-2">
                                            {trip.statusType === "soldout" ? (
                                                <span className="text-red-600 text-[11px] font-semibold">
                                                    Journey Sold Out
                                                </span>
                                            ) : (
                                                <span className="text-[#128914] text-[11px] font-semibold">
                                                    Seats Available
                                                </span>
                                            )}

                                        </div>
                                    </div>

                                    <div className="text-right">
                                      <p className="text-[10px] text-[#757575] text-left">
    from
</p>

 <div className="flex items-baseline justify-end">
    <span className="text-[22px] font-bold">
      {formatPrice(trip.discountedPrice)}
    </span>

    <span className="mr-[5px] text-[10px] text-[#757575]">
      /person
    </span>
  </div>


 {trip.offerPercentage > 0 && (
    <div className="text-[10px] text-[#9CA3AF] text-left">
      was{" "}
      <span className="line-through">
        {formatPrice(trip.originalPrice)}
      </span>
    </div>
)}

                            </div>
                                </div>
                            </div>

                            {/* Hidden Section */}
                            {isExpanded && (
                                <div className="border-t border-neutral-300 p-4">
                                    <div className="text-center mb-4">
                                        {trip.offerPercentage > 0 ? (
                                            <>
                                                <p className="text-[#128914] font-semibold">
                                                    {trip.offerPercentage}% off
                                                </p>
                                                {trip.isEarlyBird && (
                                                    <p className="mt-1 text-xs text-black">
                                                        Early Bird Offer applied to price
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-[#757575]">
                                                No offers available
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() =>
                                            trip.statusType === "soldout"
                                                ? openPrivateForm(trip)
                                                : openGroupForm(trip)
                                        }
                                        className="mx-auto block px-5 bg-[#2C3078] text-white rounded-full px-5 py-2 text-[12px] font-medium"
                                    >
                                        {trip.button}
                                    </button>
                                </div>
                            )}

                            {/* Show More / Less */}
                            <button
                                onClick={() => toggleCard(index)}
                                className="w-full border-t-2 border-neutral-800 py-3 text-xs font-semibold flex justify-center items-center gap-2"
                            >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F3EBE6] text-sm font-bold leading-none text-neutral-700 select-none">
                                    <span className="relative -top-px">{isExpanded ? "−" : "+"}</span>
                                </span>
                                {isExpanded ? "Show less" : "Show more"}
                            </button>
                        </div>
                    );
                })}

                <div className="mt-2 flex flex-col items-start">
                    <p
                        className="text-ink"
                        style={{
                            width: "263px",
                            height: "13px",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "13px",
                        }}
                    >
                        Not sure which date works?
                    </p>

                    <button
                        className="underline text-ink mt-[12px]"
                        style={{
                            width: "185px",
                            height: "13px",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "13px",
                            textAlign: "left",
                        }}
                        onClick={()=> setIsOpenGeneralInquiryForm(true)}
                    >
                        Speak to an advisor
                    </button>
                </div>
            </div>
            <div className="hidden md:block px-[20px] max-[901px]:px-[20px] max-[1200px]:px-[26px] max-[1250px]:px-[32px] max-[1281px]:px-[38px] max-[1910px]:px-[48px] min-[1911px]:px-[64px]">

                <div className="w-full">
                    <div className="w-full border-2 border-black rounded-[10px] overflow-hidden">
                        <table
                            className="
    w-full
    table-fixed
    border-separate
    border-spacing-0
    bg-white
  "
                        >
                            <thead>

                                <tr className="h-[48px] max-[901px]:h-[48px] max-[1200px]:h-[52px] max-[1250px]:h-[56px] max-[1281px]:h-[58px] max-[1910px]:h-[60px] min-[1911px]:h-[64px] bg-[#F2E2DA] border-b-2 border-black">
                                    <th className="w-[24%] border-r-2 border-b-2 border-black text-center font-semibold text-[11px] max-[901px]:text-[11px] max-[1200px]:text-[12px] max-[1250px]:text-[13px] max-[1281px]:text-[14px] max-[1910px]:text-[15px] min-[1911px]:text-[16px]">
                                        Trip Dates
                                    </th>

                                    <th className="w-[16%] border-r-2 border-b-2 border-black text-center font-semibold text-[11px] max-[901px]:text-[11px] max-[1200px]:text-[12px] max-[1250px]:text-[13px] max-[1281px]:text-[14px] max-[1910px]:text-[15px] min-[1911px]:text-[16px]">
                                        Status
                                    </th>

                                    <th className="w-[20%] border-r-2 border-b-2 border-black text-center font-semibold text-[11px] max-[901px]:text-[11px] max-[1200px]:text-[12px] max-[1250px]:text-[13px] max-[1281px]:text-[14px] max-[1910px]:text-[15px] min-[1911px]:text-[16px]">
                                        Pricing
                                    </th>

                                    <th className="w-[22%] border-r-2 border-b-2 border-black text-center font-semibold text-[11px] max-[901px]:text-[11px] max-[1200px]:text-[12px] max-[1250px]:text-[13px] max-[1281px]:text-[14px] max-[1910px]:text-[15px] min-[1911px]:text-[16px]">
                                        Offers Available
                                    </th>

                                    <th className="w-[18%] border-r-2 border-b-2 border-black text-center font-semibold text-[11px] max-[901px]:text-[11px] max-[1200px]:text-[12px] max-[1250px]:text-[13px] max-[1281px]:text-[14px] max-[1910px]:text-[15px] min-[1911px]:text-[16px]">
                                        Book Your Trip
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrips.map((trip, index) => (
                                    <tr key={index} className="h-[84px] max-[901px]:h-[84px] max-[1200px]:h-[90px] max-[1250px]:h-[96px] max-[1281px]:h-[100px] max-[1910px]:h-[104px] min-[1911px]:h-[110px] border-b-2 border-black">
                                        <td className="border px-3 py-4 max-[1200px]:px-4 max-[1250px]:px-4 max-[1281px]:px-5 max-[1910px]:px-5 min-[1911px]:px-6 align-middle">
                                            <div className="flex items-start gap-3">
                                                <div>
                                                    <div
                                                        className="font-bold text-[16px] text-ink"
                                                    >
                                                        {formatDate(trip.startDate)}
                                                    </div>

                                                    <div
                                                        className="text-[12px] text-[#6B7280] mt-1"
                                                    >
                                                        {getDay(trip.startDate)}
                                                    </div>
                                                </div>

                                                <span className="flex h-[24px] items-center text-[18px] font-bold text-ink">→</span>

                                                <div>
                                                    <div
                                                        className="font-bold text-[16px] text-ink"
                                                    >
                                                        {formatDate(trip.endDate)}
                                                    </div>

                                                    <div
                                                        className="text-[12px] text-[#6B7280] mt-1"
                                                    >
                                                        {getDay(trip.endDate)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="border px-4 py-5 align-middle">
                                            {trip.statusType === "soldout" ? (
                                                <div
                                                    className="text-red-600 text-[14px] leading-[16px] font-medium"
                                                    style={{ fontFamily: "Nohemi" }}
                                                >
                                                    Journey Sold Out
        
                                                </div>
                                            ) : (
                                                <div
                                                    className="text-[#128914] text-[14px] leading-[16px] font-medium"
                                                >
                                                    Seats Available
                                                </div>
                                            )}
                                        </td>
                                      <td className="border px-4 py-5">
    {/* From */}
    <div className="text-[10px] text-[#757575] mb-1">
        from
    </div>

    {/* Discounted price */}
    <div className="flex items-baseline gap-[2px]">
        <span className="text-[20px] font-semibold">
           {formatPrice(trip.discountedPrice)}
<span className="relative -top-2 text-[13px]">*</span>
        </span>

        <span className="relative -top-2 text-[13px]">
            /person
        </span>
    </div>

    {/* Original price */}
    {trip.offerPercentage > 0 && (
       <div className="text-[10px] text-[#9CA3AF]">
    was{" "}
    <span className="line-through">
        {formatPrice(trip.originalPrice)}
    </span>
</div>
    )}
</td>
                                      <td className="border px-4 py-5">
    {trip.offerPercentage > 0 ? (
        <>
            <div className="text-[14px] text-[#128914]">
                {trip.offerPercentage}% off
            </div>
            {trip.isEarlyBird && (
                <div className="mt-1 text-[12px] text-black">
                    Early Bird Offer applied to price
                </div>
            )}
        </>
    ) : (
        <div className="text-[14px] text-[#4B5563]">
            No offers available
        </div>
    )}
</td>
                                        <td className="border px-2 max-[1200px]:px-2 max-[1250px]:px-3 max-[1281px]:px-3 max-[1910px]:px-4 min-[1911px]:px-4 py-5 text-center">
                                            {trip.statusType === "soldout" ? (
                                                <span
                                                    onClick={() => openPrivateForm(trip)}
                                                    className="whitespace-nowrap text-[11px] max-[1200px]:text-[11px] max-[1250px]:text-[12px] max-[1281px]:text-[13px] max-[1910px]:text-[13px] min-[1911px]:text-[14px] font-medium underline cursor-pointer text-ink"
                                                >
                                                    Request a Private Journey
                                                </span>
                                            ) : (
                                               <button
  className="whitespace-nowrap bg-[#2C3078] text-white rounded-full px-3 py-1.5 max-[1200px]:px-3 max-[1200px]:py-1.5 max-[1250px]:px-4 max-[1250px]:py-2 max-[1281px]:px-4 max-[1281px]:py-2 max-[1910px]:px-5 max-[1910px]:py-2 min-[1911px]:px-6 min-[1911px]:py-2 text-[11px] max-[1200px]:text-[11px] max-[1250px]:text-[12px] max-[1281px]:text-[13px] max-[1910px]:text-[13px] min-[1911px]:text-[14px] font-medium"
  onClick={() => openGroupForm(trip)}
>
  {trip.button}
</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>

                        </table>
                    </div>
                </div>

                <div className="mt-6 flex flex-col items-start">
                    <p
                        className="text-ink"
                        style={{
                            width: "263px",
                            height: "13px",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "13px",
                        }}
                    >
                        Not sure which date works?
                    </p>

                    <button
                        className="underline text-ink mt-[12px]"
                        style={{
                            width: "185px",
                            height: "13px",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "13px",
                            textAlign: "left",
                        }}
                        onClick={()=> setIsOpenGeneralInquiryForm(true)}
                    >
                        Speak to an advisor
                    </button>
                </div>
            </div>



            <PrivateInquiryForm
                isOpen={Boolean(privateFormDeparture)}
                onClose={() => setPrivateFormDeparture(null)}
                onSubmit={(data) => console.log("Private journey inquiry submitted:", data)}
                journey={journey}
                departure={privateFormDeparture}
                showDepartureDate
            />

            <GroupInquiryForm
                isOpen={Boolean(groupFormTrip)}
                onClose={() => setGroupFormTrip(null)}
                onSubmit={(data) => console.log("Group trip inquiry submitted:", data)}
               journey={journey}
                trip={groupFormTrip}
            />
             <GeneralInquiryForm
        isOpen={isOpenGeneralInquiryForm}
        onClose={() => setIsOpenGeneralInquiryForm(false)}
        onSubmit={(data) => console.log("Advisor inquiry submitted:", data)}
      />
        </section>
    );
}