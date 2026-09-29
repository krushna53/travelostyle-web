"use client";

import { useState } from "react";
import { X } from "lucide-react";
import GroupSummaryCard from "./GroupSummaryCard";
import CustomSelect from "@/components/ui/CustomSelect";

const TITLE_OPTIONS = [
  { value: "Mr.", label: "Mr." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Ms.", label: "Ms." },
  { value: "Dr.", label: "Dr." },
];

const initialFormData = {
  
  firstName: "",
  lastName: "",
  title: "",
  countryCode: "+1",
  phone: "",
  email: "",
  guests: "",
  travelingWithChildren: "No",
  flightAssistance: "Yes",
  message: "",
  consent: false,
};

function RadioOption({ name, value, checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div className="relative flex items-center justify-center">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <div className="h-4 w-4 rounded-full border border-neutral-700 peer-checked:border-neutral-900" />
        <div className="absolute h-2 w-2 rounded-full bg-[#232B66] opacity-0 transition-opacity peer-checked:opacity-100" />
      </div>
      <span className="text-[12px] text-neutral-800">{label}</span>
    </label>
  );
}

export default function GroupInquiryForm({
  isOpen,
  onClose,
  onSubmit,
  journey,
  trip,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [titleError, setTitleError] = useState("");

  if (!isOpen) return null;

  // NOTE: sending these as "Label (id)" strings turned out to be wrong —
  // it broke `destination`, which had been working with a plain ID.
  // Reverted to plain IDs (confirmed working for `destination`).
  //
  // `journeytype` has multiple values enabled on the webform, so it
  // expects an array of ids via webform_rest rather than one scalar —
  // see PrivateInquiryForm/index.jsx for the full explanation.
  const journeyTypeValue = journey?.tagIds?.length ? journey.tagIds : "";
  const tripNodeId = trip?.nodeId || trip?.id || "";
  const journeyDepartureValue = tripNodeId;
  const journeyNodeId = journey?.nodeId || journey?.id || "";
  const destinationValue = journeyNodeId;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "phone") setPhoneError("");
    if (name === "title") setTitleError("");
  };

  const handleClose = () => {
    onClose?.();
    setFormData(initialFormData);
    setSubmitted(false);
    setPhoneError("");
    setTitleError("");
  };

  const handleSubmit = async(e) => {
    e.preventDefault()

    if (!formData.title) {
      setTitleError("Please select a title.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setPhoneError("Please enter a valid 10-digit mobile number.");
      return;
    }

     try {
      const response = await fetch("/api/webform-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webform_id: "group_trip_inquiry_webform",
          // Node ID (not the JSON:API UUID) — same pattern as
          // PrivateInquiryForm. `journey`/`trip` are the shared journey
          // and departure objects from JourneyDetailClient/DatePricing,
          // which carry `nodeId` (drupal_internal__nid).
          journey_id: journeyNodeId,
          journey_departure_id: tripNodeId,
          // Entity-autocomplete fields on the webform — Drupal only
          // extracts an ID from a "Label (id)" string (see
          // toAutocompleteValue above).
          journey_departure: journeyDepartureValue,
          journeytype: journeyTypeValue,
          destination: destinationValue,
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          title: formData.title.trim(),
          email: formData.email.trim(),
          country_code: formData.countryCode,
          phone: formData.phone.trim(),
          traveling_with_children: formData.travelingWithChildren,
          message: formData.message.trim(),
          consent: formData.consent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Submission Error:", data);
        alert(data.message || "Something went wrong.");
        return;
      }
      alert("Form Submitted Successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        title: "",
        email: "",
        countryCode: "+1",
        phone: "",
        message: "",
        consent: false,
      });
      onSubmit?.({ ...formData, journey, trip })

    } catch (error) {
      console.error(error);
      alert("Unable to submit the form. Please try again.");
    }
    // e.preventDefault();
    // onSubmit?.({ ...formData, journey, trip });
    // setSubmitted(true);
  };
//   const handleSubmit = (e) => {
//   e.preventDefault();

//   const inquiryData = {
    
//     journeyId: journey?.id ?? null,
    
//     journeyDepartureId: trip?.id ?? null,
//     ...formData,
//   };
// console.log("JOURNEY FULL JSON:", JSON.stringify(journey, null, 2));
//   console.log(
//     "GROUP INQUIRY JSON:",
//     JSON.stringify(inquiryData, null, 2)
//   );

//   localStorage.setItem(
//     "groupInquiryData",
//     JSON.stringify(inquiryData)
//   );

//   onSubmit?.(inquiryData);
//   setSubmitted(true);
// };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-sans backdrop-blur-[1px]">
      <div className="relative flex max-h-[98vh] w-full max-w-[1000px] flex-col rounded-xl border border-neutral-800 bg-white shadow-2xl">
        {/* Header */}
        <div className=" flex shrink-0 items-center justify-between border-b border-neutral-800 px-4 sm:px-7 py-3 sm:py-3.5">
          <h2 className="text-[15px] sm:text-[17px] font-bold tracking-tight text-neutral-900">
            Inquire With Us
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="text-neutral-700 transition hover:text-black"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto px-4 sm:px-7 py-5 sm:py-6">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <h3 className="text-lg font-semibold text-neutral-900">
                Thank you! Your inquiry has been received.
              </h3>
              <p className="max-w-md text-sm text-neutral-600">
                Our travel specialists will get back to you within 48 hours with
                everything you need for this journey.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 rounded-full bg-[#232B66] px-8 py-2 text-sm font-medium text-white transition hover:bg-[#1c2252]"
              >
                Close
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-start gap-5 md:flex-row md:gap-8"
            >
              {/* Left Column: Summary Card */}
              <div className="w-full shrink-0 md:w-[250px]">
                <GroupSummaryCard journey={journey} trip={trip} />
              </div>

              {/* Right Column: Guest Details Form */}
              <div className="flex-1 w-full">
              <h2 className="text-[15px] font-bold tracking-tight text-neutral-900">
                  Guest Details
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  {/* First Name */}
                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-800">
                      First Name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Your First Name"
                      required
                      className="mt-1 w-full border-b border-neutral-700 bg-transparent pb-1.5 text-[12px] text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-800">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Your Last Name"
                      required
                      className="mt-1 w-full border-b border-neutral-700 bg-transparent pb-1.5 text-[12px] text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-800">
                      Title*
                    </label>
                    <CustomSelect
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Select your title"
                      options={TITLE_OPTIONS}
                      triggerClassName={`mt-1 border-b bg-transparent pb-1.5 text-[12px] text-neutral-900 ${
                        titleError ? "border-red-500" : "border-neutral-700"
                      }`}
                    />
                    {titleError && (
                      <p className="mt-1 text-[11px] text-red-500">{titleError}</p>
                    )}
                  </div>

                  {/* Number / WhatsApp */}
                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-800">
                      Number/ WhatsApp
                    </label>
                    <div className="mt-1 flex items-center border-b border-neutral-700 pb-1.5">
                      {/* <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="bg-transparent text-[12px] font-medium text-neutral-800 focus:outline-none"
                      >
                        <option value="+1">+1</option>
                        <option value="+91">+91</option>
                        <option value="+44">+44</option>
                      </select> */}
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your Mobile Number"
                        maxLength={10}
                        inputMode="numeric"
                        className="ml-2 w-full bg-transparent text-[12px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                      />
                    </div>
                    {phoneError && (
                      <p className="mt-1 text-[11px] text-red-500">{phoneError}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-800">
                      Email ID*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email ID"
                      required
                      className="mt-1 w-full border-b border-neutral-700 bg-transparent pb-1.5 text-[12px] text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none"
                    />
                  </div>

                  {/* No. of Guests */}
                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-800">
                      No.of Guests*
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      placeholder="Enter no.of Guests"
                      required
                      className="mt-1 w-full border-b border-neutral-700 bg-transparent pb-1.5 text-[12px] text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none"
                    />
                  </div>

                  {/* Traveling with Children Radio */}
                  <div className="pt-1">
                    <p className="mb-2 text-[12px] font-semibold text-neutral-800">
                      Are you traveling with children?* (under 12yrs)
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                      <RadioOption
                        name="travelingWithChildren"
                        value="Yes"
                        checked={formData.travelingWithChildren === "Yes"}
                        onChange={handleChange}
                        label="Yes"
                      />
                      <RadioOption
                        name="travelingWithChildren"
                        value="No"
                        checked={formData.travelingWithChildren === "No"}
                        onChange={handleChange}
                        label="No"
                      />
                    </div>
                  </div>

                  {/* Flight Assistance Radio */}
                  <div className="pt-1">
                    <p className="mb-2 text-[12px] font-semibold text-neutral-800">
                      Do you require assistance with flight bookings?
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                      <RadioOption
                        name="flightAssistance"
                        value="Yes"
                        checked={formData.flightAssistance === "Yes"}
                        onChange={handleChange}
                        label="Yes"
                      />
                      <RadioOption
                        name="flightAssistance"
                        value="No"
                        checked={formData.flightAssistance === "No"}
                        onChange={handleChange}
                        label="No"
                      />
                      <RadioOption
                        name="flightAssistance"
                        value="Not sure yet"
                        checked={formData.flightAssistance === "Not sure yet"}
                        onChange={handleChange}
                        label="Not sure yet"
                      />
                    </div>
                  </div>

                  {/* Message Box */}
                  <div className="sm:col-span-2 pt-1">
                    <label className="block text-[12px] font-semibold text-neutral-800">
                      Your Message*
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Do you have questions or considerations that you would like us to know?"
                      className="mt-2 w-full rounded-md border border-neutral-700 bg-transparent p-3 text-[12px] text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                {/* Consent & Submit */}
                <div className="mt-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <label className="flex cursor-pointer items-center gap-2 text-[11px] text-neutral-800">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      required
                      className="h-3.5 w-3.5 rounded border-neutral-600 accent-[#232B66]"
                    />
                    I agree to be contacted by TravelOStyle regarding my inquiry.
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#232B66] px-6 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#1a204e] sm:w-auto"
                  >
                    Submit Inquiry
                  </button>
                </div>

                <p className="mt-3 text-[10.5px] text-neutral-500">
                  TravelOStyle typically responds within 48 hours. Your details
                  are never shared with third parties.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}