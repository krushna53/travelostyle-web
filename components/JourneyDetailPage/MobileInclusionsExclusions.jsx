"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import Image from "@/components/SafeImage";

export default function MobileInclusionsExclusions({ onBack }) {
  const [isInclusionsOpen, setIsInclusionsOpen] = useState(true);
  const [isExclusionsOpen, setIsExclusionsOpen] = useState(false);

  return (
    <div className="w-full min-h-screen block md:hidden font-sans antialiased text-ink">
      <main className="px-4 py-4 pb-12">
        <div className="w-full p-2">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <button
              onClick={onBack}
              className="flex h-6 w-12 items-center justify-center rounded-full active:scale-95 transition"
            >
              <Image src="/LeftArrow.svg" alt="Next" height={24} width={56} />
            </button>

            <h1 className="text-base font-bold tracking-tight text-ink">
              Highlights
            </h1>

            <div className="w-12"></div>
          </div>

          <div className="flex gap-2.5 rounded-lg bg-[#F2E2DA] p-3.5 text-xs leading-relaxed text-[#555] mb-5">
            <Info size={16} className="mt-0.5 shrink-0 text-[#8B5A2B]" />
            <p>
              Everything listed below is included in your journey pricing. No
              hidden additions and no surprises mid-trip. If you require
              something more, please consult our travel advisor to see what&apos;s
              possible.
            </p>
          </div>

          <div className="rounded-xl border border-black bg-[#F5FADF] overflow-hidden shadow-sm mb-4">
            <button
              onClick={() => setIsInclusionsOpen(!isInclusionsOpen)}
              className="flex w-full items-center justify-between bg-[#EBF3CE] px-4 py-3.5 border-b border-black text-left"
            >
              <span className="font-extrabold uppercase tracking-wider text-[13px] text-black">
                INCLUSIONS
              </span>

              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black bg-white font-mono text-sm font-bold text-black select-none">
                {isInclusionsOpen ? "−" : "+"}
              </span>
            </button>

            {isInclusionsOpen && (
              <div className="flex flex-col">
                <div className="p-4 border-b border-black space-y-2">
                  <div className="flex items-center gap-3 font-extrabold text-sm text-black whitespace-nowrap">
                    <Image
                      src="/Meals.svg"
                      alt="Meals"
                      height={24}
                      width={48}
                      className="w-[24px] h-auto"
                    />
                    Meals
                  </div>
                  <p className="text-xs text-[#2A2A2A] leading-relaxed">
                    Daily breakfast throughout · Dinner at the Sahara Desert
                    camp · Selected dinners at riads and hotels
                    (package–dependent) · Opportunities for guided local dining
                    in Fez, Marrakech, and Ouarzazate. Daily 2 bottled waters
                    per person
                  </p>
                </div>

                <div className="p-4 border-b border-black space-y-2">
                  <div className="flex items-center gap-3 font-extrabold text-sm text-black whitespace-nowrap">
                    <Image
                      src="/Accommodation.svg"
                      alt="Accommodation"
                      height={24}
                      width={48}
                      className="w-[24px] h-auto shrink-0"
                    />
                    Accommodation
                  </div>
                  <p className="text-xs text-[#2A2A2A] leading-relaxed">
                    12 nights across 4-star hotels, boutique riads, a desert
                    gateway lodge, and a luxury tented camp in the Sahara · Full
                    accommodation breakdown in the day-by-day section
                  </p>
                </div>

                <div className="p-4 border-b border-black space-y-2">
                  <div className="flex items-center gap-3 font-extrabold text-sm text-black whitespace-nowrap">
                    <Image
                      src="/Portage.svg"
                      alt="Portage"
                      height={24}
                      width={48}
                      className="w-[24px] h-auto"
                    />
                    Portage
                  </div>
                  <p className="text-xs text-[#2A2A2A] leading-relaxed">
                    Luggage handling at hotels where available
                  </p>
                </div>

                <div className="p-4 border-b border-black space-y-2">
                  <div className="flex items-center gap-3 font-extrabold text-sm text-black whitespace-nowrap">
                    <Image
                      src="/OnGroundTravel.svg"
                      alt="On-ground travel"
                      height={24}
                      width={48}
                      className="w-[24px] h-auto"
                    />
                    On-ground travel
                  </div>
                  <p className="text-xs text-[#2A2A2A] leading-relaxed">
                    Private air-conditioned vehicle throughout · Professional
                    driver for all transfers and excursions · Camel ride at
                    sunset into the Sahara · Sidecar tour through Marrakech’s
                    hidden quarters
                  </p>
                </div>

                <div className="p-4 border-b border-black space-y-2">
                  <div className="flex items-center gap-3 font-extrabold text-sm text-black whitespace-nowrap">
                    <Image
                      src="/GuidesTickets.svg"
                      alt="Guides & Tickets"
                      height={24}
                      width={48}
                      className="w-[24px] h-auto"
                    />
                    Guides & Tickets
                  </div>
                  <p className="text-xs text-[#2A2A2A] leading-relaxed">
                    Professional English-speaking licensed local guides ·
                    Entrance fees to all listed monuments, museums, and UNESCO
                    sites · 24/7 on-ground support and concierge assistance
                  </p>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-3 font-extrabold text-sm text-black whitespace-nowrap">
                    <Image
                      src="/Transfers.svg"
                      alt="Transfers"
                      height={24}
                      width={48}
                      className="w-[24px] h-auto"
                    />
                    Transfers
                  </div>
                  <p className="text-xs text-[#2A2A2A] leading-relaxed">
                    Airport arrival transfer in Casablanca · Airport departure
                    transfer from Marrakech · All inter-city and
                    inter-destination transfers
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-black bg-[#FDF2F2] overflow-hidden shadow-sm">
            <button
              onClick={() => setIsExclusionsOpen(!isExclusionsOpen)}
              className="flex w-full items-center justify-between bg-[#FADBD8] px-4 py-3 border-b border-black text-left"
            >
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-black">
                EXCLUSIONS
              </span>

              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black bg-white font-mono text-sm font-bold text-black select-none">
                {isExclusionsOpen ? "−" : "+"}
              </span>
            </button>

            {isExclusionsOpen && (
              <div className="p-4 text-xs text-[#444] space-y-2">
                <p>· International flights and routing layout tariffs.</p>
                <p>
                  · Mandatory travel insurance or local visa fee requirements.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}