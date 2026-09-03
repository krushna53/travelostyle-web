import Link from "next/link";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import FooterNewsletterForm from "./FooterNewsletterForm";

const footer = {
  phone: "+1773 983 8067",
  email: "info@travelostyle.com",
  copyrightText: "© TravelOStyle 2026 | Designed by Eunoia Design House",
  facebookUrl: "",
  instagramUrl: "",
  linkGroups: [
    {
      title: "Company",
      links: [
        { label: "About Us", url: "/about-us" },
        { label: "General FAQs", url: "/general-faqs" },
        { label: "Write To Us", url: "/write-us" },
        { label: "Travel Journal", url: "//travel-journal" },
      ],
    },
    {
      title: "Travel",
      links: [
        { label: "All Journeys", url: "/itinerary" },
        { label: "Group Journeys", url: "/group-rtb-journeys" },
        { label: "Private Journeys", url: "/private-rtb-journeys" },
        { label: "Tailor-Made Journey", url: "/tailor-made-journeys" },
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
        { label: "Site Map", url: "/site-map" },
      ],
    },
  ],
};

export default function Footer() {
  const [companyGroup, travelGroup, ...restGroups] = footer.linkGroups;

  return (
    <footer
      className="w-full overflow-hidden bg-[#2C3078] text-[#FAFAFA] px-6 md:px-[110px] pt-4 pb-12 md:py-[24px]"
    >
      <div className="flex flex-col items-center justify-center pt-2 w-[363px] max-w-full h-[114.52px] mx-auto md:w-[520px] md:h-auto md:max-w-none">
        <div className="flex items-center justify-between w-full">
          <div className="w-[100px] md:w-[140px] shrink-0 h-px border-t border-[#FAFAFA]" />
          <span className="text-[12px] md:text-[18px] tracking-[0.05em] whitespace-nowrap text-center">
            ESTD. 2026
          </span>
          <div className="w-[100px] md:w-[140px] shrink-0 h-px border-t border-[#FAFAFA]" />
        </div>

        <div className="mt-2 md:mt-6 flex justify-center w-[361.99px] h-[58.12px] max-w-full md:w-full md:overflow-visible">
          <img
            src="/travelostyle-logo.svg"
            alt="TravelOStyle"
            className="w-full h-full object-contain md:h-auto md:w-full md:scale-[1.45]"
          />
        </div>

        <div className="flex items-center justify-between mt-2 md:mt-6 w-full">
          <div className="w-[100px] md:w-[140px] shrink-0 h-px border-t border-[#FAFAFA]" />
          <span className="text-[12px] md:text-[18px] tracking-[0.05em] whitespace-nowrap text-center">
            JOURNEY BEYOND
          </span>
          <div className="w-[100px] md:w-[140px] shrink-0 h-px border-t border-[#FAFAFA]" />
        </div>
      </div>

      <div className="flex flex-wrap gap-5 justify-between mt-16 md:mt-24">
        <div className="gap-6 md:contents">
          {companyGroup && (
            <div>
              <h3 className="text-[16px] md:text-[18px] font-medium tracking-[0.05em] leading-[22px] mb-4 md:mb-6">
                {companyGroup.title}
              </h3>
              <div className="space-y-3 text-[13px] md:text-[14px] font-light text-white/90">
                {companyGroup.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.url}
                    className="block cursor-pointer hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {travelGroup && (
            <div>
              <h3 className="text-[16px] md:text-[18px] font-medium tracking-[0.05em] leading-[22px] mb-4 md:mb-6">
                {travelGroup.title}
              </h3>
              <div className="space-y-3 text-[13px] md:text-[14px] font-light text-white/90">
                {travelGroup.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.url}
                    className="block cursor-pointer hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {restGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-[16px] md:text-[18px] font-medium tracking-[0.05em] leading-[22px] mb-4 md:mb-6">
              {group.title}
            </h3>
            <div className="space-y-3 text-[13px] md:text-[14px] font-light text-white/90">
              {group.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  className="block cursor-pointer tracking-[0.05em] leading-[17px]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="text-[16px] md:text-[18px] font-medium tracking-[0.05em] leading-[22px] mb-4 md:mb-6">
            Connect With Us
          </h3>
          <div className="flex gap-4 mb-4">
            <a href={footer.facebookUrl || "#"} aria-label="Facebook">
              <FaFacebookSquare className="text-[24px] md:text-[26px] text-white cursor-pointer" />
            </a>
            <a href={footer.instagramUrl || "#"} aria-label="Instagram">
              <FaInstagram className="text-[24px] md:text-[26px] text-white cursor-pointer" />
            </a>
          </div>
          <p className="text-[13px] md:text-[14px] font-light">{footer.phone}</p>
          <p className="text-[13px] md:text-[14px] font-light mt-1 md:mt-2">{footer.email}</p>
        </div>

        <FooterNewsletterForm />
      </div>
      <div className="mt-16 md:mt-20 border-t border-white/10 pt-6 text-center md:text-left text-[11px] md:text-[16px] font-medium tracking-[0.05em] md:tracking-[0.16em] text-white/70">
        <span>{footer.copyrightText}</span>
      </div>
    </footer>
  );
}
