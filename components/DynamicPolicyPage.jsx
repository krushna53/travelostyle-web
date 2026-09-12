
export default function DynamicPolicyPage({ title, description }) {
  return (
    <div className="max-w-4xl mx-auto px-6 md:py-12">
      <div className="mb-12">
        {title ? (
          <h1 className="font-[Nohemi] text-3xl md:text-5xl font-semibold tracking-[0.05em] mb-2">
            {title}
          </h1>
        ) : (
          <p className="text-[24px] font-medium text-ink">Coming Soon</p>
        )}
      </div>

      <div
        className="text-base md:text-lg leading-relaxed space-y-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
