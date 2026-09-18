import Link from "next/link";
import SearchBar from "@/components/HomePage/FindYourJourney/SearchBar";
import Footer from "@/components/Footer";
import { getSitemapContent } from "@/lib/sitemapContent";

export const metadata = {
  title: "Site Map | TravelOStyle",
  description: "Every page on TravelOStyle, in one place.",
};

const STATIC_GROUPS = [
  {
    title: "Company",
    links: [
      { label: "Home", url: "/" },
      { label: "About Us", url: "/about-us" },
      { label: "FAQs", url: "/faqs" },
      { label: "Write To Us", url: "/write-us" },
    ],
  },
  {
    title: "Travel",
    links: [
      { label: "All Journeys", url: "/itinerary" },
      { label: "Group Journeys", url: "/group-rtb-journeys" },
      { label: "Private Journeys", url: "/private-rtb-journeys" },
      { label: "Tailor-Made Journey", url: "/tailor-made-journeys" },
      { label: "Destinations", url: "/destination" },
      { label: "Offers", url: "/special-offers-deals-discounts" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Booking Terms & Conditions", url: "/booking-terms-and-conditions" },
      { label: "Cookie Preferences", url: "/cookie-preferences" },
      { label: "Website Terms Of Use", url: "/website-terms-of-use" },
      { label: "Privacy Policy", url: "/privacy-policy" },
      { label: "Data Sharing Policy", url: "/data-sharing-policy" },
      { label: "Email Opt-Out", url: "/email-opt-out" },
    ],
  },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; url: string }[];
}) {
  if (links.length === 0) return null;

  return (
    <div>
      <h2 className="text-[16px] md:text-[18px] font-medium tracking-[0.05em] text-ink mb-4 md:mb-6">
        {title}
      </h2>
      <ul className="space-y-3 text-[13px] md:text-[14px] font-light text-ink/80">
        {links.map((link) => (
          <li key={link.url}>
            <Link href={link.url} className="hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type SitemapEntry = { title: string; url: string; lastModified: Date };

export default async function SiteMapPage() {
  const { journeys, blogs, pages } = (await getSitemapContent()) as {
    journeys: SitemapEntry[];
    blogs: SitemapEntry[];
    pages: SitemapEntry[];
  };

  const toLink = (entry: SitemapEntry) => ({ label: entry.title, url: entry.url });

  const dynamicGroups = [
    { title: "Journeys", links: journeys.map(toLink) },
    { title: "Travel Journal", links: blogs.map(toLink) },
    { title: "More Pages", links: pages.map(toLink) },
  ];

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <div className="border-b-2 border-[#2C3078]">
        <SearchBar />
      </div>

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <h1 className="text-[28px] md:text-[40px] font-semibold tracking-[0.05em] text-ink mb-10 md:mb-14">
          Site Map
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
          {STATIC_GROUPS.map((group) => (
            <LinkColumn key={group.title} title={group.title} links={group.links} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mt-14">
          {dynamicGroups.map((group) => (
            <LinkColumn key={group.title} title={group.title} links={group.links} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
