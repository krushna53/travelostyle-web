"use client";

import { useRouter } from "next/navigation";
import JourneyRevelationsSection from "../JourneyRevelationsSection";
import WhyTakeJourney from "../WhyTakeJourney";
import AdvisorCallout from "./AdvisorCallout";
import BookingSteps from "../BookingSteps";
import ChoosePopularGroupJourney from "./ChoosePopularGroupJourney";
import GoodCompaneyJourneyMobile from "./GoodCompaneyJourneyMobile";
import GoodCompaneyJourney from "./GoodCompanyJourney";
import GroupRevelationsSectionMobile from "../JourneyRevelationsMobile";
import ComingSoon from "../ComingSoon";

export default function Index({
  matrixContent,
  whyTakeContent,
  bookingStepsContent,
  advisorCalloutContent,
}) {
  const router = useRouter();

  const handleCtaClick = () => {
    sessionStorage.setItem(
      "journeyData",
      JSON.stringify({ style: ["Group Journey"] })
    );
    router.push("/itinerary");
  };

  return (
    <div>
      <GoodCompaneyJourney />
      <GoodCompaneyJourneyMobile />
      {matrixContent ? (
        <>
          <JourneyRevelationsSection
            badgeText={matrixContent.badgeText}
            titleText={matrixContent.titleText}
            features={matrixContent.features}
            topIntroText={matrixContent.topIntroText}
            matrixRows={matrixContent.matrixRows}
            footerText={matrixContent.footerText}
            theme={{ cardBg: "bg-[#edf2d0]", borderColor: "#444444" }}
          />
          <GroupRevelationsSectionMobile
            badgeText={matrixContent.badgeText}
            titleText={matrixContent.titleText}
            features={matrixContent.features}
            topIntroText={matrixContent.topIntroText}
            matrixRows={matrixContent.matrixRows}
            footerText={matrixContent.footerText}
            theme={{
              cardBg: "#eff3cf",
              borderColor: "#1A1A1A",
            }}
          />
        </>
      ) : (
        <ComingSoon label="Journey Type Matrix" />
      )}
      <ChoosePopularGroupJourney />

      {whyTakeContent ? (
        <WhyTakeJourney
          title={whyTakeContent.heading}
          bgImageUrl="/GroupJourneyBP.svg"
          features={whyTakeContent.features}
          ctaTitle={whyTakeContent.ctaTitle}
          ctaSubtitle={whyTakeContent.ctaSubtitle}
          ctaButtonText={whyTakeContent.ctaButtonText}
          onCtaClick={handleCtaClick}
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