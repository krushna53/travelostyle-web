"use client";

import Image from "next/image";
import Link from "next/link";

export default function MobileMegaMenu({
  menuOpen,
  setMenuOpen,
  showAllJourneys = false,
}) {

  return (
    <div
      className={`fixed inset-0 z-50 min-[1191px]:block transition-all duration-300 ${
        menuOpen ? "visible" : "invisible"
      }`}
    >
      <div
        onClick={() => setMenuOpen(false)}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute left-0 top-0 h-screen w-[78%] max-w-[300px]
          bg-[#2F2F87] px-6 py-8 flex flex-col overflow-y-auto overscroll-contain
          [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div>
          <div className="flex justify-end">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white text-[32px] leading-none"
            >
              ×
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-5">
  <Link
    href="/about-us"
    className="text-left text-white text-[18px] font-medium"
  >
    About
  </Link>

  <Link
    href="/group-rtb-journeys"
    className="text-left text-white text-[18px] font-medium"
  >
    Group Journeys
  </Link>

  <Link
    href="/private-rtb-journeys"
    className="text-left text-white text-[18px] font-medium"
  >
    Private Journeys
  </Link>

  <Link
    href="/tailor-made-journeys"
    className="text-left text-white text-[18px] font-medium"
  >
    Tailor-Made Journeys
  </Link>

  {showAllJourneys && (
  <Link
    href="/itinerary"
    className="text-left text-white text-[18px] font-medium"
  >
    All Journeys
  </Link>
)}

  <Link
    href="/destination"
    className="text-left text-white text-[18px] font-medium"
  >
    Destinations
  </Link>

  <Link
    href="/offers"
    className="text-left text-white text-[18px] font-medium"
  >
    Offers
  </Link>

  <button className="text-left text-white text-[18px] font-medium">
    FAQs
  </button>
</div>

          <Link
  href="/itinerary"
  className="mt-10 inline-block rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-[#2F2F87]"
>
  Explore All Journeys
</Link>

          <div className="mt-10 flex items-center gap-5">
            <Image
              src="/Facebook.svg"
              alt="Facebook"
              width={28}
              height={28}
            />

            <Image
              src="/Instagram.svg"
              alt="Instagram"
              width={28}
              height={28}
            />
          </div>

          <div className="mt-8 text-white">
            <p className="text-[15px] font-medium">
              Talk to Our Travel Advisor
            </p>

            <p className="mt-2 text-[15px]">
              +1 773 983 8067
            </p>

            <p className="mt-2 text-[15px]">
              info@travelostyle.com
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pb-4">
          <div className="flex items-center gap-2">
            <div className="h-[1px] flex-1 bg-white/30" />

            <span className="text-[10px] tracking-[0.2em] text-white/70">
              ESTD. 2026
            </span>

            <div className="h-[1px] flex-1 bg-white/30" />
          </div>
          <div className="flex justify-center py-5">
            <Image
              src="/travelostyle-logo.svg"
              alt="Travelostyle"
              width={170}
              height={50}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-[1px] flex-1 bg-white/30" />

            <span className="text-[9px] tracking-[0.25em] text-white/60">
              JOURNEY BEYOND
            </span>

            <div className="h-[1px] flex-1 bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
}