"use client";

import { useState } from "react";
import BuildYourJourneyForm from "@/components/BuildYourJourneyForm";
import PrivateInquiryForm from "@/components/PrivateInquiryForm";

export default function CtaBanner({
  buttonText = "Craft Your Journey",
  // "build" opens the generic multi-step "Build Your Journey" form.
  // "private" opens the "Request A Private Journey" inquiry form,
  // pre-filled with the journey/departure being viewed.
  // "none" renders a plain, non-functional button (no form wired up).
  formType = "build",
  journey,
  departure,
  // Only relevant when formType === "private". false hides the departure
  // date on the journey card and swaps in a "when do you want to travel"
  // question on Step 1 instead.
  showDepartureDate = true,
  // "card" is the standalone boxed CTA used on the mobile journey menu:
  // fixed-width bordered panel with centred copy stacked above the button.
  // Default keeps the inline banner used inside the tab content.
  variant = "banner",
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (variant === "card") {
    return (
      <div className="mx-auto flex h-[216px] w-[336px] max-w-full flex-col items-center justify-center gap-5 rounded-[5px] border-2 border-[#1A1A1A] bg-[#F2E2DA] px-6">
        <p className="text-center text-[18px] font-semibold leading-[32px] tracking-[0.05em] text-black">
          Love the itinerary, but need something different? Make this journey
          yours!
        </p>

        <button
          onClick={formType === "none" ? undefined : () => setIsFormOpen(true)}
          className="h-[37px] w-[284px] max-w-full rounded-full bg-[#2C3078] px-4 text-[16px] font-semibold tracking-[0.05em] text-[#FAFAFA] transition hover:bg-[#252b78] active:scale-95"
        >
          {buttonText}
        </button>

        {formType === "private" && (
          <PrivateInquiryForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={(data) => console.log("Private journey inquiry submitted:", data)}
            journey={journey}
            departure={departure}
            showDepartureDate={showDepartureDate}
            label="Inspirational Itineraries Form"
          />
        )}
        {formType === "build" && (
          <BuildYourJourneyForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={(data) => console.log("Journey inquiry submitted:", data)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-4 mb-6 flex flex-col items-start gap-3 rounded-2xl bg-[#F2E5DE] px-4 py-4 md:mx-[20px] md:mb-[24px] md:flex-row md:items-center md:justify-between md:gap-0 md:rounded-[8px] md:px-[24px] md:py-[16px] md:max-[901px]:mx-[20px] md:max-[901px]:rounded-[8px] md:max-[901px]:px-[24px] md:max-[901px]:py-[16px] md:max-[1200px]:mx-[26px] md:max-[1200px]:rounded-[9px] md:max-[1200px]:px-[28px] md:max-[1200px]:py-[18px] md:max-[1250px]:mx-[32px] md:max-[1250px]:rounded-[9px] md:max-[1250px]:px-[32px] md:max-[1250px]:py-[20px] md:max-[1281px]:mx-[38px] md:max-[1281px]:rounded-[10px] md:max-[1281px]:px-[36px] md:max-[1281px]:py-[22px] md:max-[1910px]:mx-[48px] md:max-[1910px]:rounded-[10px] md:max-[1910px]:px-[42px] md:max-[1910px]:py-[26px] md:min-[1911px]:mx-[64px] md:min-[1911px]:rounded-[12px] md:min-[1911px]:px-[48px] md:min-[1911px]:py-[30px]">
      <div>
        <p className="text-[15px] font-semibold text-ink md:text-[15px] md:max-[1200px]:text-[16px] md:max-[1250px]:text-[16px] md:max-[1281px]:text-[17px] md:max-[1910px]:text-[18px] md:min-[1911px]:text-[19px]">
          Love the itinerary, but need more?
        </p>
        <p className="text-[15px] font-semibold text-ink md:text-[15px] md:max-[1200px]:text-[16px] md:max-[1250px]:text-[16px] md:max-[1281px]:text-[17px] md:max-[1910px]:text-[18px] md:min-[1911px]:text-[19px]">
          Make this journey yours!
        </p>
      </div>
      <button
        onClick={formType === "none" ? undefined : () => setIsFormOpen(true)}
        className="h-10 w-full rounded-full bg-[#2D3482] px-6 text-[13px] font-semibold text-white transition hover:bg-[#252b78] md:h-[36px] md:w-auto md:px-[20px] md:text-[13px] md:max-[1200px]:h-[38px] md:max-[1200px]:px-[22px] md:max-[1200px]:text-[13px] md:max-[1250px]:h-[40px] md:max-[1250px]:px-[24px] md:max-[1250px]:text-[14px] md:max-[1281px]:h-[42px] md:max-[1281px]:px-[26px] md:max-[1281px]:text-[14px] md:max-[1910px]:h-[46px] md:max-[1910px]:px-[30px] md:max-[1910px]:text-[15px] md:min-[1911px]:h-[48px] md:min-[1911px]:px-[38px] md:min-[1911px]:text-[16px]"
      >
        {buttonText}
      </button>

      {formType === "private" && (
        <PrivateInquiryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={(data) => console.log("Private journey inquiry submitted:", data)}
          journey={journey}
          departure={departure}
          showDepartureDate={showDepartureDate}
          label="Inspirational Itineraries Form"
        />
      )}
      {formType === "build" && (
        <BuildYourJourneyForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={(data) => console.log("Journey inquiry submitted:", data)}
        />
      )}
    </div>
  );
}
