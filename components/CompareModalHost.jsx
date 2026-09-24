"use client";

import { useEffect, useState } from "react";
import CompareTripsModal from "@/components/HomePage/CompareTripsModal";
import { COMPARE_OPEN_EVENT } from "@/lib/compareCart";

// Mounted once in the root layout so the compare modal can be opened from
// anywhere via openCompareModal() in lib/compareCart.
export default function CompareModalHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(COMPARE_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(COMPARE_OPEN_EVENT, handleOpen);
  }, []);

  return <CompareTripsModal open={open} onClose={() => setOpen(false)} />;
}
