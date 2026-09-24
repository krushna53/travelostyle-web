import { TRIP_REASONS } from "./constants";

function RadioOption({ name, value, checked, onChange, label }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5 select-none">
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <div className="h-3.5 w-3.5 rounded-full border border-[#4A4A4A] transition-colors peer-checked:border-[#1A1A1A]" />
        <div className="absolute h-1.5 w-1.5 rounded-full bg-[#1A1A1A] opacity-0 transition-opacity peer-checked:opacity-100" />
      </div>
      <span className="text-[11px] text-[#4A4A4A]">{label}</span>
    </label>
  );
}

export default function StepFour({ formData, updateField, reasonOptions }) {
  // Row 1: Honeymoon, Birthday, Babymoon, Anniversary, Family Trip, Bucket List
  // Row 2: Graduation, Friend Trip, Family Trip, Because I love to travel
  // When `reasonOptions` is supplied (the inspirational form's shorter,
  // Drupal-configured list), it's rendered as a single wrapped row instead.
  const row1 = reasonOptions || [
    "Honeymoon",
    "Birthday",
    "Babymoon",
    "Anniversary",
    "Family Trip",
    "Bucket List",
  ];
  const row2 = reasonOptions
    ? []
    : ["Graduation", "Friend Trip", "Family Trip", "Because I love to travel"];

  return (
    <div className="w-full font-sans">
      {/* Title & Description */}
      <h3 className="text-[13px] font-bold text-[#1A1A1A]">
        Travel Information
      </h3>
      <p className="mt-1 text-[10px] leading-tight text-[#6A6A6A]">
        This helps us recommend experiences, sights and activities that align
        with your ideal trip
      </p>

      <div className="mt-3.5">
        <p className="mb-2 text-[11px] font-bold text-[#1A1A1A]">
          Why are you taking this trip?
        </p>

        <div className="space-y-2.5">
          <div className="flex flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
            {TRIP_REASONS?.map((reason, idx) => (
              <RadioOption
                key={`row1-${reason}-${idx}`}
                name="tripReason"
                value={reason}
                checked={formData.tripReason === reason}
                onChange={(e) => updateField("tripReason", e.target.value)}
                label={reason}
              />
            ))}
          </div>

          {/* <div className="flex flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
            {row2.map((reason, idx) => (
              <RadioOption
                key={`row2-${reason}-${idx}`}
                name="tripReason"
                value={reason}
                checked={formData.tripReason === reason}
                onChange={(e) => updateField("tripReason", e.target.value)}
                label={reason}
              />
            ))}
          </div> */}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-[11px] font-bold text-[#1A1A1A]">
          What&apos;s something you would like our travel advisor to know?
        </label>
        <textarea
          rows={3}
          value={formData.travelInfoNote || ""}
          onChange={(e) => updateField("travelInfoNote", e.target.value)}
          placeholder="Do you have questions? Quirks? Preferences? or special considerations that you would like us to keep in mind? Tell us everything! The more we know, the better we can help."
          className="mt-1.5 w-full resize-none rounded-md border border-[#3A3A3A] bg-transparent p-2.5 text-[10.5px] leading-relaxed text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:border-black focus:outline-none"
        />
      </div>

      <div className="mt-3.5">
        <label className="flex cursor-pointer items-center gap-1.5 text-[10px] text-[#4A4A4A] select-none">
          <input
            type="checkbox"
            checked={formData.consent || false}
            onChange={(e) => updateField("consent", e.target.checked)}
            required
            className="h-3.5 w-3.5 rounded-[2px] border-[#5A5A5A] accent-[#2B3377]"
          />
          <span>I agree to be contacted by TravelOStyle regarding my inquiry.</span>
        </label>
      </div>
    </div>
  );
}