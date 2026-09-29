import React, { useState } from "react";
import Image from "@/components/SafeImage";

export default function BookYourJourneyMobile({ onBack }) {
  const [activeYear, setActiveYear] = useState(2026);
  const [expandedCard, setExpandedCard] = useState(2);

  const journeysData = [
    {
      id: 1,
      startDate: "11 May 2026",
      endDate: "24 May 2026",
      seatsLeft: "2 seats left",
      guaranteedDeparture: true,
      earlyBirdOffer: false,
      soldOut: false,
      price: "$5000",
      originalPrice: null,
      actionText: "Request a Private Journey",
    },
    {
      id: 2,
      startDate: "11 May 2026",
      endDate: "24 May 2026",
      seatsLeft: "2 seats left",
      guaranteedDeparture: true,
      earlyBirdOffer: true,
      discountText: "30% off",
      offerDetail: "Early Bird Offer applied to price",
      soldOut: false,
      price: "$5000",
      originalPrice: "was 6450",
      actionText: "Claim Early Bird Call",
    },
    {
      id: 3,
      startDate: "11 May 2026",
      endDate: "24 May 2026",
      seatsLeft: null,
      guaranteedDeparture: false,
      earlyBirdOffer: false,
      soldOut: true,
      price: "$5000",
      originalPrice: "was 6450",
      actionText: "Request a Private Journey",
    },
  ];

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 font-sans flex flex-col gap-6  bg-[#F9F9F9]">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex h-6 w-12 items-center justify-center rounded-full bg-white transition border border-neutral-300 active:scale-95"
        >
          <Image src="/LeftArrow.svg" alt="Back" width={56} height={24} />
        </button>

        <h1 className="text-base font-bold tracking-tight text-ink">
          Book Your Journey
        </h1>

        <div className="w-12" />
      </div>

      {/* Year Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex border border-neutral-400 rounded-md overflow-hidden bg-white text-sm font-semibold">
          <button
            onClick={() => setActiveYear(2026)}
            className={`px-4 py-1 transition ${activeYear === 2026 ? "bg-neutral-200 text-neutral-900" : "text-neutral-500"}`}
          >
            2026
          </button>
          <button
            onClick={() => setActiveYear(2027)}
            className={`px-4 py-1 transition ${activeYear === 2027 ? "bg-neutral-200 text-neutral-900" : "text-neutral-500"}`}
          >
            2027
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {journeysData.map((journey) => {
          const isExpanded = expandedCard === journey.id;

          return (
            <div
              key={journey.id}
              className="border border-neutral-800 rounded-xl bg-white overflow-hidden shadow-sm flex flex-col"
            >
              <div className="p-4 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-neutral-900 font-medium">
                    <span className="font-bold">Trip Start:</span> {journey.startDate}
                  </p>
                  <p className="text-xs text-neutral-900 font-medium">
                    <span className="font-bold">Trip End:</span> {journey.endDate}
                  </p>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 items-center mt-1 text-[11px]">
                    {journey.soldOut && (
                      <span className="text-red-600 font-bold">Journey sold out</span>
                    )}
                    {journey.seatsLeft && (
                      <span className="text-red-600 font-bold">{journey.seatsLeft}</span>
                    )}
                    {journey.guaranteedDeparture && (
                      <span className="text-emerald-600 font-medium">Guaranteed departure</span>
                    )}
                    {journey.earlyBirdOffer && (
                      <span className="text-emerald-600 font-bold">Early Bird Offer</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block leading-none">from</span>
                  <span className="text-lg font-extrabold text-neutral-900">{journey.price}</span>
                  <span className="text-[10px] text-neutral-500 block leading-none">/person</span>
                  {journey.originalPrice && (
                    <span className="text-[10px] text-neutral-400 line-through block mt-0.5">
                      {journey.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-neutral-800 p-4 bg-white flex flex-col items-center text-center gap-3">
                  {journey.earlyBirdOffer && (
                    <div>
                      <p className="text-emerald-600 font-bold text-sm">{journey.discountText}</p>
                      <p className="text-xs text-neutral-600 font-medium">{journey.offerDetail}</p>
                    </div>
                  )}
                  <button className="w-full max-w-xs bg-[#232F7A] text-white py-2.5 rounded-full text-xs font-bold shadow-md hover:bg-[#1a245e] active:scale-95 transition">
                    {journey.actionText}
                  </button>
                </div>
              )}

              <button
                onClick={() => toggleExpand(journey.id)}
                className="w-full border-t border-neutral-300 py-2.5 text-xs font-bold text-neutral-800 flex items-center justify-center gap-1.5 bg-white hover:bg-neutral-50"
              >
                <span>{isExpanded ? "—" : "+"}</span>{" "}
                {isExpanded ? "Show less" : "Show more"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-2 flex flex-col items-center gap-0.5">
        <p className="text-sm font-semibold text-neutral-800">
          Not sure which date works?
        </p>
        <button className="text-sm font-bold text-neutral-800 underline decoration-1 underline-offset-4 hover:text-black">
          Speak to an advisor
        </button>
      </div>
    </div>
  );
}