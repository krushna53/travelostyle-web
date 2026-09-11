"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, buildFileUrl } from "@/lib/config";

export default function Region() {
  const router = useRouter();

  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadRegions() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/jsonapi/taxonomy_term/region?sort=-drupal_internal__tid&include=field_region_image.field_media_image`
        );

        const json = await res.json();

        const included = json.included || [];

        const regionData = (json.data || []).map((item) => {
          const mediaId =
            item.relationships?.field_region_image?.data?.id;

          const mediaEntity = included.find(
            (inc) =>
              inc.type === "media--image" &&
              inc.id === mediaId
          );

          const fileId =
            mediaEntity?.relationships?.field_media_image?.data?.id;

          const fileEntity = included.find(
            (inc) =>
              inc.type === "file--file" &&
              inc.id === fileId
          );

          const image =
            buildFileUrl(fileEntity?.attributes?.uri?.url) ||
            "/placeholder.jpg";

          return {
            id: item.id,
            name: item.attributes?.name || "",
            description:
              item.attributes?.description?.processed ||
              item.attributes?.description?.value ||
              "",
            image,
          };
        });

        console.log("Regions:", regionData);

        setRegions(regionData);
      } catch (err) {
        console.error("Region API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRegions();
  }, []);
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-16">
        Loading regions...
      </section>
    );
  }


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
      <div className="mb-8 md:mb-12 flex flex-col items-start min-[500px]:items-center min-[500px]:mx-auto text-left min-[500px]:text-center">
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
  font-nohemi
  w-full
  max-w-[339px] min-[500px]:max-w-[460px] md:max-w-[646px]
  min-[500px]:mx-auto
  mt-4 md:mt-2
  md:px-4
  font-normal
  text-[18px]
  text-left min-[500px]:text-center
  leading-[24px] md:leading-[32px]
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
  className="group relative cursor-pointer overflow-hidden rounded-[10px] w-full h-[332px] md:h-auto md:aspect-square"
>

            <img
              src={region.image}
              alt={region.name}
              className="
    absolute inset-0
    w-full
    h-full
    object-cover
  "
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
                <p
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