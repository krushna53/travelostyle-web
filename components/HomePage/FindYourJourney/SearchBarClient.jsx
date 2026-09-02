"use client";
import Image from "next/image";
import { useState } from "react";
import FindJourneyMobile from "./FindYourJourneyMobile";
import TravelForm from "./TravelForm";
import SearchHeader from "../../SearchHeader";

export default function SearchBar({ destinations }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFindJourneyMobile, setShowFindJourneyMobile] = useState(false);
  return (
    <section className="w-full overflow-hidden ">
      <SearchHeader
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setShowFindJourneyMobile={setShowFindJourneyMobile}
      />

      <div className="hidden md:block px-4 md:px-14 max-[1281px]:md:px-8 py-2">
        <TravelForm destinations={destinations} />
      </div>

      {showFindJourneyMobile && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <FindJourneyMobile
            onClose={() => setShowFindJourneyMobile(false)}
            destinations={destinations}
          />
        </div>
      )}
    </section>
  );
}
