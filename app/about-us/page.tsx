import SearchBar from "../../components/HomePage/FindYourJourney/SearchBar";
import Hero from "../../components/AboutUs/Hero";
import OriginStory from "../../components/AboutUs/OriginStory";
import TravelBetter from "../../components/AboutUs/TravelBetter";
import TravelExperience from "../../components/AboutUs/TravelExperience";
import LetsFindOut from "../../components/AboutUs/LetsFindOut";
import Footer from "../../components/Footer";
import TestimonialSection from "../../components/HomePage/TestimonialSection";

import { API_BASE_URL } from "@/lib/config";
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

export default async function AboutUs() {
   const testimonialData = await getTestimonials();
  return (
    <div className="bg-[#F9F9F9] lg:bg-white min-h-screen">
      <div className="border-b-2 border-[#2C3078]">
      <SearchBar />
      </div>
      <Hero />
      <OriginStory />
      <TravelBetter />
      <TravelExperience />
      <TestimonialSection
        testimonialData={testimonialData}
        heading="What are guests remember"
      />
      <LetsFindOut />
      <Footer />
    </div>
  );
}