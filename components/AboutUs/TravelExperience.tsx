import TalkToAdvisorButton from "@/components/GeneralInquiryForm/TalkToAdvisorButton";

export default function TravelExperience() {
  const items = [
    {
      title: "Feeling Understood",
      text: "Before anything is booked, there is space to understand what you want, what matters to you, and what kind of trip actually fits.",
    },
    {
      title: "Good Judgment",
      text: "Recommendations are explained clearly, so you understand why something is being suggested and what it means for your trip.",
    },
    {
      title: "Having Clarity",
      text: "There is clarity around what is covered, what needs separate planning, and what may be unnecessary. You have the full picture.",
    },
    {
      title: "Feeling Supported",
      text: "You are not left to untangle any confusion on your own. There is support when something needs to be sorted.",
    },
    {
      title: "Frictionless planning",
      text: "Things move seamlessly, which leaves more room for you to be present in the experience instead of caught up in logistics.",
    },
    {
      title: "Experiencing Joy",
      text: "Beyond the logistics and planning, a trip should feel good while you are in it. It should feel uplifting, rejuvenating, and full of the moments that stay with you for a lifetime.",
    },
  ];

  return (
    <section className="px-4 md:px-[60px] lg:px-[113px] pt-[50px] md:pt-[100px] pb-0">
      <div className="mx-auto w-full max-w-[332px] overflow-hidden rounded-[10px] border-2 border-[#1A1A1A] lg:max-w-none lg:rounded-[6px] lg:border lg:border-[#4A4A4A]">

        {/* Heading */}
        <div className="min-h-[121px] lg:min-h-[70px] py-3 px-4 bg-[#EFF3CF] flex items-center justify-center text-center border-b-2 border-[#1A1A1A] lg:border-b lg:border-[#4A4A4A]">
          <h2 className="max-w-[281px] text-[24px] leading-[32px] tracking-[0.05em] capitalize font-semibold lg:text-[22px] lg:leading-normal lg:tracking-normal lg:max-w-[480px]">
            Our Idea Of A Good Travel Experience
          </h2>
        </div>

        {/* Content */}
        <div className="bg-[#FAFAFA] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:bg-transparent">
          {items.map((item, index) => (
            <div
              key={index}
              className={`px-[27px] py-8 min-h-0 lg:p-6 md:min-h-[260px] ${
                index !== items.length - 1
                  ? "border-b-2 border-[#000000] lg:border-b-0 lg:border-r lg:border-[#4A4A4A]"
                  : ""
              }`}
            >
              <h3 className="text-[18px] font-semibold leading-[28px] tracking-[0.05em] mb-4 lg:mb-6 lg:min-h-[48px] lg:leading-[24px] lg:tracking-normal">
                {item.title}
              </h3>

              <p className="text-[16px] leading-[28px] tracking-[0.05em] text-[#000000] lg:text-[13px] lg:tracking-normal lg:text-[#4A4A4A]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop only — mobile gets its own button just above the footer */}
      <div className="mt-10 hidden lg:flex justify-center">
        <TalkToAdvisorButton className="inline-flex h-[44px] w-full max-w-[269px] items-center justify-center rounded-full bg-[#2C3078] px-6 text-[16px] font-medium tracking-[0.05em] text-white transition-colors duration-200 hover:bg-[#1E2254]" />
      </div>
    </section>
  );
}