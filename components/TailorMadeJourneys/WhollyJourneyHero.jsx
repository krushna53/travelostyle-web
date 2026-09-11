import { getBlock, resolveMediaImage } from "@/lib/blockContent";
import CraftJourneyButton from "../CraftJourneyButton";

const PLACEHOLDER_IMAGE = "/placeholder-image.svg";

// Drupal sends field_description as rich text — the tailor-made hero copy is
// authored as two <p> blocks. Stripping the tags outright would run the
// sentences together ("...outward from there.That's what..."), so break on the
// block-level tags first and keep the paragraphs separate, per the design.
function stripHtmlToParagraphs(html) {
  return (html || "")
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|div|h[1-6]|li)\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function getTailorMadeHero() {
  const result = await getBlock("page_hero", "field_image.field_media_image", {
    filter: { field_page_key: "tailormade" },
    revalidate: 60,
  });
  if (!result?.block) return null;
  const { block, included } = result;
  return {
    heading: block.attributes?.field_heading || "",
    paragraphs: stripHtmlToParagraphs(block.attributes?.field_description?.value || ""),
    image: resolveMediaImage(block, included, "field_image"),
  };
}

export default async function WhollyJourneyHero() {
  const hero = await getTailorMadeHero();
  const heading = hero?.heading || "Coming Soon";
  const paragraphs = hero?.paragraphs || [];
  const image = hero?.image || PLACEHOLDER_IMAGE;

  return (
    <section className="relative w-full h-[600px] min-[768px]:h-[680px] min-[1024px]:h-[520px] min-[1400px]:h-[620px] min-[1600px]:h-[700px] min-[1920px]:h-[800px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt="Safari Journey Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30 md:bg-black/25" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[1704px]" style={{ paddingInline: "clamp(16px, 3.6vw, 69px)" }}>
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-[45px] font-bold leading-[1.1] mb-6 tracking-normal drop-shadow-md">
            {heading}
          </h1>

          <div className="flex flex-col gap-y-5 text-base lg:text-[18px] text-white/95 font-normal leading-snug drop-shadow">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 sm:mt-10">
              <CraftJourneyButton />
          </div>
        </div>
      </div>

      {/* Per Figma: Nohemi 400, 14px/28px, 5% tracking, #FAFAFA, bottom-right
          over the hero image. leading-trim CAP_HEIGHT has no CSS equivalent,
          so the 28px line-height carries the vertical rhythm as authored. */}
      <div className="absolute bottom-4 right-6 z-10">
        <span className="font-[Nohemi] text-[14px] font-normal leading-[28px] tracking-[0.05em] text-[#FAFAFA] drop-shadow-sm">
          Images are only for representation purposes
        </span>
      </div>
    </section>
  );
}
