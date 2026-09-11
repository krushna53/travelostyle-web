"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

export default function PopularRegionCard({regions}) {
  const router = useRouter();

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {regions.map((region) => (
          <div
            key={region.id}
            className="group relative h-[380px] sm:h-[400px] rounded-xl overflow-hidden shadow-sm border-2 border-[#455868] cursor-pointer"
          >
            <Image
              src={region.image}
              alt={region.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

            <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between text-white z-10">
          
              <div>
                <h4 className="text-[5vw] sm:text-3xl font-semibold tracking-normal">
                  {region.title}
                </h4>
              </div>

              <div className="space-y-2.5">
                <p
                  className="text-sm sm:text-[15px] text-white tracking-wide drop-shadow-sm leading-snug"
                  dangerouslySetInnerHTML={{ __html: region.subtitle }}
                />

                <div className="w-full h-[1.5px] bg-white/90" />
                <div className="pt-1">
                  <button
                    onClick={() =>
                      router.push(
                        `/itinerary?region=${encodeURIComponent(region.title)}`,
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
  );
}