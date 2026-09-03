"use client";

import { useEffect, useState } from "react";
import PopularRegionCard from "../PopularRegionCard";
import { API_BASE_URL, buildFileUrl } from "@/lib/config";

export default function PopularRegions() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRegions() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/jsonapi/taxonomy_term/region?sort=-drupal_internal__tid&include=field_region_image.field_media_image`,
        );

        const json = await res.json();
        const included = json.included || [];

        const regionData = (json.data || []).map((item) => {
          const mediaId = item.relationships?.field_region_image?.data?.id;

          const mediaEntity = included.find(
            (inc) => inc.type === "media--image" && inc.id === mediaId,
          );

          const fileId =
            mediaEntity?.relationships?.field_media_image?.data?.id;

          const fileEntity = included.find(
            (inc) => inc.type === "file--file" && inc.id === fileId,
          );

          const image =
            buildFileUrl(fileEntity?.attributes?.uri?.url) ||
            "/placeholder.jpg";

          return {
            id: item.id,
            title: item.attributes?.name || "",
            subtitle:
              item.attributes?.description?.processed ||
              item.attributes?.description?.value ||
              "",
            image,
          };
        });

        setRegions(regionData);
      } catch (err) {
        console.error("Region API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRegions();
  }, []);

  return (
    <div className="bg-white max-w-[1704px] mx-auto" style={{ paddingInline: "clamp(16px, 3.6vw, 69px)" }}>
      {" "}
      <h3 className="font-nohemi text-[#000000] font-semibold text-[21px] leading-[32px] tracking-[0.05em] mb-6 sm:mb-8 max-md:max-w-[244.13px] max-md:text-center max-md:mx-auto md:text-[24px] md:leading-[32px]">
        Explore some of our popular regions!
      </h3>
      {loading ? (
        <p className="text-sm text-[#757575]">Loading regions...</p>
      ) : (
        <PopularRegionCard regions={regions} />
      )}
    </div>
  );
}