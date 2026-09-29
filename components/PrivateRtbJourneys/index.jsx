"use client";
import { useRouter } from "next/navigation";
import BookingSteps from "../BookingSteps";
import GroupRevelationsSectionMobile from "../JourneyRevelationsMobile";
import JourneyRevelationsSection from "../JourneyRevelationsSection";
import WhyTakeJourney from "../WhyTakeJourney";
import AdvisorCallout from "./AdvisorCallout";
import CuratedRouteSection from "./CuratedRouteSection";
import CuratedRouteSectionMobile from "./CuratedRouteSectionMobile";
import JourneyInspiration from "./JourneyInspiration";
import PrivateJourneysLuxury from "./PrivateJourneysLuxury";
import ComingSoon from "../ComingSoon";

export default function Index({ matrixContent, whyTakeContent, bookingStepsContent, advisorCalloutContent }) {
  const router = useRouter();

  const handlePrivateCtaClick = () => {
    sessionStorage.setItem(
      "journeyData",
      JSON.stringify({ style: ["Group Journey", "Private Journey"] })
    );
    router.push("/itinerary");
  };

  return (
    <div>
      <CuratedRouteSection />
      <CuratedRouteSectionMobile />
      {matrixContent ? (
        <>
          <JourneyRevelationsSection
            badgeText={matrixContent.badgeText}
            titleText={matrixContent.titleText}
            features={matrixContent.features}
            topIntroText={matrixContent.topIntroText}
            matrixRows={matrixContent.matrixRows}
            footerText={matrixContent.footerText}
            theme={{
              cardBg: "bg-[#f1e2d7]",
              borderColor: "#444444",
            }}
          />
          <GroupRevelationsSectionMobile
            badgeText={matrixContent.badgeText}
            titleText={matrixContent.titleText}
            features={matrixContent.features}
            topIntroText={matrixContent.topIntroText}
            matrixRows={matrixContent.matrixRows}
            footerText={matrixContent.footerText}
            theme={{
              cardBg: "#f1e2d7",
              borderColor: "#444444",
            }}
          />
        </>
      ) : (
        <ComingSoon label="Journey Type Matrix" />
      )}
      <PrivateJourneysLuxury />
      <JourneyInspiration />
      {whyTakeContent ? (
        <WhyTakeJourney
          title={whyTakeContent.heading}
          bgImageUrl="/PrivateJourneyBP.webp"
          features={whyTakeContent.features}
          ctaTitle={whyTakeContent.ctaTitle}
          ctaSubtitle={whyTakeContent.ctaSubtitle}
          ctaButtonText={whyTakeContent.ctaButtonText}
          onCtaClick={handlePrivateCtaClick}
        />
      ) : (
        <ComingSoon label="Why Take Journey" />
      )}
      {bookingStepsContent ? (
        <BookingSteps bookingRecords={bookingStepsContent} showCraftButton={false} />
      ) : (
        <ComingSoon label="Booking Steps" />
      )}
      <AdvisorCallout content={advisorCalloutContent} />
    </div>
  );
}
