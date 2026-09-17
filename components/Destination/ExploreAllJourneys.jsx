"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import img from "./img.png";

export default function ExploreAllJourneys() {
  return (
    <section className="w-full border-t border-[#1A1A1A]">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[50%_50%] md:pb-5">

          {/* LEFT SIDE */}
          <div className="flex items-center justify-center px-6 pt-[71px] pb-10 lg:min-h-[888px] lg:px-10">
            <div className="w-full max-w-[776px]">

              {/* Desktop Heading */}
              {/* Figma "Destinations Page", 1920: Taprom 64/80/5% #1A1A1A,
                  cap tops 394/474/554, with Rectangles 932/933/936 (607, 702
                  and 321 x 53) starting 8px before the words. Leading is 1.25em
                  rather than a fixed 80px so the line box, and the em-based
                  .hero-bar-dest bars hung off it, scale with the size steps.
                  pl 0.125em puts the words 8px inside the bars, so the bars
                  line up with the paragraph's left edge the way the board has
                  them (bars and copy at 111, words at 119); -top 0.156em lifts
                  the heading the 10px it sat low without moving the copy.
                  38px below 1280: the left column is only ~432px there, and
                  "world out there with your" at 44px wrapped onto two lines. */}
              <h2 className="hidden lg:block relative -top-[0.156em] pl-[0.125em] font-[Taprom] font-normal tracking-[0.05em] leading-[1.25] text-[38px] min-[1280px]:text-[44px] min-[1440px]:text-[48px] min-[1600px]:text-[54px] min-[1800px]:text-[60px] min-[1919px]:text-[64px] text-ink">
                <span className="block w-fit whitespace-nowrap sub-title-bg hero-bar-dest hero-bar-dest1">
                  There’s a version of the
                </span>

                <span className="block w-fit whitespace-nowrap sub-title-bg hero-bar-dest hero-bar-dest2">
                  world out there with your
                </span>

                <span className="block w-fit whitespace-nowrap sub-title-bg hero-bar-dest hero-bar-dest3">
                  name on it
                </span>
              </h2>

              {/* Mobile Heading — "RES_Destinations", 390 board: four centred
                  lines of Taprom 40/48/5% on a 48px pitch (no gaps between
                  them), each on its own 32px bar reaching a little past the
                  words -- .hero-bar-dest-m. */}
              <h2 className="block lg:hidden relative font-[Taprom] font-normal max-w-[339px] mx-auto text-[40px] leading-[48px] tracking-[0.05em] text-[#1A1A1A] text-center">
                {["There’s a version of", "the world out there", "that has your name", "on it."].map((line) => (
                  <span key={line} className="block">
                    <span className="sub-title-bg hero-bar-dest-m inline-block whitespace-nowrap">{line}</span>
                  </span>
                ))}
              </h2>

              {/* Paragraph */}
              <p className="hidden lg:block mt-[56px] max-w-[573px] font-normal text-[18px] leading-[32px] tracking-[0.05em] text-black">
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