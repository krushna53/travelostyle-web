"use client";

import Image from "next/image";
import MobileMegaMenu from "./MobileMegaMenu";
import Link from "next/link";

export default function SearchHeader({
  menuOpen,
  setMenuOpen,
  setShowFindJourneyMobile,
  showAllJourneys = false,
}) {
  return (
    <>
      <div className="flex items-center justify-between bg-[#2E2787] px-4 md:px-14 py-2 text-[10px] md:text-[11px] text-white">
        <p className="flex items-center gap-2 truncate min-[1191px]:hidden">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          (773) 983-8067 | 10am-7pm CST
        </p>
        <p className="hidden min-[1191px]:block truncate">
          Speak to our travel advisor (773) 983-8067 | open 10am-7pm CST
        </p>

        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/faqs">FAQs</Link>
          <button className="hidden min-[1191px]:block">Contact Us</button>
        </div>
      </div>

      <MobileMegaMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        showAllJourneys={showAllJourneys}
      />

      <div className="bg-[#FAFAFA] min-[1191px]:bg-transparent ">
        <div className="px-4 md:px-14 py-3 ">
          <div className="relative hidden min-[1191px]:flex width-[100%] max-[1190px]:pt-2 ">
            <div style={{ width: "40%" }}>
              <Link href="/">
                <img
                  src="/TravelOStyleBlack.svg"
                  alt="TravelOStyle"
                  className="h-auto w-[184px] md:w-[280px] max-[1190px]:absolute max-[1190px]:left-1/2 max-[1190px]:top-1/2 max-[1190px]:-translate-x-1/2 max-[1190px]:-translate-y-1/2 min-[1191px]:static min-[1191px]:translate-x-0 min-[1191px]:translate-y-0 cursor-pointer"
                />
              </Link>
            </div>

            <div
              style={{ width: "60%" }}
              className="flex items-center justify-end whitespace-nowrap gap-7 max-[1440px]:gap-[clamp(12px,1.46vw,28px)]
                  max-[1200px]:text-[12px]
                  max-[1250px]:text-[13px]
                  max-[1281px]:text-[14px]
                  max-[1920px]:text-[15px]
                  min-[1920px]:text-[20px] 
                  font-medium text-[#1E1E1E]"
            >
              <Link href="/about-us">About</Link>

              <Link href="/group-rtb-journeys">Group Journeys</Link>

              <Link href="/private-rtb-journeys">Private Journeys</Link>

              <Link href="/tailor-made-journeys">Tailor-made Journeys</Link>

              {showAllJourneys && <Link href="/itinerary">All Journeys</Link>}

              <Link href="/destination">Destinations</Link>

              <Link href="/offers">Offers</Link>

              <Link href="/faqs">FAQs</Link>
            </div>
          </div>
          <div className="block min-[1191px]:hidden relative min-[750px]:pb-4 flex items-center justify-between max-[1190px]:pt-2">
            <button onClick={() => setMenuOpen(true)}>
              <Image src="/MenuToggle.svg" alt="Menu" width={24} height={16} />
            </button>

            <Link href="/">
              <img
                src="/TravelOStyleBlack.svg"
                alt="TravelOStyle"
                className="h-auto w-[184px] md:w-[280px] max-[1190px]:absolute max-[1190px]:left-1/2 max-[1190px]:top-1/2 max-[1190px]:-translate-x-1/2 max-[1190px]:-translate-y-1/2 min-[1191px]:static min-[1191px]:translate-x-0 min-[1191px]:translate-y-0 cursor-pointer"
              />
            </Link>

            <button onClick={() => setShowFindJourneyMobile(true)}>
              <Image src="/Search.svg" alt="Search" width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
