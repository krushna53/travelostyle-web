"use client";

import { useState } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/config";

function capitalizeFirst(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function TestimonialSection({ testimonialData }) {
  const testimonials = (testimonialData?.data || []).map((item) => {
    const included = testimonialData?.included || [];

    // IMAGE
    const imageId = item.relationships?.field_testimonial_image?.data?.id;

    const media = included.find(
      (inc) => inc.type === "media--image" && inc.id === imageId,
    );

    const fileId = media?.relationships?.field_media_image?.data?.id;

    const file = included.find(
      (inc) => inc.type === "file--file" && inc.id === fileId,
    );

    const imageUrl = file?.attributes?.uri?.url
      ? `${API_BASE_URL}${file.attributes.uri.url}`
      : "/Morocco.svg";

    // NAME
    const name =
      item.attributes?.field_testimonial_name || item.attributes?.title || "";

    // QUOTE
    const attributes = item.attributes || {};

    let quote = "";

    const possibleFields = [
      "field_testimonial_description",
      "field_testimonial_content",
      "field_description",
      "field_content",
      "body",
    ];

    for (const field of possibleFields) {
      const value = attributes[field];

      if (!value) continue;

      if (typeof value === "string") {
        quote = value;
        break;
      }

      if (value.processed) {
        quote = value.processed;
        break;
      }

      if (value.value) {
        quote = value.value;
        break;
      }
    }

    quote = quote
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\u00a0/g, " ")
      .trim();

    return {
      id: item.id,
      name: capitalizeFirst(name),
      image: imageUrl,
      quote: capitalizeFirst(quote),
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials.length) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-8 md:py-20 select-none overflow-hidden">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 md:mb-24 text-left md:text-center font-serif italic text-[40px] md:text-[38px] text-[#1A1A1A] md:text-[#2d2d2d] tracking-[0.05em] md:tracking-wide font-taprom font-normal max-md:max-w-[326px] max-md:mx-auto max-md:leading-[48px]">
          Hear from those who&apos;ve travelled with us 
        </h2>

        <div className="hidden md:flex items-center justify-between gap-4 max-w-5xl mx-auto">
          <button
            onClick={handlePrev}
            className="cursor-pointer transition active:scale-95 shrink-0"
          >
            <Image src="/LeftArrow.svg" alt="Previous" height={24} width={56} />
          </button>

          <div className="flex flex-row items-center gap-12 max-w-3xl w-full mx-6">
            <div className="card-scallop-bottom border border-[#4c4b75] bg-white p-[10px] shadow-[3px_3px_10px_rgba(0,0,0,0.06)] shrink-0">
              <div className="relative w-[317px] max-[1910px]:w-[315px] max-[1281px]:w-[211px] max-[1250px]:w-[206px] max-[1200px]:w-[198px] h-[317px] max-[1910px]:h-[315px] max-[1281px]:h-[211px] max-[1250px]:h-[206px] max-[1200px]:h-[198px] min-w-[150px] min-h-[150px]">
                <Image
                  src={current.image}
                  alt={current.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-[13px] font-bold text-[#111111] tracking-tight">
                {current.name}
              </p>
            </div>

            <div className="relative flex-1 py-4 px-10">
              <span className="absolute -left-5 top-[-8px]">
                <div className="relative w-[56px] max-[1910px]:w-[55px] max-[1281px]:w-[37px] max-[1250px]:w-[36px] max-[1200px]:w-[35px] h-[39px] max-[1281px]:h-[26px] max-[1200px]:h-[25px] min-w-[25px] min-h-[18px]">
                  <Image
                    src="/RightQuote.svg"
                    alt="Quote Start"
                    fill
                    className="object-cover"
                  />
                </div>
              </span>

              <p className="text-[#2b2b2b] leading-[1.6] min-h-[60px] text-[16px]">
                {current.quote}
              </p>

              <span className="absolute -right-4 bottom-0">
                <div className="relative w-[56px] max-[1910px]:w-[55px] max-[1281px]:w-[37px] max-[1250px]:w-[36px] max-[1200px]:w-[35px] h-[39px] max-[1281px]:h-[26px] max-[1200px]:h-[25px] min-w-[25px] min-h-[18px]">
                  <Image
                    src="/LeftQuote.svg"
                    alt="Quote End"
                    fill
                    className="object-cover"
                  />
                </div>
              </span>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="cursor-pointer transition active:scale-95 shrink-0"
          >
            <Image src="/RightArrow.svg" alt="Next" height={24} width={56} />
          </button>
        </div>

        <div className="md:hidden overflow-x-scroll overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-4 px-4 items-start">
            {testimonials.map((item) => (
              <div key={item.id} className="snap-start shrink-0 w-[240px]">
                <div className="card-scallop-bottom border-[2px] border-[#2f2d89] rounded-[6px] bg-white p-3">
                  <div className="relative w-full h-[180px]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <p className="mt-3 text-[13px] font-bold text-[#111111]">
                    {item.name}
                  </p>
                </div>

                <div className="relative mt-8">
                  <span className="absolute -top-6 left-0">
                    <div className="relative w-[24px] h-[16.97px]">
                      <Image
                        src="/RightQuote.svg"
                        alt=""
                        fill
                        className="object-contain opacity-100"
                      />
                    </div>
                  </span>

                  <p className="w-full max-w-[220px] pt-2 font-nohemi text-[14px] font-normal leading-[24px] tracking-[0.05em] text-[#1A1A1A]">
                    {item.quote}
                  </p>

                  <span className="absolute -bottom-6 md:-bottom-4 right-0">
                    <div className="relative w-[24px] h-[16.97px]">
                      <Image
                        src="/LeftQuote.svg"
                        alt=""
                        fill
                        className="object-contain opacity-100"
                      />
                    </div>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
