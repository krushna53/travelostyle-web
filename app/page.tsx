"use server";

import SearchBar from "../components/HomePage/FindYourJourney/SearchBar";
import Index from "../components/HomePage/GroupJourneys";
import JourneySection from "../components/HomePage/JourneySection";
import YourNextTrip from "../components/HomePage/YourNextTrip";
import ContactInquiry from "../components/HomePage/ContactInquiry";
import ExperienceTravelSection from "../components/HomePage/ExperienceTravelSection";
import Map from "../components/HomePage/MapClient";
import TimingSection from "../components/HomePage/TimingSection";
import TestimonialSection from "../components/HomePage/TestimonialSection";
import TravelOStylePromise from "../components/HomePage/TravelOStylePromise";
import PopularDestinations from "../components/HomePage/PopularDestinations";
import Footer from "../components/Footer";
import { API_BASE_URL, buildFileUrl } from "@/lib/config";
import { getBlock } from "@/lib/blockContent";
import { getJourneyCards } from "@/lib/journeyCard";

function stripHtml(html: string) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

async function getHomeHero() {
  const result = await getBlock("page_hero", undefined, {
    filter: { field_page_key: "home" },
    revalidate: 60,
  });
  if (!result?.block) return null;
  return {
    heading: result.block.attributes?.field_heading || "",
    description: stripHtml(result.block.attributes?.field_description?.value || ""),
  };
}

const TESTIMONIAL_INCLUDE =
  "field_testimonial_image.field_media_image,field_testimonial_journey";

// ------------------------------------
// JOURNEY TYPE
// ------------------------------------
type Journey = {
  type: string;
  id: string;
  attributes?: {
    title?: string;
    field_is_popular?: boolean | null;
  };
  relationships?: {
    field_journey_image?: {
      data?: {
        id: string;
        type: string;
      } | null;
    };
  };
};

// ------------------------------------
// TESTIMONIALS
// ------------------------------------
async function getTestimonials() {
  const res = await fetch(
    `${API_BASE_URL}/jsonapi/node/testimonial?include=${TESTIMONIAL_INCLUDE}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch testimonials");

    return {
      data: [],
      included: [],
    };
  }

  return res.json();
}

// ------------------------------------
// HERO SLIDES
// ------------------------------------
// Fetched server-side (like the testimonials/journeys above) so it goes
// through Node's fetch — which honors NODE_TLS_REJECT_UNAUTHORIZED for the
// ddev backend's self-signed cert — instead of the browser's fetch, which
// has no such override and was failing every load with
// ERR_CERT_AUTHORITY_INVALID.
async function getHeroSlides() {
  const res = await fetch(
    `${API_BASE_URL}/jsonapi/node/hero_slide?include=field_hero_banner_image`,
    {
      headers: { Accept: "application/vnd.api+json" },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch hero slides");
    return [];
  }

  const data = await res.json();
  const included = data?.included || [];

  return (data?.data || []).map((slide: any) => {
    const fileId = slide.relationships?.field_hero_banner_image?.data?.id;
    const fileEntity = included.find(
      (inc: any) => inc.type === "file--file" && inc.id === fileId
    );
    const rawUrl = fileEntity?.attributes?.uri?.url;

    return {
      ...slide,
      image: buildFileUrl(rawUrl) || "/placeholder-image.svg",
    };
  });
}

// ------------------------------------
// GET ALL JOURNEYS FROM DRUPAL
// ------------------------------------
async function getJourneys(): Promise<{
  data: Journey[];
  included: any[];
}> {
  const res = await fetch(
    `${API_BASE_URL}/jsonapi/node/journey?include=field_journey_image.field_media_image,field_journey_tag,field_month`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch journeys");

    return {
      data: [],
      included: [],
    };
  }

  return res.json();
}

// ------------------------------------
// HOME
// ------------------------------------
export default async function Home() {
  const testimonialData = await getTestimonials();

  // Get ALL journeys
  const journeyData = await getJourneys();
  const homeHero = await getHomeHero();
  const journeyCards = await getJourneyCards();
  const heroSlides = await getHeroSlides();

  // ------------------------------------
  // ONLY POPULAR JOURNEYS
  // field_is_popular === true
  // ------------------------------------
  const popularJourneys: Journey[] = journeyData.data.filter(
    (journey: Journey) =>
      journey.attributes?.field_is_popular === true
  );

  return (
    <div>
      <SearchBar />

      {/* ONLY POPULAR JOURNEYS */}
      <PopularDestinations
  journeys={popularJourneys as any[]}
  included={journeyData.included as any[]}
  heroHeading={homeHero?.heading}
  heroDescription={homeHero?.description}
  heroSlides={heroSlides}
/>
      <JourneySection />

      <YourNextTrip initialJourneys={journeyCards} />

      <Index />

      <ContactInquiry />

      <ExperienceTravelSection />

      <TimingSection />

      <Map />

      <TestimonialSection testimonialData={testimonialData} />

      <TravelOStylePromise />

      <Footer />
    </div>
  );
}