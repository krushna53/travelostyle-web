"use client";
import Image from "next/image";
import { useState } from "react";
import FindJourneyMobile from "./FindYourJourneyMobile";
import TravelForm from "./TravelForm";
import SearchHeader from "../../SearchHeader";

export default function SearchBar({
  destinations,
  months = [],
  styles = [],
  popularDestinations = [],
  popularMonths = [],
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFindJourneyMobile, setShowFindJourneyMobile] = useState(false);
  return (
    <section className="w-full overflow-hidden ">
      <SearchHeader
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setShowFindJourneyMobile={setShowFindJourneyMobile}
      />
      <div className="px-4 md:px-14 min-[1282px]:px-14">
        <div className="border-b border-[#636363]" />
      </div>
      <div className="hidden md:block px-4 md:px-14 max-[1281px]:md:px-8 py-2">
        <TravelForm
          destinations={destinations}
          months={months}
          styles={styles}
          popularDestinations={popularDestinations}
          popularMonths={popularMonths}
        />
      </div>

      {showFindJourneyMobile && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <FindJourneyMobile
            onClose={() => setShowFindJourneyMobile(false)}
            destinations={destinations}
            months={months}
            styles={styles}
            popularDestinations={popularDestinations}
            popularMonths={popularMonths}
          />
        </div>
      )}
    </section>
  );
}
