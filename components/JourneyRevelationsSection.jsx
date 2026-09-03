import React from "react";

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

const isHex = (val) => typeof val === "string" && val.startsWith("#");

export default function JourneyRevelationsSection({
  badgeText,
  titleText,
  features = [],
  topIntroText = "",
  matrixRows = [],
  footerText = "",
  theme = {},
}) {
  const cardBgStyle = theme?.cardBg || "bg-[#eff3cf]";
  const borderStyle = theme?.borderColor || "border-neutral-400";

  // Both bg and border accept either a Tailwind class or a raw hex, matching
  // JourneyRevelationsMobile so a page can pass one theme object to both.
  const borderClass = isHex(borderStyle) ? "" : borderStyle;
  const borderVar = isHex(borderStyle) ? borderStyle : undefined;

  return (
    <div className="hidden md:flex w-full flex-col items-center py-10" style={{ paddingInline: "clamp(16px, 3.6vw, 69px)" }}>
      <section
        className={`w-full max-w-[1704px] mx-auto rounded-xl border-2 overflow-hidden flex flex-col z-20 shadow-sm ${borderClass} ${
          isHex(cardBgStyle) ? "" : cardBgStyle
        }`}
        style={{
          backgroundColor: isHex(cardBgStyle) ? cardBgStyle : undefined,
          borderColor: borderVar,
        }}
      >
        {(badgeText || titleText) && (
          <div
            className={`px-[clamp(24px,4.5vw,140px)] py-7 border-b-2 ${borderClass}`}
            style={{ borderColor: borderVar }}
          >
            {badgeText && (
              <h4 className="font-taprom text-2xl text-[#3c3c3c] tracking-wide mb-2">
                {badgeText}
              </h4>
            )}
            {titleText && (
              <h2 className="text-[26px] xl:text-[32px] font-bold text-[#111111] leading-[1.25] tracking-tight max-w-[500px]">
                {stripHtml(titleText)}
              </h2>
            )}
          </div>
        )}

        <div className="flex items-stretch">
          <div
            className={`shrink-0 px-[clamp(24px,4.5vw,140px)] py-7 flex flex-col gap-7 border-r-2 ${borderClass}`}
            style={{ borderColor: borderVar }}
          >
            {features.map((item, index) => (
              <div key={index} className="flex flex-col gap-2.5 w-[300px]">
                <div
                  className={`relative w-[300px] aspect-[300/185] rounded-xl overflow-hidden border-2 shadow-sm bg-stone-100 ${borderClass}`}
                  style={{ borderColor: borderVar }}
                >
                  <img
                    src={item.imgUrl}
                    alt={stripHtml(item.description) || "Feature Image"}
                    className="w-full h-full object-cover"
                  />
                </div>
                {item.description && (
                  <p className="font-[Nohemi] text-[13px] text-[#2c2c2c] leading-relaxed font-normal">
                    {stripHtml(item.description)}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            {topIntroText && (
              <div
                className={`pl-7 pr-[clamp(24px,6vw,98px)] py-7 border-b-2 ${borderClass}`}
                style={{ borderColor: borderVar }}
              >
                <p className="font-[Nohemi] text-[14px] text-[#222222] font-normal leading-[26px] tracking-wide line-clamp-3 min-h-[78px]">
                  {stripHtml(topIntroText)}
                </p>
              </div>
            )}

            {matrixRows.map((row, index) => {
              const isLast = index === matrixRows.length - 1;
              return (
                <div
                  key={index}
                  className={`flex flex-1 ${
                    !isLast || footerText ? `border-b-2 ${borderClass}` : ""
                  }`}
                  style={
                    !isLast || footerText ? { borderColor: borderVar } : undefined
                  }
                >
                  <div
                    className={`w-[clamp(150px,14vw,220px)] shrink-0 px-4 py-5 flex items-center justify-center border-r-2 ${borderClass}`}
                    style={{ borderColor: borderVar }}
                  >
                    <span className="text-[12px] font-bold text-[#111111] tracking-[0.12em] text-center uppercase">
                      {row.label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 px-7 py-6 flex items-center">
                    <p className="font-[Nohemi] text-[14px] text-[#3a3a3a] leading-[26px] font-normal tracking-wide">
                      {stripHtml(row.text)}
                    </p>
                  </div>
                </div>
              );
            })}

            {footerText && (
              <div className="px-7 py-6 flex items-center">
                <p className="text-[16px] text-[#111111] font-semibold leading-[28px]">
                  {stripHtml(footerText)}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
