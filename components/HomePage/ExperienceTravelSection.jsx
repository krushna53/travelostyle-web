import Image from "next/image";
import { getBlock, resolveRefs } from "@/lib/blockContent";
import ComingSoon from "@/components/ComingSoon";

const INCLUDE = "field_cards";

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

async function getExperienceTravelContent() {
  const result = await getBlock("experience_travel", INCLUDE, { revalidate: 60 });
  if (!result?.block) return null;

  const { block, included } = result;

  const heading = block.attributes?.field_heading || "";
  const description = block.attributes?.field_description?.value || "";
  const [paragraph1 = "", paragraph2 = ""] = description
    .split(/<\/p>\s*<p[^>]*>/i)
    .map(stripHtml);

  const cards = resolveRefs(block, included, "field_cards").map((card) => ({
    title: card.attributes?.field_card_title || "",
    desc: stripHtml(card.attributes?.field_card_description?.value || ""),
    stars: card.attributes?.field_star_count || 0,
  }));

  if (!heading || cards.length === 0) return null;

  return { heading, paragraph1, paragraph2, cards };
}

// The Figma design only highlights the first clause of the heading — the
// "with <brand>" tail stays plain. The brand name is data-driven, so split
// on " with " rather than hardcoding "TravelOStyle".
function splitHeading(heading) {
  const match = heading.match(/^(.*?)(\s+with\s+.+)$/i);
  return match ? [match[1], match[2]] : [heading, ""];
}


export default async function ExperienceTravelSection() {
  const content = await getExperienceTravelContent();
  if (!content) return <ComingSoon label="Experience Travel" />;
  const { heading, paragraph1, paragraph2, cards } = content;
  const [highlightedHeading, plainHeading] = splitHeading(heading);

  return (
    <section className="w-full px-6 py-16 md:px-14 max-md:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 max-md:max-w-[390px] max-md:gap-8">
        
        {/* 556 is the board's copy column: 1.116x the 498px peach rect beside
            it, which is the ratio the board draws (578 against 518). It is the
            width at which paragraph one falls into the board's four lines
            instead of five with an orphaned "life." -- but the copy comes from
            the CMS, so this is a column width, not a per-string tune. */}
        <div className="max-w-[556px]">
          {/* Taprom 42/80/5% on the board, stepping down the same ratios the
              rest of the page uses. The peach rect is drawn by
              .hero-bar-experience, which needs the 1.9048 leading to land.

              Each highlighted clause is its own inline-block so the rect
              shrink-wraps the WORDS: the old line one put .sub-title-bg on the
              full-width <div>, which on mobile stretched the peach across the
              whole column and on desktop swallowed the trailing space after
              "it" and ran ~50px past the last letter. whitespace-nowrap keeps
              the shrink-to-fit at max-content, so a narrow column cannot wrap
              inside the rect and leave it covering two lines.

              The space before "way" lives INSIDE the max-md:hidden span rather
              than after "the", so neither breakpoint ends its rect on a space.

              38 on mobile, not 40: the 390 board leaves this column 342px once
              the section's px-6 is off, and "Experience travel the" at 40 is a
              337px word run, which fits on its own but not once the rect hangs
              0.22em out of each end. At 38 the rect measures 337 and clears the
              column -- at 40 it was 355 and the right end was being cut off. */}
          <h3
            className="mb-6 font-taprom tracking-[0.05em] text-ink leading-[1.9048]
              text-[42px]
              max-[1910px]:text-[42px]
              max-[1281px]:text-[35px]
              max-[1250px]:text-[33px]
              max-[1200px]:text-[31px]
              max-md:text-[38px] max-md:leading-[1.2] max-md:mb-8"
          >
            <div>
              <span className="sub-title-bg hero-bar-experience inline-block whitespace-nowrap">
                Experience travel the<span className="max-md:hidden"> way it</span>
              </span>
            </div>
            <div>
              <span className="sub-title-bg hero-bar-experience inline-block whitespace-nowrap">
                <span className="md:hidden">way it </span>should be
              </span>{" "}
              {/* The tail moves as one unit, so 390 can only ever put it on a
                  line of its own -- the board's third line -- instead of
                  keeping "with" up here and dropping the brand on its own. It
                  is a nowrap span rather than a hard <br>, so the wider
                  breakpoints, where it does fit beside "should be", still set
                  the heading in two lines. */}
              {plainHeading && (
                <span className="whitespace-nowrap">{plainHeading.trim()}</span>
              )}
            </div>
          </h3>

          {/* Nohemi Light 18/36/5% -- the board's body style for this column
              (--fs/--lh/--ls-body-nohemi-light in globals.css names this very
              paragraph). It was Inter Medium 16/24: too heavy and too tight,
              and `font-medium` on a family that ships a 300 is the opposite of
              what the board asks for. 36px between the two so the gap reads as
              one blank line, the way the board has it.

              18/36 holds at every desktop width rather than stepping down with
              the heading: the 556 column is fixed down to ~1180 and the grid
              sets it below that, so shrinking the type here only changes how
              many words reach each line -- at 17px the board's four lines came
              out as five with "life." orphaned on its own. */}
          <p className="mb-[36px] font-[Nohemi] font-light text-ink
            text-[18px] leading-[36px]
            max-md:text-[18px] max-md:leading-[28px] max-md:mb-[28px]">
            {paragraph1}
          </p>

          <p className="font-[Nohemi] font-light text-ink
            text-[18px] leading-[36px]
            max-md:text-[18px] max-md:leading-[28px]">
            {paragraph2}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-md:flex max-md:flex-col max-md:items-center max-md:gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className="rounded-[4px] max-md:w-[337px] max-md:h-[264px] max-md:rounded-[5px] border border-[#5b5fae] max-md:border-2 max-md:border-[#2C3078] bg-[#e8edc9] max-md:bg-[#EFF3CF] p-6 max-md:p-5 flex flex-col"
            >
            
              <div className="mb-5 max-md:mb-3 flex items-center gap-0.5">
                {[...Array(card.stars)].map((_, i) => (
                  <Image
                    key={i}
                    src="/ConcaveStar.svg"
                    alt="star"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] max-md:w-[18px] max-md:h-[18px]"
                  />
                ))}
              </div>
              <h3 className="mb-2 whitespace-pre-line font-semibold leading-[1.2] text-ink
                text-[23px]
                max-[1910px]:text-[23px]
                max-[1281px]:text-[20px]
                max-[1250px]:text-[19px]
                max-[1200px]:text-[18px]
                max-md:text-[21px] max-md:leading-[20px] max-md:font-bold max-md:whitespace-normal">
                {card.title}
              </h3>
              <p className="text-[16px] leading-6 text-ink max-md:text-[16px] max-md:leading-[20px] max-md:text-[#1A1A1A] mt-[10px]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}