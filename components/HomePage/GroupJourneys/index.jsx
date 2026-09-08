import { API_BASE_URL, buildFileUrl } from "@/lib/config";
import Journey from "./Journeys";
import ComingSoon from "@/components/ComingSoon";
function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, "").trim();
}

const INCLUDE =
  "field_journey_cards.field_journey_image.field_media_image,field_journey_cards.field_card_steps";
const PLACEHOLDER_IMAGE = "/placeholder-image.svg";

async function getFindYourFitBlock() {
  const res = await fetch(
    `${API_BASE_URL}/jsonapi/block_content/find_your_fit?include=${INCLUDE}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch Find Your Fit block");
    return null;
  }

  const { data = [], included = [] } = await res.json();
  return { block: data[0] || null, included };
}

function resolveImage(card, included) {
  const mediaId = card.relationships?.field_journey_image?.data?.id;
  const media = included.find((i) => i.type === "media--image" && i.id === mediaId);
  const fileId = media?.relationships?.field_media_image?.data?.id;
  const file = included.find((i) => i.type === "file--file" && i.id === fileId);
  const raw = file?.attributes?.uri?.url;

  return buildFileUrl(raw) || PLACEHOLDER_IMAGE;
}

function resolveSteps(card, included) {
  const stepRefs = card.relationships?.field_card_steps?.data || [];

  return stepRefs
    .map((ref, index) => {
      const step = included.find((i) => i.id === ref.id);
      if (!step) return null;

      return {
        id: index + 1,
        title: step.attributes?.field_step_title || "",
        desc: step.attributes?.field_step_description?.value || "",
      };
    })
    .filter(Boolean);
}

export default async function Index() {
  const result = await getFindYourFitBlock();

  if (!result?.block) return <ComingSoon label="Find Your Fit" />;

  const { block, included } = result;

  const heading = block.attributes.field_heading || "";
  const description = block.attributes.field_description?.value || "";

  const cardRefs = block.relationships?.field_journey_cards?.data || [];
  const journeyCards = cardRefs
    .map((ref) => {
      const card = included.find((i) => i.id === ref.id);
      if (!card) return null;

      const title = card.attributes?.field_card_title || "";

      return {
        id: card.id,
        title,
        imageSrc: resolveImage(card, included),
        imageQuote: card.attributes?.field_image_quote || "",
        description: card.attributes?.field_description?.value || "",
        steps: resolveSteps(card, included),
        btnText: card.attributes?.field_button_text || "",
        bgColor: card.attributes?.field_bg_color || "#F2E2DA",
        href: card.attributes?.field_href?.uri?.replace(/^internal:/, "") || "",
      };
    })
    .filter(Boolean);

  return (
    <div>
      <section className="w-full px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-[336px] md:max-w-none">
            <h2 className="text-[32px] leading-[40px] tracking-[0.05em] md:text-[54px] md:max-[1910px]:text-[54px] md:max-[1281px]:text-[41px] md:max-[1250px]:text-[40px] md:max-[1200px]:text-[39px] md:leading-tight md:tracking-normal font-semibold md:font-bold text-ink text-left md:text-center">
              {heading}
            </h2>

          <div
  className="mt-4 text-[16px] leading-[24px] tracking-[0.05em] md:text-[20px] md:max-[1910px]:text-[20px] md:max-[1281px]:text-[14px] md:leading-[26px] md:tracking-normal font-normal md:font-medium text-ink text-left md:text-center"
  dangerouslySetInnerHTML={{ __html: description }}
/>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-4 justify-center px-6">
      {journeyCards.map((journey, index) => (
        <Journey
          key={journey.id}
          title={journey.title}
          imageSrc={journey.imageSrc}
          imageQuote={journey.imageQuote}
          description={journey.description}
          steps={journey.steps}
          btnText={journey.btnText}
          bgColor={journey.bgColor}
          href={journey.href}
          defaultOpen={index === 1}
        />
      ))}
      </div>
    </div>
  );
}
