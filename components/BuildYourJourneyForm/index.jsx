"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Minus } from "lucide-react";
import { STEPS, TOTAL_STEPS, initialFormData } from "./constants";
import StepOne from "./StepOne";
import StepGuests from "./StepGuests";
import StepTailor from "./StepTailor";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import SuccessStep from "./SuccessStep";

export default function BuildYourJourneyForm({
  isOpen,
  onClose,
  onSubmit,
  // Optional { id, title, tagIds } for the journey the visitor was just
  // looking at (e.g. opened from that journey's "Tailor This Journey For
  // You" link) — pre-selects it as the Step 1 destination instead of
  // making them search for it again. Same shape as one entry of
  // destinationOptions below (id = plain node id, tagIds = that
  // journey's journey_style term ids).
  prefillDestination,
}) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [phoneError, setPhoneError] = useState("");
  // [{ id, title, tagIds }] real journeys for the "Where do you want to
  // go?" list in StepOne — id is the plain Drupal node ID
  // (drupal_internal__nid), tagIds are the plain ids of that journey's
  // field_journey_tag ("Journey Style") terms, e.g. "Private Journey".
  const [destinationOptions, setDestinationOptions] = useState([]);
  // Portal target isn't available during SSR, so the modal only renders
  // once mounted client-side (see the createPortal call in the return
  // below). Without the portal, this modal — being rendered wherever
  // CraftJourneyButton happens to sit in the page (e.g. deep inside the
  // Tailor-Made page's hero section) — inherits `position: fixed`
  // relative to the nearest transformed/positioned ancestor instead of
  // the viewport, which is why it was rendering mid-page and overlapping
  // the sections below it instead of covering the full screen.
  const [mounted, setMounted] = useState(false);

  // This modal is mounted from many places (CraftJourneyButton, CtaBanner)
  // with no server-rendered parent to fetch this for it, so it's fetched
  // client-side, once, the first time the modal opens.
  useEffect(() => {
    if (!isOpen || destinationOptions.length) return;

    let cancelled = false;

    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/jsonapi/node/journey?filter[status][value]=1&include=field_journey_tag`
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json) => {
        if (cancelled) return;
        const included = json.included || [];

        const options = (json.data || [])
          .map((item) => {
            const tagData = item.relationships?.field_journey_tag?.data;
            const tagRefs = Array.isArray(tagData) ? tagData : tagData ? [tagData] : [];
            // Only taxonomy_term--journey_style is accepted by the
            // webform's `journeytype` field — matching by UUID alone
            // (with no bundle check) let ids from other referenced
            // entity types through, which Drupal rejects on submit with
            // "The referenced entity (taxonomy_term: X) does not
            // exist." even though the entity is real, just the wrong
            // bundle for this field.
            const tagIds = tagRefs
              .map((t) => {
                const e = included.find(
                  (inc) =>
                    inc.id === t.id && inc.type === "taxonomy_term--journey_style",
                );
                const tid = e?.attributes?.drupal_internal__tid;
                return tid != null ? Number(tid) : null;
              })
              .filter((id) => id !== null && !Number.isNaN(id));

            return {
              id: item.attributes?.drupal_internal__nid ?? null,
              title: item.attributes?.title || "",
              tagIds,
            };
          })
          .filter((option) => option.id && option.title);
        setDestinationOptions(options);
      })
      .catch((err) => {
        console.error("Failed to load destination options", err);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, destinationOptions.length]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Seed Step 1's destination from the journey the visitor came from,
  // each time the modal is (re)opened with one available. handleClose
  // resets formData back to initialFormData, so this only ever overrides
  // that fresh blank state on open — it never clobbers what the visitor
  // typed while the form stays open.
  useEffect(() => {
    if (!isOpen || !prefillDestination?.id) return;
    setFormData((prev) => ({
      ...prev,
      destination: prefillDestination.title || prev.destination,
      destinationId: prefillDestination.id,
      journeyTypeIds: prefillDestination.tagIds || [],
    }));
  }, [isOpen, prefillDestination]);

  if (!isOpen || !mounted) return null;

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "phone") setPhoneError("");
  };

  const toggleArrayValue = (field, value) =>
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));

  const toggleExperience = (value) => toggleArrayValue("experiences", value);
  const toggleDuration = (value) => toggleArrayValue("duration", value);
  const toggleTailorTopic = (value) => toggleArrayValue("tailorTopics", value);

  const updateGuests = (key, value) =>
    setFormData((prev) => ({
      ...prev,
      guests: { ...prev.guests, [key]: value },
    }));

  const goNext = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const goPrevious = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleClose = () => {
    onClose?.();
    setStep(1);
    setSubmitted(false);
    setFormData(initialFormData);
    setPhoneError("");
    setIsHowItWorksOpen(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!/^\d{10}$/.test((formData.phone || "").trim())) {
      setPhoneError("Please enter a valid 10-digit mobile number.");
      // Phone is on step 6 (StepFour) — jump back to it so the error is
      // actually visible, in case this fires from some other path.
      setStep(TOTAL_STEPS);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Fetch CSRF Token
      const csrfRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/session/token`
      );

      if (!csrfRes.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const csrfToken = await csrfRes.text();

      const credentials = btoa(
        `${process.env.NEXT_PUBLIC_DRUPAL_USER}:${process.env.NEXT_PUBLIC_DRUPAL_PASS}`
      );

      // 2. Exact Drupal Webform Payload Mapping
      const payload = {
        webform_id: "craft_your_journey",
        // `destination` on this webform is an entity-autocomplete field
        // (same pattern as PrivateInquiryForm/GroupInquiryForm) — it
        // needs the journey node's plain ID, not the free-typed title
        // text, or Drupal silently drops it. Empty if the visitor typed
        // something that wasn't actually selected from the list.
        destination: formData.destinationId || "",
        // journeytype -> the selected journey's field_journey_tag term(s)
        // (e.g. "Private Journey"). Sent as an array since this element
        // (like journeytype on the other forms) has multiple values
        // enabled.
        journeytype: formData.journeyTypeIds?.length ? formData.journeyTypeIds : "",
        // Plain node ID (drupal_internal__nid) of the journey selected
        // from the "Where do you want to go?" list — empty if the
        // visitor free-typed something not in the list. NOTE: this
        // "journey_id" key is a guess at the webform's element machine
        // name — confirm/rename to match whatever element is added on
        // the Drupal side (see conversation).
        journey_id: formData.destinationId || "",
        exeperience: formData.experiences,
        adults: formData.guests?.adults || 2,
        children: formData.guests?.children || 0,
        duration: formData.duration,
        tailortopics: formData.tailorTopics,
        tripreason: formData.tripReason,
        expertnote: formData.expertNote,
        budgetamount: formData.budgetAmount,
        budgetrange: formData.budgetRange,
        includesflights: formData.includesFlights,
        flightassistance: formData.flightAssistance,
        budgetpreference: formData.budgetPreference,
        title: formData.title,
        firstname: formData.firstName,
        lastname: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        consent: formData.consent ? "1" : "0",
      };

      // 3. API Request to Drupal
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/webform_rest/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Basic ${credentials}`,
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error?.message || "Something went wrong.");
        setIsSubmitting(false);
        return;
      }

      console.log("Success Response:", data);
      onSubmit?.(formData);
      setSubmitted(true);
      setFormData(initialFormData);
    } catch (error) {
      console.error("Form Submission Error:", error);
      alert("Unable to submit the form. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6 overflow-y-auto antialiased">
      <div className="relative my-auto w-full max-w-[1200px] flex flex-col rounded-[10px] border-2 border-[#1A1A1A] bg-[#FAFAFA] shadow-[5px_10px_24px_rgba(26,26,26,0.1)] overflow-hidden">
        <div className="relative flex shrink-0 items-center justify-between px-6 sm:px-[60px] pt-[26px] pb-2">
          <h2 className="text-[18px] sm:text-[21px] font-[500] leading-[35px] tracking-[0.05em] text-[#1A1A1A]">
            Build Your Journey With Us
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex shrink-0 items-center justify-center cursor-pointer text-[#1A1A1A] transition-opacity hover:opacity-60 focus:outline-none"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Step tabs — desktop / tablet */}
        <div className="hidden sm:block px-6 sm:px-[60px] pt-2 pb-[24px] border-b-2 border-[#1A1A1A]">
          <div className="flex items-center justify-between rounded-[8px] bg-[#F2E5DE] px-6 sm:px-6 py-3.5 gap-2">
            {STEPS.map((s, index) => (
              <div key={s.id} className="flex items-center gap-3 sm:gap-4 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-[18px] sm:text-[20px] font-[600] leading-none text-[#000000]">
                    {s.id}
                  </span>
                  <span className="text-[12px] sm:text-[13px] font-[400] leading-[16px] sm:leading-[18px] tracking-[0.03em] text-[#000000] max-w-[180px]">
                    {s.label}
                  </span>
                </div>

                {index < STEPS.length - 1 && (
                  <span className="mx-auto text-[22px] font-light text-[#000000]/60 select-none">
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* "How it Works" accordion — mobile only */}
        <div className="sm:hidden px-6 pt-2 pb-[24px]">
          <div className="rounded-[8px] border border-[#1A1A1A] bg-[#F2E5DE] px-4 py-3.5">
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen((prev) => !prev)}
              aria-expanded={isHowItWorksOpen}
              className="flex w-full items-center justify-between cursor-pointer"
            >
              <span className="text-[14px] font-[600] tracking-[0.03em] text-[#1A1A1A]">
                How it Works
              </span>
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-[#1A1A1A] text-[#1A1A1A]">
                {isHowItWorksOpen ? (
                  <Minus size={12} strokeWidth={2} />
                ) : (
                  <Plus size={12} strokeWidth={2} />
                )}
              </span>
            </button>

            {isHowItWorksOpen && (
              <ol className="mt-3.5 flex flex-col gap-y-3">
                {STEPS.map((s) => (
                  <li key={s.id} className="flex gap-2.5">
                    <span className="text-[13px] font-[600] leading-[18px] text-[#1A1A1A]">
                      {s.id}.
                    </span>
                    <span className="text-[12px] font-[400] leading-[18px] tracking-[0.02em] text-[#1A1A1A]">
                      {s.label}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <form
          onSubmit={step === TOTAL_STEPS ? handleSubmit : (e) => e.preventDefault()}
          className="px-6 sm:px-[60px] py-7"
        >
          {submitted ? (
            <SuccessStep onExplore={handleClose} />
          ) : (
            <>
              {step === 1 && (
                <StepOne
                  formData={formData}
                  updateField={updateField}
                  toggleExperience={toggleExperience}
                  destinationOptions={destinationOptions}
                />
              )}
              {step === 2 && (
                <StepGuests
                  formData={formData}
                  updateGuests={updateGuests}
                  toggleDuration={toggleDuration}
                />
              )}
              {step === 3 && (
                <StepTailor
                  formData={formData}
                  toggleTailorTopic={toggleTailorTopic}
                />
              )}
              {step === 4 && (
                <StepTwo formData={formData} updateField={updateField} />
              )}
              {step === 5 && (
                <StepThree formData={formData} updateField={updateField} />
              )}
              {step === 6 && (
                <StepFour
                  formData={formData}
                  updateField={updateField}
                  phoneError={phoneError}
                />
              )}

              <div className="mt-8 flex items-center justify-between sm:justify-start sm:gap-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={goPrevious}
                    disabled={isSubmitting}
                    className="h-[37px] text-[15px] font-medium text-[#555555] transition hover:text-[#000000] cursor-pointer disabled:opacity-50"
                  >
                    Previous
                  </button>
                )}

                {step < TOTAL_STEPS ? (
                  <button
                    key="nav-next"
                    type="button"
                    onClick={goNext}
                    className="flex h-[37px] w-[130px] items-center justify-center rounded-[30px] bg-[#2C3078] text-[15px] font-semibold tracking-[0.05em] text-[#FAFAFA] transition hover:opacity-90 cursor-pointer shadow-sm"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    key="nav-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-[37px] px-8 items-center justify-center rounded-[30px] bg-[#2C3078] text-[15px] font-semibold tracking-[0.05em] text-[#FAFAFA] transition hover:opacity-90 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
}