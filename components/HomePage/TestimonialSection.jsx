"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Image from "@/components/SafeImage";
import { API_BASE_URL } from "@/lib/config";

function capitalizeFirst(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getInitials(name) {
  const words = (name || "").split(/\s+|&/).filter((w) => /^[a-z]/i.test(w));
  if (!words.length) return "T";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// Shown when a testimonial has no photo: the guest's initials on a soft
// brand-toned background, instead of a generic stock icon.
function TestimonialAvatar({ image, name, sizes }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        fill
        sizes={sizes}
        className="object-cover"
      />
    );
  }
  return (
    <div
      aria-label={name}
      role="img"
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#f3ebe4]"
    >
      <span className="font-nohemi font-light text-[#4c4b75] text-[64px] max-[1281px]:text-[48px] leading-none tracking-[0.12em]">
        {getInitials(name)}
      </span>
      <span className="mt-4 h-px w-10 bg-[#4c4b75]/40" />
    </div>
  );
}

// Clamps a long quote to a few lines (matching the Figma layout) and shows a
// "Read more" button, only when the text actually overflows, that opens the
// full testimonial in a popup.
function ClampedQuote({ text, lines, className, onReadMore }) {
  const ref = useRef(null);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div>
      <p
        ref={ref}
        className={className}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: lines,
          overflow: "hidden",
        }}
      >
        {text}
      </p>
      {overflows && (
        <button
          type="button"
          onClick={onReadMore}
          aria-haspopup="dialog"
          className="mt-3 cursor-pointer font-nohemi text-[14px] min-[1281px]:text-[16px] font-medium tracking-[0.05em] text-[#4c4b75] underline underline-offset-4 decoration-[#4c4b75]/40 hover:decoration-[#4c4b75]"
        >
          Read more
        </button>
      )}
    </div>
  );
}

function TestimonialModal({ testimonial, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Testimonial from ${testimonial.name}`}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[calc(100vh-32px)] w-full max-w-[880px] flex-col overflow-y-auto rounded-[10px] border-2 border-[#1A1A1A] bg-[#FAFAFA] p-6 md:p-10 shadow-[5px_10px_24px_rgba(26,26,26,0.1)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 md:top-4 md:right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[22px] leading-none text-[#1A1A1A] hover:bg-black/5"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="self-center md:self-start border border-[#4c4b75] bg-white p-[8px] shadow-[3px_3px_10px_rgba(0,0,0,0.06)] shrink-0">
            <div className="relative w-[160px] h-[160px] md:w-[200px] md:h-[200px]">
              <TestimonialAvatar
                image={testimonial.image}
                name={testimonial.name}
                sizes="200px"
              />
            </div>
            <p className="mt-2 text-[13px] font-bold text-[#111111] tracking-tight">
              {testimonial.name}
            </p>
          </div>

          <div className="relative flex-1 pt-8 pb-8">
            <span className="absolute left-0 top-0">
              <div className="relative w-[37px] h-[26px]">
                <Image
                  src="/RightQuote.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </span>
            <p className="font-nohemi text-[#2b2b2b] leading-[1.7] tracking-[0.02em] text-[15px] md:text-[18px] whitespace-pre-line">
              {testimonial.quote}
            </p>
            <span className="absolute right-0 bottom-0">
              <div className="relative w-[37px] h-[26px]">
                <Image
                  src="/LeftQuote.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function TestimonialSection({
  testimonialData,
  desktopHeading = "Hear from those who’ve travelled with us",
}) {
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
      : null;

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
  const [openTestimonial, setOpenTestimonial] = useState(null);
  const closeTestimonial = useCallback(() => setOpenTestimonial(null), []);

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
      <div className="mx-auto w-full px-4 max-[1200px]:max-w-[85vw] min-[1281px]:max-w-[1230px] min-[1440px]:max-w-[1250px] min-[1600px]:max-w-[1320px] min-[1900px]:max-w-[1455px]">
        <h2 className="mb-12 md:hidden text-left font-serif italic text-[40px] text-[#1A1A1A] tracking-[0.05em] font-taprom font-normal max-md:mx-auto max-md:leading-[48px]">
          Hear from those who&apos;ve travelled with us
        </h2>
        <h2 className="hidden md:block mb-12 md:mb-24 text-center font-serif italic text-[64px] min-[1024px]:text-[42px] min-[1281px]:text-[48px] min-[1440px]:text-[52px] min-[1600px]:text-[58px] min-[1919px]:text-[64px] text-[#2d2d2d] tracking-wide font-taprom font-normal">
          {desktopHeading || "Hear from those who’ve travelled with us"}
        </h2>

        <div className="hidden md:flex items-center justify-between gap-4 max-w-5xl min-[1281px]:max-w-[1200px] min-[1440px]:max-w-[1250px] min-[1600px]:max-w-[1320px] min-[1919px]:max-w-[1411px] mx-auto">
          <button
            onClick={handlePrev}
            className="cursor-pointer transition active:scale-95 shrink-0"
          >
            <Image src="/LeftArrow.svg" alt="Previous" height={24} width={56} />
          </button>

          <div className="flex flex-row items-center gap-12 max-w-3xl w-full mx-6 min-[1281px]:max-w-[900px] min-[1440px]:max-w-[1000px] min-[1600px]:max-w-[1100px] min-[1919px]:max-w-[1200px] mx-auto">
            <div className="border border-[#4c4b75] bg-white p-[10px] shadow-[3px_3px_10px_rgba(0,0,0,0.06)] shrink-0">
              <div className="relative w-[317px] max-[1910px]:w-[315px] max-[1281px]:w-[211px] max-[1250px]:w-[206px] max-[1200px]:w-[198px] h-[317px] max-[1910px]:h-[315px] max-[1281px]:h-[211px] max-[1250px]:h-[206px] max-[1200px]:h-[198px] min-w-[150px] min-h-[150px]">
                <TestimonialAvatar
                  image={current.image}
                  name={current.name}
                  sizes="317px"
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

              <ClampedQuote
                key={current.id}
                text={current.quote}
                lines={4}
                onReadMore={() => setOpenTestimonial(current)}
                className="text-[#2b2b2b] leading-[1.6] min-h-[60px] text-[16px] min-[1024px]:text-[18px] min-[1281px]:text-[21px] min-[1440px]:text-[24px] min-[1600px]:text-[28px] min-[1919px]:text-[32px]"
              />

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
                <div className="border-[2px] border-[#2f2d89] rounded-[6px] bg-white p-3">
                  <div className="relative w-full h-[180px]">
                    <TestimonialAvatar
                      image={item.image}
                      name={item.name}
                      sizes="240px"
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

                  <ClampedQuote
                    text={item.quote}
                    lines={6}
                    onReadMore={() => setOpenTestimonial(item)}
                    className="w-full max-w-[220px] pt-2 font-nohemi text-[14px] font-normal leading-[24px] tracking-[0.05em] text-[#1A1A1A]"
                  />

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

      {openTestimonial && (
        <TestimonialModal
          testimonial={openTestimonial}
          onClose={closeTestimonial}
        />
      )}
    </section>
  );
}
