"use client";

import { API_BASE_URL, buildFileUrl } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PLACEHOLDER_IMAGE = "/placeholder-image.svg";

export default function PopularDestinations({
  journeys,
  // included,
  heroHeading,
  heroDescription,
}) {
  const router = useRouter();
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  
  useEffect(() => {
    async function fetchSlideData() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/jsonapi/node/hero_slide?include=field_hero_banner_image`,
          {
            method: "GET",
            headers: {
              Accept: "application/vnd.api+json",
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch hero slides: ${response.statusText}`,
          );
        }

        const data = await response.json();
        const included = data?.included || [];

        const resolvedSlides = (data?.data || []).map((slide) => {
          const fileId = slide.relationships?.field_hero_banner_image?.data?.id;

          const fileEntity = included.find(
            (inc) => inc.type === "file--file" && inc.id === fileId,
          );

          const rawUrl = fileEntity?.attributes?.uri?.url;

          return {
            ...slide,
            image: buildFileUrl(rawUrl) || PLACEHOLDER_IMAGE,
          };
        });

        setSlides(resolvedSlides);
      } catch (error) {
        console.error("Error fetching hero slide data:", error);
      }
    }

    fetchSlideData();
  }, []);

  const currentSlide = slides[currentSlideIndex];
  const slideAttributes = currentSlide?.attributes;

  const heading = slideAttributes?.title || heroHeading || "Coming Soon";
  const btnExplorePopular =
    slideAttributes?.field_button_text || "Explore Popular Destinations";
  const description =
    slideAttributes?.field_description || heroDescription || "";
  const rawUri = slideAttributes?.field_button_link?.uri || "";
  const isExternal = rawUri.startsWith("http");
  const formattedLink = isExternal ? rawUri : rawUri.replace(/^internal:/, "");

  return (
    <div className="relative md:h-[700px]">
      {/* MOBILE */}
      <div className="block md:hidden bg-[#F6F6F6]">
        <div className="relative overflow-hidden">
          <img
            src={currentSlide?.image || PLACEHOLDER_IMAGE}
            alt={currentSlide?.attributes?.title || "travel"}
            className="h-[600px] w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute top-16 left-5 right-5 z-10">
            <h2 className="text-white text-[24px] leading-[30px] font-bold max-w-[240px]">
              {/* Your Next Journey Awaits */}
              {heading}dqw
            </h2>

            <p className="mt-4 text-white text-[14px] leading-[22px] max-w-[260px]">
              {/* We have mapped the route, sourced the stays, and scaled the
              details — all you have to do is show up. */}
              {description}
            </p>

            {/* <p className="mt-4 text-white text-[14px] leading-[22px] max-w-[250px]">
              Live your next story with TravelOStyle.
            </p> */}

         <div className="mt-5"> 
            {isExternal ? (
              <a
                href={formattedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-[#2E2787]"
              >
                {btnExplorePopular}
              </a>
            ) : (
              <Link
                href={formattedLink}
                className="mt-5 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-[#2E2787]"
              >
                {btnExplorePopular}
              </Link>
            )}
            </div>
          </div>

          <div className="absolute bottom-12 left-5 right-5 z-10 flex flex-col gap-3">
            <p className="text-[12px] text-white">
              {slideAttributes?.field_location_label}
            </p>

            <div className="h-[1px] w-full bg-white/80" />
          </div>

          <div className="absolute bottom-4 left-5 right-5 z-10 flex items-center justify-between">
            <button
              onClick={() => {
                if (slides.length > 0) {
                  setCurrentSlideIndex((prev) =>
                    prev === 0 ? slides.length - 1 : prev - 1,
                  );
                }
              }}
            >
              <Image
                src="/WhiteLeftArrow.svg"
                alt="Previous"
                width={42}
                height={42}
              />
            </button>

            <button
              onClick={() => {
                if (slides.length > 0) {
                  setCurrentSlideIndex((prev) =>
                    prev === slides.length - 1 ? 0 : prev + 1,
                  );
                }
              }}
            >
              <Image
                src="/WhiteRightArrow.svg"
                alt="Next"
                width={42}
                height={42}
              />
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block relative h-[720px]">
        <img
          src={currentSlide?.image || PLACEHOLDER_IMAGE}
          alt={currentSlide?.attributes?.title || "travel"}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative h-[700px]">
          <div className="absolute top-[170px] left-[4vw] z-10 max-w-[560px]">
            <h1 className="text-white text-[40px] font-semibold leading-[40px]">
              {heading}
            </h1>

            <p className="mt-6 text-white/90 text-[14px] leading-[24px] max-w-[400px]">
              {description}
            </p>
            {isExternal ? (
              <a
                href={formattedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-[#2E2787]"
              >
                {btnExplorePopular}
              </a>
            ) : (
              <Link
                href={formattedLink}
                className="mt-5 inline-block rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-[#2E2787]"
              >
                {btnExplorePopular}
              </Link>
            )}
          </div>

          <div className="absolute bottom-[110px] left-[70px] right-[70px] z-10">
            <p className="text-[12px] text-white">
              {slideAttributes?.field_location_label}
            </p>

            <div className="h-[1px] w-full bg-white/70" />
          </div>

          <div className="absolute bottom-[70px] left-[70px] z-10 flex items-center gap-4">
            <button
              onClick={() => {
                if (slides.length > 0) {
                  setCurrentSlideIndex((prev) =>
                    prev === 0 ? slides.length - 1 : prev - 1,
                  );
                }
              }}
            >
              <Image
                src="/WhiteLeftArrow.svg"
                alt="Previous"
                width={42}
                height={42}
              />
            </button>

            <button
              onClick={() => {
                if (slides.length > 0) {
                  setCurrentSlideIndex((prev) =>
                    prev === slides.length - 1 ? 0 : prev + 1,
                  );
                }
              }}
            >
              <Image
                src="/WhiteRightArrow.svg"
                alt="Next"
                width={42}
                height={42}
              />
            </button>
          </div>

          <div className="absolute bottom-[10px] right-[70px] z-10 flex flex-col items-end gap-3">
            <p className="text-[11px] text-white/70">
              {slideAttributes?.field_tagline ||
                "Images are only for representation purposesss"}
            </p>
            <button
              onClick={() => router.push("/comparison")}
              className="mb-5 hidden md:flex box-border h-[47px] w-[210px] items-center justify-center gap-[10px] rounded-[10px] border-2 border-white bg-[#2E2787] px-[24px] py-[16px] text-white transition-colors hover:bg-[#3B33A0]"
            >
              <span className="h-[15px] w-[162px] whitespace-nowrap text-center text-[15px] leading-[15px] font-semibold">
                Compare Trips
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
