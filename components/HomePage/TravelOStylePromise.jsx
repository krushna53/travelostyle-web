import Image from "next/image";
import { API_BASE_URL, buildFileUrl } from "@/lib/config";
import ComingSoon from "@/components/ComingSoon";

const INCLUDE = "field_promise_items.field_icon.field_media_image";
const PLACEHOLDER_ICON = "/placeholder-image.svg";

async function getPromiseBlock() {
  const res = await fetch(
    `${API_BASE_URL}/jsonapi/block_content/travelostyle_promise?include=${INCLUDE}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch TravelOStyle Promise block");
    return null;
  }

  const { data = [], included = [] } = await res.json();
  return { block: data[0] || null, included };
}

function resolveIcon(item, included) {
  const mediaId = item.relationships?.field_icon?.data?.id;
  const media = included.find((i) => i.type === "media--image" && i.id === mediaId);
  const fileId = media?.relationships?.field_media_image?.data?.id;
  const file = included.find((i) => i.type === "file--file" && i.id === fileId);
  const raw = file?.attributes?.uri?.url;

  return buildFileUrl(raw) || PLACEHOLDER_ICON;
}

export default async function TravelOStylePromise() {
  const result = await getPromiseBlock();

  if (!result?.block) return <ComingSoon label="TravelOStyle Promise" />;

  const { block, included } = result;

  const heading = block.attributes.field_heading || "";
  const rawDescription = block.attributes.field_description?.value || "";

  // Split into two real paragraphs at "We truly believe...", regardless of
  // whether the CMS content already has separate <p> tags, so the mb-4 gap
  // between paragraphs is guaranteed to render.
  const splitMarker = /We truly believe/i;
  const splitMatch = rawDescription.match(splitMarker);
  let descriptionParagraphs;
  if (splitMatch) {
    const idx = splitMatch.index;
    const before = rawDescription.slice(0, idx).replace(/<\/?p[^>]*>/gi, "").trim();
    const after = rawDescription.slice(idx).replace(/<\/?p[^>]*>/gi, "").trim();
    descriptionParagraphs = [before, after].filter(Boolean);
  } else {
    descriptionParagraphs = [rawDescription.replace(/<\/?p[^>]*>/gi, "").trim()].filter(Boolean);
  }

  const itemRefs = block.relationships?.field_promise_items?.data || [];
  const promises = itemRefs
    .map((ref) => {
      const item = included.find((i) => i.id === ref.id);
      if (!item) return null;

      return {
        icon: resolveIcon(item, included),
        title: item.attributes?.field_item_title || "",
        bg: item.attributes?.field_bg_color || "#EFE5DE",
      };
    })
    .filter(Boolean);

  return (
    <section className="py-16 md:py-20 select-none overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1200px] px-6">
<div className="text-left md:text-center w-full mx-auto">
          <h2
  className="
    mx-auto
    w-full
    max-w-[336px]
    font-nohemi
    text-left
    text-[26px]
    leading-[32px]
    tracking-[0.05em]
    font-bold
    text-[#1A1A1A]

    md:max-w-[741px]
    md:text-center
    md:text-[38px]
    md:leading-[46px]
    md:tracking-normal
    md:font-bold
    md:text-[#1A1A1A]
  "
>
  {heading}
</h2>
     <div className="mx-auto w-full max-w-[339px] md:max-w-full">
  {/* Mobile: split into two paragraphs with a gap between them. */}
  <div
    className="
    mt-[25px]
      w-full
      max-w-full
      break-words
      font-nohemi
      text-left
      text-[15.5px]
      font-normal
      leading-[29px]
      tracking-[0.05em]
      text-[#1A1A1A]
      md:hidden
    "
  >
    {descriptionParagraphs.map((para, i) => (
      <p
        key={i}
        className={i < descriptionParagraphs.length - 1 ? "mb-4" : ""}
        dangerouslySetInnerHTML={{ __html: para }}
      />
    ))}
  </div>

  {/* Desktop: single continuous block, same as before — wraps naturally
      instead of being forced into two separate block elements. */}
  <div
    className="
    mt-[25px]
      hidden
      w-full
      font-nohemi
      md:mx-auto
      md:block
      md:max-w-[1000px]
      md:text-center
      md:text-[15px]
      md:leading-[24px]
      md:tracking-normal
      md:text-[#4A4A4A]
    "
    dangerouslySetInnerHTML={{ __html: rawDescription || "" }}
  />
</div>

        
        </div>
        <div className="mt-8 md:mt-16 flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 md:gap-8 max-[1910px]:md:gap-6 max-[1281px]:md:gap-5 max-[1250px]:md:gap-4 max-[1200px]:md:gap-3 max-w-[340px] md:max-w-none mx-auto">
          {promises.map((item, index) => {
            return (
              <div
                key={index}
                className="flex min-h-[130px] md:h-[145px] w-full md:w-[290px] flex-col items-center justify-center rounded-[6px] border-2 border-[#2f2d89] gap-2 p-5"
                style={{ backgroundColor: item.bg }}
              >
                <div className="relative w-[36px] h-[36px] md:w-[40px] md:h-[40px] flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt="Promise Icon"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>

                <p
                  className="whitespace-pre-line max-md:whitespace-normal font-nohemi text-center text-black text-[20px] leading-[25px] font-bold tracking-[0.03em] md:text-[20px] md:leading-[25px] md:tracking-normal md:font-bold"
                >
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
