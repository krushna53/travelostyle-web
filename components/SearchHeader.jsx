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
      <div className="flex items-center justify-between bg-[#2E2787] px-4 md:px-28 py-2 text-[10px] md:text-[11px] text-white">
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

      <div className="bg-[#FAFAFA] border-b-2 border-[#1A1A1A] md:bg-transparent md:border-b md:border-[#636363]">
      <div className="px-4 md:px-14 py-3">
      <div className="relative flex items-center justify-between max-md:pt-4 pb-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="block md:hidden"
          >
            <Image
              src="/MenuToggle.svg"
              alt="Menu"
              width={24}
              height={16}
            />
          </button>

          <Link href="/">
  <img
    src="/TravelOStyleBlack.svg"
    alt="TravelOStyle"
    className="h-auto w-[184px] md:w-[309px] md:static absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 cursor-pointer"
  />
</Link>

            <div className="hidden md:flex items-center gap-9 text-[14px] font-medium text-[#1E1E1E]">
              <Link href="/about-us">About</Link>

              <Link href="/group-rtb-journeys">Group Journeys</Link>

              <Link href="/private-rtb-journeys">Private Journeys</Link>

              <Link href="/tailor-made-journeys">Tailor-made Journeys</Link>

              {showAllJourneys && <Link href="/itinerary">All Journeys</Link>}

              <Link href="/destination">Destinations</Link>

              <Link href="/offers">Offers</Link>
            </div>

            <button onClick={() => setShowFindJourneyMobile(true)}>
              <Image
                src="/Search.svg"
                alt="Search"
                width={16}
                height={16}
                className="block md:hidden"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
