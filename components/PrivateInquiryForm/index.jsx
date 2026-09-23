"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  TOTAL_STEPS,
  initialFormData,
  CUSTOMIZATION_OPTIONS,
  STOPOVER_OPTIONS,
  INSPIRATIONAL_CUSTOMIZATION_OPTIONS,
  INSPIRATIONAL_STOPOVER_OPTIONS,
  INSPIRATIONAL_TRIP_REASONS,
} from "./constants";
import JourneySummaryCard from "./JourneySummaryCard";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import SuccessStep from "./SuccessStep";

const PHONE_PATTERN = /^\d{10}$/;

// Multi-step "Request A Private Journey" inquiry form:
// Step 1 - Guest Details
// Step 2 - How would you like to customize this journey?
// Step 3 - Stopover journeys
// Step 4 - Travel information + submit
export default function PrivateInquiryForm({
  isOpen,
  onClose,
  onSubmit,
  journey,
  departure,
  journeyId,
  departureId,
  // false when there's no specific departure to attach (e.g. the generic
  // "Request A Private Journey" CTA on a journey page, or an "Explore All
  // ... Journeys" CTA not tied to one trip). In that case the card hides
  // the departure-date block and Step 1 asks "when do you want to travel"
  // instead.
  showDepartureDate = true,
  // Optional small label rendered above the modal (e.g. "Inspirational
  // Itineraries Form" for the generic CTA, matching the "Group Trip
  // Inquiry" label above the Group form). Omitted entirely when not set,
  // so existing triggers (e.g. the Dates & Pricing sold-out flow) keep
  // their current label-less look.
  label,
}) {
  console.log("journey", journey);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showStepOneValidation, setShowStepOneValidation] =
  useState(false);

  if (!isOpen) return null;

  // Step 3 ("Take your journey a little further") only makes sense when
  // this specific journey has stopover journeys configured in Drupal
  // (field_stopover_journey). If none were added for this journey, skip
  // the step entirely in both directions instead of showing an empty form.
  const hasStopovers =
    Array.isArray(journey?.stopoverJourneyIds) &&
    journey.stopoverJourneyIds.length > 0;

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "phone") setPhoneError("");
  };

  const toggleArrayValue = (field, value) =>
    setFormData((prev) => {
      // Defensive fallback: if `prev[field]` is missing (e.g. state was
      // created before this field existed in initialFormData, and a dev
      // Fast Refresh kept the stale value around), treat it as empty
      // instead of crashing on `.includes`.
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });

  const toggleCustomization = (value) =>
    toggleArrayValue("customizations", value);
  const toggleStopover = (value) => toggleArrayValue("stopovers", value);

const goNext = () => {
  if (step === 1) {
    setShowStepOneValidation(true);

    const firstName = formData.firstName?.trim() || "";
    const lastName = formData.lastName?.trim() || "";
    const title = formData.title?.trim() || "";
    const email = formData.email?.trim() || "";
    const phone = formData.phone?.trim() || "";
    const guests = formData.guests;
    const travelingWithChildren =
      formData.travelingWithChildren?.trim() || "";

    // Required field validation
    if (
      !firstName ||
      !lastName ||
      !title ||
      !email ||
      !phone ||
      !guests ||
      !travelingWithChildren
    ) {
      return;
    }

    // Email validation
    if (!EMAIL_PATTERN.test(email)) {
      return;
    }

    // Phone validation
    if (!PHONE_PATTERN.test(phone)) {
      setPhoneError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setPhoneError("");
  }

  setStep((prev) => {
    const next = Math.min(prev + 1, TOTAL_STEPS);

    return next === 3 && !hasStopovers
      ? Math.min(next + 1, TOTAL_STEPS)
      : next;
  });
};
  const goPrevious = () =>
    setStep((prev) => {
      const previous = Math.max(prev - 1, 1);
      // Skip step 3 (stopovers) on the way back if this journey has none.
      return previous === 3 && !hasStopovers
        ? Math.max(previous - 1, 1)
        : previous;
    });

  const handleClose = () => {
    onClose?.();
    setStep(1);
    setSubmitted(false);
    setSubmitError("");
    setPhoneError("");
    setFormData(initialFormData);
  };

  // Submits to Drupal's webform_rest endpoint, same pattern as the
  // ContactInquiry ("contact_inquiry") form: fetch a CSRF token, basic-auth
  // with the service account, then POST the mapped field values.
  // true when the form is opened without a specific departure (the
  // generic "Inspirational Itineraries" flow) — false for the
  // departure-specific "Request A Private Journey" flow.
  const isInspirational = !showDepartureDate;

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // NOTE: tried sending these as "Label (id)" strings on the theory that
  // Drupal's EntityAutocomplete parser needs that format — that turned out
  // to be wrong (it broke `destination`, which had been working with a
  // plain ID). Reverted to plain IDs, confirmed working for `destination`.
  //
  // `journeytype` is configured with multiple values enabled on the
  // webform (the "selected items" tags widget) — unlike `destination`,
  // which is single-value. A multi-value webform element expects an
  // array of IDs via webform_rest, not one scalar, so this sends the
  // full list of resolved field_journey_tag term ids instead of just
  // the first.
  const journeyTypeValue = journey?.tagIds?.length ? journey.tagIds : "";
  const departureNodeId =
    departure?.nodeId || departure?.id || departureId || "";
  const journeyDepartureValue = departureNodeId;
  const journeyNodeId = journey?.nodeId || journey?.id || journeyId || "";
  const destinationValue = journeyNodeId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!EMAIL_PATTERN.test(formData.email.trim())) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test((formData.phone || "").trim())) {
      setPhoneError("Please enter a valid 10-digit mobile number.");
      // Phone is on step 1 — jump back so the inline error is visible.
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const csrfRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/session/token`,
      );

      if (!csrfRes.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const csrfToken = await csrfRes.text();

      const credentials = btoa(
        `${process.env.NEXT_PUBLIC_DRUPAL_USER}:${process.env.NEXT_PUBLIC_DRUPAL_PASS}`,
      );

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
          // Same modal/component powers both the departure-specific "Request
          // A Private Journey" flow and the generic "Inspirational
          // Itineraries" flow (see the `showDepartureDate`/`label` props) —
          // each submits to a different Drupal webform with slightly
          // different field names, so the payload is branched here.
          body: JSON.stringify(
            isInspirational
              ? {
                  webform_id: "inspirational_itineraries_form",
                  // Drupal's webform expects the plain node ID, not the
                  // JSON:API UUID — `nodeId` (drupal_internal__nid) is
                  // preferred when available, falling back to the UUID
                  // for any caller that hasn't been updated to pass it.
                  journey_id: journeyNodeId,
                  journey_departure_id: departureNodeId,
                  // Entity-autocomplete fields on the webform — Drupal's
                  // EntityAutocomplete parser only extracts an ID out of
                  // a "Label (id)" string, so these are built as that
                  // rather than sent as bare IDs (see toAutocompleteValue
                  // above).
                  // journey_departure -> the departure ("book_your_journey")
                  // node being enquired about.
                  journey_departure: journeyDepartureValue,
                  // journeytype -> the journey's field_journey_tag term
                  // (e.g. "Private Journey"), from the "Journey Style"
                  // vocabulary.
                  journeytype: journeyTypeValue,
                  // destination -> the journey node itself.
                  destination: destinationValue,
                  journey_title: journey?.title || "",
                  // NOTE: assumed shape — Drupal only specifies this as a
                  // JSON-encoded string, not the exact keys it should
                  // contain. Adjust if the real webform expects different
                  // nested fields.
                  journey_data: JSON.stringify({
                    route: journey?.route || "",
                    base_price: journey?.offerPrice ?? journey?.basePrice ?? 0,
                  }),
                  guests: Number(formData.guests) || 0,
                  traveling_with_children: formData.travelingWithChildren,
                  flight_assistance: formData.flightAssistance,
                  travel_year: formData.travelYear,
                  travel_month: formData.travelMonth,
                  customizations: formData.customizations,
                  stopovers: formData.stopovers,
                  discuss_custom_stopovers: formData.discussCustomStopovers
                    ? 1
                    : 0,
                  trip_reason: formData.tripReason,
                  travel_info_note: formData.travelInfoNote.trim(),
                  title: formData.title,
                  first_name: formData.firstName.trim(),
                  last_name: formData.lastName.trim(),
                  country_code: formData.countryCode,
                  phone: formData.phone.trim(),
                  email_id: formData.email.trim(),
                  consent: formData.consent ? 1 : 0,
                }
              : {
                  webform_id: "private_journey_inquiry_webform",
                  // See note above: prefer the plain node ID over the
                  // JSON:API UUID.
                  journey_id: journeyNodeId,
                  journey_departure_id: departureNodeId,
                  // Entity-autocomplete fields on the webform — see note
                  // in the inspirational branch above.
                  journey_departure: journeyDepartureValue,
                  journeytype: journeyTypeValue,
                  destination: destinationValue,
                  first_name: formData.firstName.trim(),
                  last_name: formData.lastName.trim(),
                  title: formData.title,
                  country_code: formData.countryCode,
                  phone: formData.phone.trim(),
                  email: formData.email.trim(),
                  guests: Number(formData.guests) || 0,
                  traveling_with_children: formData.travelingWithChildren,
                  flight_assistance: formData.flightAssistance,
                  customizations: formData.customizations,
                  stopovers: formData.stopovers,
                  discuss_custom_stopovers: formData.discussCustomStopovers
                    ? 1
                    : 0,
                  trip_reason: formData.tripReason,
                  travel_month: formData.travelMonth,
                  travel_year: formData.travelYear,
                  travel_info_note: formData.travelInfoNote.trim(),
                  consent: formData.consent ? 1 : 0,
                },
          ),
        },
      );
      console.log("journey", journey);

      const data = await response.json();

      if (!response.ok) {
        console.error("Private journey inquiry submission error:", data);

        setSubmitError(
          data.message || "Something went wrong. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }

      onSubmit?.({ ...formData, journey, departure, response: data });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setSubmitError("Unable to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-sans backdrop-blur-[0.5px]">
      <div className="w-full max-w-[1000px]">
        {label && (
          <p className="mb-2 flex items-center gap-1.5 pl-1 text-[13px] font-medium text-[#7C3AED]">
            <span aria-hidden="true">&#10070;</span> {label}
          </p>
        )}
        {/* Modal Outer Box */}
        <div className=" relative flex max-h-[92vh] w-full flex-col rounded-xl border border-[#3A3A3A] bg-[#fafafa] shadow-2xl">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#3A3A3A] px-4 py-4 ">
            <h2 className="text-[15px] font-bold text-[#1A1A1A]">
              Inquire With Us
            </h2>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="text-[#3A3A3A] transition hover:text-black"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-5">
            {submitted ? (
              <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
                <div className="hidden w-full shrink-0 sm:block md:w-[210px]">
                  <JourneySummaryCard
                    journey={journey}
                    departure={departure}
                    showDepartureDate={showDepartureDate}
                  />
                </div>

                <div className="flex flex-1 flex-col justify-center">
                  <SuccessStep onExplore={handleClose} />
                </div>
              </div>
            ) : (
              <form
                onSubmit={
                  step === TOTAL_STEPS
                    ? handleSubmit
                    : (e) => e.preventDefault()
                }
                className="flex flex-col items-start gap-6 md:flex-row"
              >
                {/* Left Column: Summary Card */}
                <div className="w-full shrink-0 md:w-[215px]">
                  <JourneySummaryCard
                    journey={journey}
                    departure={departure}
                    showDepartureDate={showDepartureDate}
                  />
                </div>

                {/* Right Column: Steps */}
                <div className="flex w-full flex-1 flex-col justify-between self-stretch">
                  <div>
                    {step === 1 && (
                      <StepOne
                        formData={formData}
                        updateField={updateField}
                        showTravelWindow={!showDepartureDate}
                        phoneError={phoneError}
                        showValidation={showStepOneValidation}
                      />
                    )}
                    {step === 2 && (
                      <StepTwo
                        formData={formData}
                        toggleCustomization={toggleCustomization}
                        options={
                          isInspirational
                            ? INSPIRATIONAL_CUSTOMIZATION_OPTIONS
                            : CUSTOMIZATION_OPTIONS
                        }
                      />
                    )}
                    {step === 3 && hasStopovers && (
                      <StepThree
                        formData={formData}
                        toggleStopover={toggleStopover}
                        updateField={updateField}
                        options={
                          isInspirational
                            ? INSPIRATIONAL_STOPOVER_OPTIONS
                            : STOPOVER_OPTIONS
                        }
                        allowedStopoverIds={journey?.stopoverJourneyIds}
                      />
                    )}
                    {step === 4 && (
                      <StepFour
                        formData={formData}
                        updateField={updateField}
                        reasonOptions={
                          isInspirational ? INSPIRATIONAL_TRIP_REASONS : undefined
                        }
                      />
                    )}
                  </div>

                  {submitError && (
                    <p className="mt-2 text-[11.5px] font-medium text-red-600">
                      {submitError}
                    </p>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-2 flex items-center justify-between sm:justify-end sm:gap-4">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={goPrevious}
                        className="text-[11.5px] font-semibold text-[#6A6A6A] transition hover:text-black"
                      >
                        Previous
                      </button>
                    )}

                    {step < TOTAL_STEPS ? (
                      <button
                        key="nav-next"
                        type="button"
                        onClick={goNext}
                        className="rounded-full bg-[#2B3377] px-7 py-1.5 text-[11.5px] font-bold text-white shadow-sm transition hover:bg-[#202761]"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        key="nav-submit"
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-full bg-[#2B3377] px-7 py-1.5 text-[11.5px] font-bold text-white shadow-sm transition hover:bg-[#202761] disabled:opacity-60"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
