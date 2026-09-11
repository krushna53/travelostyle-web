"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

// `regions` is fetched server-side (see app/destination/page.jsx +
// lib/regions.js) and handed down as a prop — this used to fetch it itself
// in a useEffect, which ran in the browser and always failed against the
// ddev backend's self-signed cert (ERR_CERT_AUTHORITY_INVALID). The
// server's fetch honors NODE_TLS_REJECT_UNAUTHORIZED, so doing it there
// works.
export default function Region({ regions = [] }) {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 py-16">
      <div className="mb-8 md:mb-12 flex flex-col items-start md:items-center">
        <h2 className="
  w-full
  max-w-[338px] md:max-w-[792px]
  font-semibold md:font-bold
  text-[32px] md:text-[48px]
  leading-[40px] md:leading-[80px]
  tracking-[0.05em] md:tracking-normal
">
          Where are you headed to next?
        </h2>
        <p className="
  font-nohemi
  w-full
  max-w-[339px] md:max-w-[646px]
  mt-4 md:mt-2
  md:px-4
  font-normal
  text-[16px]
  text-left md:text-center
  leading-[24px] md:leading-[32px]
  tracking-[0.05em] md:tracking-normal
  text-[#000000]
">
          Begin with the part of the world that’s calling to you and narrow from there.
          Or wander freely. Either approach works.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 md:px-4 md:px-0">
        {regions.map((region) => (
         <div
  key={region.id}
  className="group relative cursor-pointer overflow-hidden rounded-[10px] w-full max-w-[336px] h-[332px] md:h-[402px] mx-auto border-2 border-[#1A1A1A] md:max-w-none md:border-0"
>

            <Image
              src={region.image}
              alt={region.name}
              fill
              className="object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6 text-white">
              {/* Title */}
              <h3 className="font-[Nohemi] font-semibold text-[21px] md:text-[32px] leading-[32px] md:leading-[40px] tracking-[0.05em] md:tracking-normal text-[#FAFAFA]">
                {region.name}
              </h3>

              {/* Bottom Content */}
              <div>
                <div
                  className="text-[16px] md:text-[14px] leading-[24px] md:leading-[20px] font-semibold md:font-normal tracking-[0.05em] md:tracking-normal text-[#FAFAFA] md:opacity-95"
                  dangerouslySetInnerHTML={{
                    __html: region.description,
                  }}
                />

                <div className="mt-3 h-[2px] md:h-[1px] w-full bg-[#FAFAFA] md:bg-white/60" />

                <button
                  onClick={() =>
                    router.push(
                      `/itinerary?region=${encodeURIComponent(region.name)}`
                    )
                  }
                  className="
    mt-3 rounded-full bg-[#FAFAFA]
    h-[35px] w-[194px] md:h-auto md:w-auto
    px-3 py-1.5 md:px-4 md:py-2
    text-[16px] md:text-[12px]
    leading-[32px] md:leading-normal
    tracking-[0.05em] md:tracking-normal
    font-semibold text-[#2C3078]
    flex items-center justify-center
  "
                >
                  Explore Journeys
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

}