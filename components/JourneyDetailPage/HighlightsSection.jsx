import Image from "next/image";


// Every highlight card — image or text, first row or second — is the
// same fixed size (Figma: 410x160, 10px radius, 2px border), so the grid
// reads as one uniform set of boxes rather than the first row being
// shorter than the "tall" second row. Height/radius/border are fixed;
// width still comes from the grid column so the layout stays responsive.
function HighlightCard({ card }) {
  if (card.type === "image") {
    return (
      <div className="relative h-[160px] overflow-hidden rounded-[10px] border-2 border-[#C8CE90]">
        <Image
          src={card.image}
          alt={card.alt || ""}
          fill
          unoptimized
          className="object-cover"
        />
        {card.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-[1vw] pb-[0.8vw] pt-[2vw]">
            <p className="text-[16px] font-medium text-white">
              {card.caption}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-[160px] flex-col justify-start overflow-hidden rounded-[10px] border-2 border-[#C8CE90] bg-[#EAEDC9] px-[1.2vw] py-[1.2vw]">
      <p
        className="text-[13px] font-normal leading-[1.55] text-ink"
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 6,
          overflow: "hidden",
        }}
      >
        {card.text}
      </p>
    </div>
  );
}

export default function HighlightsSection({ drupalData }) {
  // No Drupal data → show Coming Soon
  if (!drupalData || drupalData.length === 0) {
    return (
          <div className="flex w-full justify-center">

      <div className="mt-10 mb-10 flex min-h-[20px] w-[75%] items-center justify-center rounded-[0.5vw] border ">
        <p className="text-[24px] font-medium text-ink">
          Coming Soon
        </p>
      </div>
      </div>
    );
  }

  // One grid for every card, however many there are — a leftover 5th
  // (or 6th, 7th, ...) card just wraps to the next row in the same
  // grid-cols-4 track instead of getting stretched across 2 of the 4
  // columns in a separate row, which was making that leftover box twice
  // as wide as (and visually inconsistent with) all the others.
  return (
    <div className="px-[5.5vw] py-[2.5vw]">
      <div className="grid grid-cols-4 gap-[1vw]">
        {drupalData.map((card, i) => (
          <HighlightCard key={i} card={card} />
        ))}
      </div>
    </div>
  );
}
