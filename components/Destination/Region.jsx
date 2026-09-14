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
    <section
      className="
  mx-auto py-16 w-full
  max-w-[1920px]
  px-4
  lg:px-[58px]
  xl:px-[73px]
  min-[1366px]:px-[78px]
  min-[1440px]:px-[82px]
  min-[1920px]:px-[140px]
"
    >
      <div className="mb-8 md:mb-[3rem] flex flex-col items-start min-[500px]:items-center min-[500px]:mx-auto text-left min-[500px]:text-center">
        <h2 className="
  w-full
  max-w-[338px] min-[500px]:max-w-none md:max-w-[792px]
  min-[500px]:mx-auto
  font-semibold md:font-bold
  text-[32px] min-[500px]:text-[26px] md:text-[48px]
  leading-[40px] min-[500px]:leading-[32px] md:leading-[80px]
  tracking-[0.05em] md:tracking-normal
  text-left min-[500px]:text-center
  whitespace-normal min-[500px]:whitespace-nowrap md:whitespace-normal
">
          Where are you headed to next?
        </h2>
        <p className="
  font-[Nohemi]
  w-full
  max-w-[339px] min-[500px]:max-w-[460px] md:max-w-[646px]
  min-[500px]:mx-auto
  mt-4 md:mt-2
  md:px-4
  font-normal
  text-[18px]
  text-left min-[500px]:text-center
  leading-[28px] md:leading-[32px]
  tracking-[0.05em] md:tracking-normal
  text-[#000000]
">
          Begin with the part of the world that’s calling to you and narrow from there.
          Or wander freely. Either approach works.
        </p>
      </div>

      <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {regions.map((region) => (
         <div
  key={region.id}
  className="group relative w-full max-w-[336px] mx-auto md:max-w-none aspect-square rounded-[10px] overflow-hidden shadow-sm border-2 border-[#1A1A1A] cursor-pointer"
>

            <Image
              src={region.image}
              alt={region.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

            <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between text-white z-10">
              <div>
                <h4 className="text-[22px] sm:text-[26px] lg:text-[28px] font-semibold tracking-normal">
                  {region.name}
                </h4>
              </div>

              <div className="space-y-2.5">
                <p
                  className="text-sm sm:text-[15px] text-white tracking-wide drop-shadow-sm leading-snug"
                  dangerouslySetInnerHTML={{
                    __html: region.description,
                  }}
                />

                <div className="w-full h-[1.5px] bg-white/90" />
                <div className="pt-1">
                  <button
                    onClick={() =>
                      router.push(
                        `/itinerary?region=${encodeURIComponent(region.name)}`
                      )
                    }
                    className="bg-white text-[#3c4082] text-xs sm:text-sm font-bold px-5 py-1.5 rounded-full hover:bg-gray-100 transition-colors shadow-md"
                  >
                    Explore Journeys
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

}