"use client";

import { useState } from "react";
import CurateJourneyForm from "./index";

export default function CurateJourneyButton({
  className,
  children = "Contact us to curate your journey",
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className} {...props}>
        {children}
      </button>

      <CurateJourneyForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
