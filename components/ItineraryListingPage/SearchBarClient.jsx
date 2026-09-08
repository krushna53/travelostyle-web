"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import FindJourneyMobile from "@/components/HomePage/FindYourJourney/FindYourJourneyMobile";
import { BUDGET_RANGES } from "@/lib/budgetRanges";

function ListingSearchForm({ destinations = [], months = [] }) {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState("");

  const toggle = (key) =>
    setActiveDropdown((prev) => (prev === key ? null : key));

  const toggleDest = (d) =>
    setSelectedDestinations((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  const toggleMonth = (m) =>
    setSelectedMonths((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );

  const destLabel = selectedDestinations.length
    ? selectedDestinations.slice(0, 2).join(", ") +
      (selectedDestinations.length > 2 ? ` +${selectedDestinations.length - 2}` : "")
    : "Where do you want to go?";

  const whenLabel = selectedMonths.length
    ? selectedMonths.slice(0, 2).join(", ") +
      (selectedMonths.length > 2 ? ` +${selectedMonths.length - 2}` : "")
    : "When do you want to travel?";

  const budgetLabel =
    BUDGET_RANGES.find((b) => b.value === selectedBudget)?.label ||
    "How much do you want to spend?";

  // FilterSidebar (rendered by AllJourneysPage on /itinerary) already
  // knows how to pick filters up from two places on mount: the `region`
  // query param, and a "journeyData" sessionStorage payload for
  // everything else — the same mechanism the homepage's TravelForm /
  // FindJourneyMobile widgets use. Reusing it here (rather than inventing
  // separate ?month=/?pricing= params nothing reads) is what makes
  // "Find Your Journey" actually filter the results.
  const handleFindJourney = () => {
    sessionStorage.setItem(
      "journeyData",
      JSON.stringify({
        region: selectedDestinations,
        month: selectedMonths,
        pricing: selectedBudget ? [selectedBudget] : [],
      }),
    );
    setActiveDropdown(null);
    const region = selectedDestinations.join(",");
    router.push(`/itinerary${region ? `?region=${encodeURIComponent(region)}` : ""}`);
  };

  return (
    <div className="border-2 border-ink rounded-lg px-6 py-4 my-6 mx-2 md:-mx-4 bg-white">
      <div className="flex gap-4">
        {/* WHERE */}
        <button
          onClick={() => toggle("dest")}
          className="flex h-[2.4vw] flex-1 items-center justify-between rounded border border-gray-300 bg-white px-4"
        >
          <span className={`text-[0.75vw] truncate ${!selectedDestinations.length ? "text-gray-400" : "text-ink"}`}>
            {destLabel}
          </span>
          {activeDropdown === "dest" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* WHEN */}
        <button
          onClick={() => toggle("when")}
          className="flex h-[2.4vw] flex-1 items-center justify-between rounded border border-gray-300 bg-white px-4"
        >
          <span className={`text-[0.75vw] truncate ${!selectedMonths.length ? "text-gray-400" : "text-ink"}`}>
            {whenLabel}
          </span>
          {activeDropdown === "when" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* BUDGET */}
        <button
          onClick={() => toggle("budget")}
          className="flex h-[2.4vw] flex-1 items-center justify-between rounded border border-gray-300 bg-white px-4"
        >
          <span className={`text-[0.75vw] truncate ${!selectedBudget ? "text-gray-400" : "text-ink"}`}>
            {budgetLabel}
          </span>
          {activeDropdown === "budget" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* CTA */}
        <button
          onClick={handleFindJourney}
          className="h-[2.4vw] min-w-[10.5vw] rounded-full bg-[#2E348D] text-[0.85vw] text-white transition hover:bg-[#252b78] shrink-0"
        >
          Find Your Journey
        </button>
      </div>

      {/* WHERE DROPDOWN */}
      {activeDropdown === "dest" && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
          <h3 className="mb-3 text-[0.85vw] font-semibold">Popular Destinations</h3>
          <div className="flex flex-wrap gap-2">
            {destinations.map((d) => (
              <button
                key={d}
                onClick={() => toggleDest(d)}
                className={`rounded-full border px-4 py-1 text-[0.72vw] transition-all ${
                  selectedDestinations.includes(d)
                    ? "border-[#2E348D] bg-[#F5EFE8] text-[#2E348D]"
                    : "border-gray-300 bg-white text-[#444]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WHEN DROPDOWN */}
      {activeDropdown === "when" && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
          <h3 className="mb-3 text-[0.85vw] font-semibold">Pick Month of Travel</h3>
          <div className="flex flex-wrap gap-2">
            {months.map((m) => (
              <button
                key={m}
                onClick={() => toggleMonth(m)}
                className={`rounded-full border px-4 py-1 text-[0.72vw] transition-all ${
                  selectedMonths.includes(m)
                    ? "border-[#2E348D] bg-[#F5EFE8] text-[#2E348D]"
                    : "border-gray-300 bg-white text-[#444]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BUDGET DROPDOWN */}
      {activeDropdown === "budget" && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
          <h3 className="mb-3 text-[0.85vw] font-semibold">Select Budget Range</h3>
          <div className="flex flex-wrap gap-2">
            {BUDGET_RANGES.map((b) => (
              <button
                key={b.value}
                onClick={() => { setSelectedBudget(b.value); setActiveDropdown(null); }}
                className={`rounded-full border px-4 py-1 text-[0.72vw] transition-all ${
                  selectedBudget === b.value
                    ? "border-[#2E348D] bg-[#F5EFE8] text-[#2E348D]"
                    : "border-gray-300 bg-white text-[#444]"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchBar({ destinations = [], months = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFindJourneyMobile, setShowFindJourneyMobile] = useState(false);

  return (
    <section className="w-full overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#2E2787] px-4 md:px-[108px] py-2 text-[10px] md:text-[11px] text-white">
        <p className="truncate">
          Speak to our travel advisor (773) 983-8067 | open 10am-7pm CST
        </p>
        <div className="flex items-center gap-4 md:gap-6">
          <button>FAQs</button>
          <button className="hidden md:block">Contact Us</button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute left-0 top-0 w-[65%] max-w-[240px] bg-[#2E2787] text-white p-6 flex flex-col justify-between transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex justify-end">
              <button onClick={() => setMenuOpen(false)} className="text-white text-2xl">✕</button>
            </div>
           <div className="mt-3 flex flex-col gap-[12px] text-[15px] font-medium tracking-wide">
  <Link href="/about-us" className="text-left hover:underline">
    About
  </Link>

  <Link href="/group-rtb-journeys" className="text-left hover:underline">
    Group Journeys
  </Link>

  <Link href="/private-rtb-journeys" className="text-left hover:underline">
    Private Journeys
  </Link>

  <Link href="/tailor-made-journeys" className="text-left hover:underline">
    Tailor-Made Journeys
  </Link>

  <Link href="/itinerary" className="text-left hover:underline">
    All Journeys
  </Link>

  <Link href="/offers" className="text-left hover:underline">
    Offers
  </Link>

  <button className="text-left hover:underline">
    FAQs
  </button>
</div>
            <div className="mt-8">
              <button className="rounded-full bg-white px-6 py-2.5 text-[13px] font-semibold text-[#2E2787]">
                Explore All Journeys
              </button>
            </div>
            <div className="mt-10 flex gap-4 items-center">
              <Image src="/Facebook.svg" alt="Facebook" width={34} height={32} />
              <Image src="/Instagram.svg" alt="Instagram" width={34} height={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Header + Quote + Search */}
      <div className="bg-[#FAFAFA] px-4 md:px-[108px] py-2">
        {/* Nav row — fixed height on mobile so the icons (centered via
            items-center) and the logo (centered via top-1/2/-translate-y-1/2)
            both center against the exact same band, from just under the
            FAQ bar down to this row's own border line. */}
        <div className="relative flex h-14 items-center justify-between border-b-2 border-[#1A1A1A] md:h-auto md:pb-5">
          <button onClick={() => setMenuOpen(true)} className="block md:hidden">
            <Image src="/MenuToggle.svg" alt="Menu" width={20} height={20} />
          </button>
          <Link href="/">
  <img
    src="/TravelOStyleBlack.svg"
    alt="TravelOStyle"
    className="h-auto w-[140px] md:w-[309px] md:static absolute inset-x-0 top-1/2 mx-auto -translate-y-1/2 md:top-auto md:mx-0 md:translate-y-0 cursor-pointer"
  />
</Link>
          <div className="hidden md:flex items-center gap-9 text-[14px] font-medium text-[#1E1E1E]">
           <Link href="/about-us">About</Link>

<Link href="/group-rtb-journeys">
  Group Journeys
</Link>

<Link href="/private-rtb-journeys">
  Private Journeys
</Link>

<Link href="/tailor-made-journeys">
  Tailor-made Journeys
</Link>

<Link href="/itinerary">
  All Journeys
</Link>

<Link href="/destination">
  Destinations
</Link>

<Link href="/offers">
  Offers
</Link>
          </div>
          <button onClick={() => setShowFindJourneyMobile(true)} className="block md:hidden">
            <Image src="/Search.svg" alt="Search" width={16} height={16} />
          </button>
        </div>

        {/* Hero Quote — desktop only. The mobile itinerary page shows this
            same wording in its own script-styled heading (AllJourneysPage.jsx),
            so repeating it here would duplicate it on mobile. */}
        <div className="hidden md:flex justify-center items-center py-8">
          <p
            className="text-center    whitespace-nowrap  sub-title-bg  font-taprom font-normal text-[54px]   max-[1200px]:text-[28px]   max-[1250px]:text-[32px]   max-[1281px]:text-[38px]   max-[1910px]:text-[44px]   min-[1919px]:text-[54px] text-ink leading-[72px] tracking-[5%]  "
          >
            <span className="bg-[#F2D5C4] px-2 inline-block mb-5">
              The range is wide because we&apos;ve never believed in a
            </span>
            <br />
            <span className="bg-[#F2D5C4] px-2 ">
              one-size-fits-all approach to the world.
            </span>
          </p>
        </div>

        {/* Desktop Search Form */}
        <div className="hidden md:block">
          <ListingSearchForm destinations={destinations} months={months} />
        </div>
      </div>

      {showFindJourneyMobile && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <FindJourneyMobile
            onClose={() => setShowFindJourneyMobile(false)}
            destinations={destinations}
            months={months}
          />
        </div>
      )}
    </section>
  );
}
