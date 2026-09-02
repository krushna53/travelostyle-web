"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import img from "./img.png";

export default function ExploreAllJourneys() {
  return (
    <section className="w-full border-t border-[#D9D9D9]">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[50%_50%]">

          {/* LEFT SIDE */}
          <div className="flex items-center justify-center px-6 pt-[71px] pb-10 lg:min-h-[888px] lg:px-10">
            <div className="w-full max-w-[776px]">

              {/* Desktop Heading */}
              <h2 className="hidden lg:block font-[Taprom] text-[54px] leading-[1.2] text-ink">
                <span className="block w-fit sub-title-bg mb-4">
                  There’s a version of the
                </span>

                <span className="block w-fit sub-title-bg mb-4">
                  world out there with your
                </span>

                <span className="block w-fit sub-title-bg">
                  name on it
                </span>
              </h2>

              {/* Mobile Heading */}
              <h2 className="block lg:hidden font-[Taprom] font-normal max-w-[336px] mx-auto text-[40px] leading-[48px] tracking-[0.05em] text-[#000000] text-center">
                <span className="w-fit mx-auto block sub-title-bg mb-[15px]">
                  There’s a version of
                </span>

                <span className="block sub-title-bg sub-title-bg des mb-[15px]">
                  the world out there
                </span>

                <span className="block sub-title-bg sub-title-bg des mb-[15px]">
                  that has your name
                </span>

                <span className="block sub-title-bg sub-title-bg des-on">
                  on it.
                </span>
              </h2>

              {/* Paragraph */}
              <p className="hidden lg:block mt-[56px] max-w-[573px] font-normal text-[17px] leading-[32px] tracking-[0.05em] text-ink">
                TravelOStyle plans journeys across regions, travel styles,
                and budget points – from the sun-scorched temples of Rajasthan
                to the drama of Patagonia. If you’re drawn towards it, it’s a
                journey worth taking.
              </p>

              {/* Desktop Button */}
              <Link
                href="/itinerary"
                className="hidden lg:flex mt-[48px] w-[240px] h-[56px] rounded-full bg-[#2C3078] items-center justify-center"
              >
                <span className="font-semibold text-[18px] leading-[32px] tracking-[0.05em] text-[#FAFAFA]">
                  Explore All Journeys
                </span>
              </Link>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">
            <Image
              src={img}
              alt="Barcelona Spain"
              width={948}
              height={888}
              className="w-full h-[390px] lg:h-[888px] object-cover"
              priority
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Location */}
            <div className="absolute bottom-[38px] left-[26px] z-10 lg:bottom-8 lg:left-8">
              <p className="text-[#FAFAFA] text-[18px] font-semibold leading-[28px] tracking-[0.05em]">
                Barcelona, Spain
              </p>
            </div>
          </div>

          {/* Mobile Button */}
          <div className="flex justify-left ml-7 mt-8 md:mt-8 lg:hidden">
            <Link
              href="/itinerary"
              className="h-[37px] w-[224px] rounded-full bg-[#2C3078] flex items-center justify-center"
            >
              <span className="font-semibold text-[18px] leading-[32px] tracking-[0.05em] text-[#FAFAFA] whitespace-nowrap">
                Explore All Journeys
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}