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
        <p className="truncate">
          Speak to our travel advisor (773) 983-8067 | open 10am-7pm CST
        </p>

        <div className="flex items-center gap-4 md:gap-6">
          <button>FAQs</button>
          <button className="hidden md:block">Contact Us</button>
        </div>
      </div>

      <MobileMegaMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        showAllJourneys={showAllJourneys}
      />

      <div className="bg-[#FAFAFA] md:bg-transparent">
        <div className="px-4 md:px-14 py-3 ">
          <div className="relative hidden md:flex width-[100%] max-md:pt-2 ">
            <div style={{ width: "40%" }}>
              <Link href="/">
                <img
                  src="/TravelOStyleBlack.svg"
                  alt="TravelOStyle"
                  className="h-auto w-[184px] md:w-[280px] max-md:absolute max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 cursor-pointer"
                />
              </Link>
            </div>

            <div
              style={{ width: "60%" }}
              className="flex items-center gap-7
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
            </div>
          </div>
          <div className="block md:hidden relative min-[750px]:pb-4 flex items-center justify-between max-md:pt-2">
            <button onClick={() => setMenuOpen(true)}>
              <Image src="/MenuToggle.svg" alt="Menu" width={24} height={16} />
            </button>

            <Link href="/">
              <img
                src="/TravelOStyleBlack.svg"
                alt="TravelOStyle"
                className="h-auto w-[184px] md:w-[280px] max-md:absolute max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 md:static md:translate-x-0 md:translate-y-0 cursor-pointer"
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
