// Typography and spacing mirror the text sections on the live travelostyle.com
// landing (FAQ / "Take A Journey With Us").
export default function DynamicPolicyPage({ title, description }) {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[85.2vw]">
        {title ? (
          <h1
            className="font-bold leading-tight text-[#2C3078]"
            style={{ fontSize: "clamp(26px, 2.8vw, 48px)" }}
          >
            {title}
          </h1>
        ) : (
          <p className="text-[24px] font-medium text-[#2C3078]">Coming Soon</p>
        )}

        <div
          className="mt-8 max-w-4xl text-[15px] leading-relaxed text-[#2C3078] [&_p]:mb-4 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_a]:underline [&_strong]:font-semibold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </section>
  );
}
