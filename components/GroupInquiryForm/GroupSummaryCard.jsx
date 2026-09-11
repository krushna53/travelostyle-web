"use client";

import { useState } from "react";
import Image from "next/image";
import { MoveRight, Plus, Minus } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "11 May 2026";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDay(dateStr) {
  if (!dateStr) return "Monday";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Monday";
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

// Journey + departure snapshot shown alongside the Group Trip Inquiry form.
// Matches the same "frame + card" look as PrivateInquiryForm's
// JourneySummaryCard (square corners, bold outer frame, thin inner border).
// Unlike the private-journey card, this one is always tied to a specific
// confirmed group departure, so the departure date + guaranteed-departure
// badge are always shown.
export default function GroupSummaryCard({ journey, trip }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const startDate = trip?.startDate || journey?.startDate || "2026-05-11";
  const endDate = trip?.endDate || journey?.endDate || "2026-05-24";
  const price = trip?.discountedPrice ?? journey?.offerPrice ?? 5000;
  const originalPrice = trip?.originalPrice ?? journey?.originalPrice ?? 6500;
  const seatsLeft = trip?.seatsLeft ?? 2;
  const earlyBirdOffer = trip?.earlyBirdOffer ?? journey?.earlyBirdOffer ?? true;

  return (
    <>
      {/* Compact collapsible card — mobile only */}
      <div className="sm:hidden w-full overflow-hidden rounded-[6px] border border-[#4A4A4A] bg-white">
        <div className="p-3">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="flex w-full items-center justify-between gap-2 cursor-pointer"
          >
            <h4 className="text-[13px] font-bold leading-tight text-[#1A1A1A]">
              {journey?.title || "The Moroccan Getaway"}
            </h4>
            <span className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border border-[#1A1A1A] text-[#1A1A1A]">
              {isExpanded ? (
                <Minus size={11} strokeWidth={2} />
              ) : (
                <Plus size={11} strokeWidth={2} />
              )}
            </span>
          </button>

          {isExpanded && (
            <div className="mt-2.5 flex gap-3">
              <div className="relative h-[92px] w-[104px] shrink-0 overflow-hidden rounded-[3px]">
                <Image
                  src={journey?.image || "/Morocco.svg"}
                  alt={journey?.title || "The Moroccan Getaway"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 text-[10px] leading-tight text-[#4A4A4A]">
                <p>{journey?.days || "13 days | 12 Nights"}</p>
                <p>{journey?.destinations || "10 Destinations"}</p>

                <div className="mt-1 space-y-0.5">
                  {seatsLeft != null && (
                    <p className="text-[9.5px] font-bold leading-tight text-[#A31D1D]">
                      {seatsLeft} seats left
                    </p>
                  )}
                  <p className="text-[9.5px] font-bold leading-tight text-[#238823]">
                    Guaranteed departure
                  </p>
                  {earlyBirdOffer && (
                    <p className="text-[9.5px] font-bold leading-tight text-[#238823]">
                      Early bird offer applied
                    </p>
                  )}
                </div>

                <div className="mt-1">
                  {originalPrice && (
                    <p className="text-[9px] leading-tight text-[#7A7A7A] line-through">
                      ${Number(originalPrice).toLocaleString()}
                    </p>
                  )}
                  <p className="text-[13px] font-extrabold leading-tight text-[#1A1A1A]">
                    ${Number(price).toLocaleString()}*
                    <span className="text-[9px] font-semibold text-[#4A4A4A]">
                      /person
                    </span>
                  </p>
                  <p className="text-[8px] leading-none text-[#7A7A7A]">
                    *double occupancy
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#4A4A4A] bg-[#f2e2da] px-3 py-2">
          <p className="text-[10px] font-bold leading-none text-[#1A1A1A]">
            Departure Date
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#1A1A1A]">
            <div>
              <p className="font-bold leading-tight">{formatDate(startDate)}</p>
              <p className="text-[8.5px] leading-tight text-[#6A6A6A]">
                {formatDay(startDate)}
              </p>
            </div>

            <div className="flex items-center justify-center px-1">
              <MoveRight size={18} strokeWidth={1.5} className="text-[#3A3A3A]" />
            </div>

            <div className="text-right">
              <p className="font-bold leading-tight">{formatDate(endDate)}</p>
              <p className="text-[8.5px] leading-tight text-[#6A6A6A]">
                {formatDay(endDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full card — tablet / desktop */}
      <div className="hidden sm:block w-full overflow-hidden rounded-[3px] border border-[#4A4A4A] bg-white">
        {/* Top Image */}
        <div className="p-1.5 pb-0">
          <div className="relative h-[135px] w-full overflow-hidden">
            <Image
              src={journey?.image || "/Morocco.svg"}
              alt={journey?.title || "The Moroccan Getaway"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>

        {/* Main Details */}
        <div className="px-2.5 pb-2.5 pt-2">
          <h4 className="text-[12px] font-bold leading-tight text-[#1A1A1A]">
            {journey?.title || "The Moroccan Getaway"}
          </h4>

          <div className="mt-1.5 space-y-0.5 text-[9.5px] leading-tight text-[#4A4A4A]">
            <p>{journey?.days || "13 days | 12 Nights"}</p>
            <p>{journey?.destinations || "10 Destinations"}</p>
            <p>{journey?.groupSize || "upto 18 guests"}</p>
          </div>

          <div className="mt-2 space-y-0.5">
            {seatsLeft != null && (
              <p className="text-[9.5px] font-bold leading-tight text-[#A31D1D]">
                {seatsLeft} seats left
              </p>
            )}
            <p className="text-[9.5px] font-bold leading-tight text-[#238823]">
              Guaranteed departure
            </p>
          </div>

          <div className="mt-2">
            {originalPrice && (
              <p className="text-[9.5px] text-[#7A7A7A] line-through leading-tight">
                ${Number(originalPrice).toLocaleString()}
              </p>
            )}
            <p className="text-[14px] font-extrabold leading-tight text-[#1A1A1A]">
              ${Number(price).toLocaleString()}*
              <span className="text-[9.5px] font-semibold text-[#4A4A4A]">
                /person
              </span>
            </p>
            <p className="mt-0.5 text-[8.5px] text-[#7A7A7A] leading-none">
              *double occupancy
            </p>
          </div>
        </div>

        <div className="border-t border-[#4A4A4A] bg-[#f2e2da] px-2.5 py-2">
          <p className="text-[10.5px] font-bold leading-none text-[#1A1A1A]">
            Departure Date
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#1A1A1A]">
            <div>
              <p className="font-bold leading-tight">{formatDate(startDate)}</p>
              <p className="text-[8.5px] text-[#6A6A6A] leading-tight">
                {formatDay(startDate)}
              </p>
            </div>

            <div className="flex items-center justify-center px-1">
              <MoveRight size={20} strokeWidth={1.5} className="text-[#3A3A3A]" />
            </div>

            <div className="text-right">
              <p className="font-bold leading-tight">{formatDate(endDate)}</p>
              <p className="text-[8.5px] text-[#6A6A6A] leading-tight">
                {formatDay(endDate)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
