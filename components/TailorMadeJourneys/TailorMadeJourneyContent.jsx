import { getBlock, resolveMediaImage, resolveRefs } from "@/lib/blockContent";
import Index from "./Index";
import WhollyJourneyHero from "./WhollyJourneyHero";

const MATRIX_INCLUDE = "field_features.field_image.field_media_image,field_matrix_rows";
const STEPS_INCLUDE = "field_steps";

const PLACEHOLDER_IMAGE = "/placeholder-image.svg";

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

function mapMatrix(result) {
  if (!result?.block) return null;
  const { block, included } = result;

  const features = resolveRefs(block, included, "field_features").map((f) => ({
    imgUrl: resolveMediaImage(f, included, "field_image") || PLACEHOLDER_IMAGE,
    description: stripHtml(f.attributes?.field_description?.value || ""),
  }));

  const matrixRows = resolveRefs(block, included, "field_matrix_rows").map((r) => ({
    label: r.attributes?.field_label || "",
    text: stripHtml(r.attributes?.field_text?.value || ""),
  }));

  return {
    badgeText: block.attributes?.field_badge_text || "",
    titleText: stripHtml(block.attributes?.field_title_text?.value || ""),
    topIntroText: stripHtml(block.attributes?.field_top_intro_text?.value || ""),
    footerText: stripHtml(block.attributes?.field_footer_text?.value || ""),
    features,
    matrixRows,
  };
}

function mapBookingSteps(result) {
  if (!result?.block) return null;
  const { block, included } = result;

  const steps = resolveRefs(block, included, "field_steps").map((s) => ({
    number: s.attributes?.field_step_number || "",
    title: s.attributes?.field_step_title || "",
    description: s.attributes?.field_step_description?.value || "",
    bgColor: s.attributes?.field_bg_color || "#ffffff",
  }));

  return {
    subheading: block.attributes?.field_subheading || "",
    mainHeading: block.attributes?.field_heading || "",
    steps,
  };
}

export default async function TailorMadeJourneyContent() {
  const [matrixResult, stepsResult] = await Promise.all([
    getBlock("journey_type_matrix", MATRIX_INCLUDE, {
      filter: { field_journey_type: "tailormade" },
      // This is the Drupal section titled "Journeys made to fit your idea of
      // travel"; don't hold CMS edits in Next's default one-hour data cache.
      revalidate: 0,
    }),
    getBlock("booking_steps", STEPS_INCLUDE, {
      filter: { field_journey_type: "tailormade" },
    }),
  ]);

  return (
    <Index
      matrixContent={mapMatrix(matrixResult)}
      bookingStepsContent={mapBookingSteps(stepsResult)}
      hero={<WhollyJourneyHero />}
    />
  );
}
