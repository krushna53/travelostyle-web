export default function Hero({ blog, categories }) {
  return (
    <section className="px-5 md:px-8 lg:px-[60px] pt-5 pb-5 min-[768px]:lg:px-[58px] min-[1024px]:lg:px-[72px] min-[1280px]:lg:px-[77px] min-[1366px]:lg:px-[81px] min-[1441px]:lg:px-[84px] min-[1500px]:lg:px-[108px]">
      <div className="flex justify-between items-center gap-4">
        <p className="font-nohemi text-[16px] font-semibold leading-[40px] tracking-[0.05em] text-[#000000] min-[768px]:text-[9px] min-[1024px]:text-[11px] min-[1280px]:text-[11px] min-[1366px]:text-[12px] min-[1441px]:text-[13px] min-[1500px]:text-[16px]">
          {new Date(blog.attributes.created).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {categories[0]?.attributes?.name && (
          <button
            className="
            shrink-0
            whitespace-nowrap
            bg-transparent md:bg-[#F2E2DA]
            border
            border-ink
            md:border-[#1A1A1A]
            rounded-full
            font-nohemi
            font-normal
            leading-none
            md:leading-[32px]
            tracking-[0.05em]
            text-[16px]
            text-[#2B2B2B]
            md:text-[#1A1A1A]
            flex
            items-center
            justify-center
            h-[31px]
            px-[16px]
            md:h-auto
            min-[768px]:text-[9px] min-[768px]:py-[5px] min-[768px]:px-[9px]
            min-[1024px]:text-[11px] min-[1024px]:py-[7px] min-[1024px]:px-[11px]
            min-[1280px]:text-[11px] min-[1280px]:py-[7px] min-[1280px]:px-[11px]
            min-[1366px]:text-[12px] min-[1366px]:py-[8px] min-[1366px]:px-[12px]
            min-[1441px]:text-[13px] min-[1441px]:py-[8px] min-[1441px]:px-[13px]
            min-[1500px]:text-[16px] min-[1500px]:py-[10px] min-[1500px]:px-[16px]
          "
          >
            {categories[0].attributes.name}
          </button>
        )}
      </div>

      <div className="mt-[24px] border-b border-[#2B2B2B]" />

      <h1 className="mt-8 w-full text-[36px] sm:text-[42px] leading-[48px] sm:leading-[58px] font-semibold tracking-[-0.02em] text-ink font-nohemi min-[768px]:text-[30px] min-[768px]:leading-[43px] min-[768px]:tracking-[0.05em] min-[768px]:text-[#1A1A1A] min-[1024px]:text-[37px] min-[1024px]:leading-[53px] min-[1280px]:text-[40px] min-[1280px]:leading-[57px] min-[1366px]:text-[42px] min-[1366px]:leading-[60px] min-[1441px]:text-[44px] min-[1441px]:leading-[63px] min-[1500px]:text-[56px] min-[1500px]:leading-[80px]">
        {blog.attributes.title}
      </h1>

      <div className="mt-[32px] border-b border-[#2B2B2B]" />
    </section>
  );
}