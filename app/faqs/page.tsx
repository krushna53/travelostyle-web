import type { Metadata } from "next";
import SearchBar from "@/components/JourneyDetailPage/SearchBar";
import Footer from "@/components/Footer";
import FaqSections from "@/components/Faq/FaqSections";
import { FAQ_SECTIONS } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | TravelOStyle",
  description:
    "Answers to common questions about booking, payments, itineraries, inclusions, cancellations and getting in touch with TravelOStyle.",
};

type FaqItem = { question: string; answer: string };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTIONS.flatMap((section) => section.items as FaqItem[])
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
};

export default function GeneralFaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <SearchBar showAllJourneys={true} />

      <div className="w-full border-b-2 border-[#1A1A1A]" />

      <main className="w-full bg-off-white">
        {/* Capped at the 1920 board so the rows' % offsets (in FaqSections)
            stop growing past it. */}
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="px-4 pt-10 pb-16 md:px-8 md:pt-[97px] md:pb-[104px] lg:px-0">
            {/* 56/72 Taprom, cap top 251 (13.4px into the line box, so the box
                starts 97 under the 141 header). Rectangle 928 is 633x36, 17px
                under the cap top and 10px wider than the 613 words each side. */}
            <h1 className="text-center font-taprom text-[28px] leading-[36px] font-normal tracking-[0.05em] text-black capitalize md:text-[56px] md:leading-[72px]">
              <span className="relative isolate inline-block after:absolute after:top-[0.543em] after:left-[-0.179em] after:-z-10 after:h-[0.643em] after:w-[calc(100%+0.357em)] after:bg-tan after:content-['']">
                Frequently Asked Questions
              </span>
            </h1>

            <div className="mt-10 md:mt-[77px]">
              <FaqSections sections={FAQ_SECTIONS} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
