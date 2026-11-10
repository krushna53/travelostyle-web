"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { countryCodes } from "../utils/country";

// "Contact us to curate your journey" — opened from the itinerary listing's
// no-results state. Separate from the general "Inquire With Us" form
// (GeneralInquiryForm) because it also asks for guests and travel dates,
// and posts to its own Drupal webform so these leads can be told apart.
//
// Drupal webform machine name: `curate_journey_inquiry` — element keys must
// match the payload keys in handleSubmit below.
const WEBFORM_ID = "curate_journey_inquiry";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();

const initialFormData = {
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  countryCode: "+1",
  phone: "",
  guests: "",
  travelMonth: "",
  travelYear: "",
  message: "",
  consent: false,
};

const labelClass =
  "text-[13px] sm:text-[14px] font-medium leading-normal tracking-[0.02em] text-[#000000]";

const underlineClass = (hasError) =>
  `w-full border-b ${hasError ? "border-red-400" : "border-[#262626]"} bg-transparent pb-1 pt-0.5 text-[13px] sm:text-[14px] tracking-[0.04em] text-[#000000] placeholder:text-[#757575] focus:outline-none`;

const Required = () => <span className="text-[10px] align-top text-red-500">*</span>;

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-[11px] text-red-400">{message}</p> : null;

// Underlined select matching the text inputs; shows a grey placeholder until
// a value is picked.
const SelectField = ({ label, name, value, onChange, options, placeholder, error }) => (
  <div className="flex flex-col">
    <label htmlFor={`curate-${name}`} className={labelClass}>
      {label}
      <Required />
    </label>
    <div className="relative">
      <select
        id={`curate-${name}`}
        name={name}
        value={value}
        onChange={onChange}
        className={`${underlineClass(error)} cursor-pointer appearance-none pr-5 ${value ? "" : "text-[#757575]"}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-white text-[#000000]">
            {option}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-0.5 top-1/2 -translate-y-1/2 text-[8px] text-[#262626]">
        ▼
      </span>
    </div>
    <FieldError message={error} />
  </div>
);

export default function CurateJourneyForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClose = () => {
    onClose?.();
    setFormData(initialFormData);
    setSubmitted(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.title.trim()) newErrors.title = "Title is required.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Contact number is required.";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (!formData.guests.trim()) {
      newErrors.guests = "Number of guests is required.";
    } else if (!/^\d+$/.test(formData.guests.trim()) || Number(formData.guests) < 1) {
      newErrors.guests = "Please enter a valid number of guests.";
    }
    if (!formData.travelMonth) newErrors.travelMonth = "Please select a travel month.";
    if (!formData.travelYear.trim()) {
      newErrors.travelYear = "Travel year is required.";
    } else if (!/^\d{4}$/.test(formData.travelYear.trim()) || Number(formData.travelYear) < currentYear) {
      newErrors.travelYear = `Please enter a valid year (${currentYear} or later).`;
    }
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    if (!formData.consent) newErrors.consent = "Please agree to be contacted.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        webform_id: WEBFORM_ID,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        title: formData.title.trim(),
        email_id: formData.email.trim(),
        country_code: formData.countryCode,
        phone: `${formData.countryCode} ${formData.phone.trim()}`,
        number_of_guests: formData.guests.trim(),
        travel_month: formData.travelMonth,
        travel_year: formData.travelYear.trim(),
        message: formData.message.trim(),
        consent: formData.consent ? "1" : "0",
      };

      const response = await fetch("/api/webform-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Submission Error:", data);
        alert(data.message || data.error?.message || "Something went wrong.");
        return;
      }

      onSubmit?.(formData);
      setSubmitted(true);
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error("Form Submission Error:", error);
      alert("Unable to submit the form. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 overflow-y-auto antialiased py-6 sm:py-0 text-left">
      <div className="bg-[#fafafa] p-[1px] w-full max-w-[1100px] rounded-[12px] my-auto">
        <div className="relative rounded-[12px] flex flex-col border border-[#262626] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#262626] px-6 sm:px-10 py-3.5">
            <h2 className="text-[16px] sm:text-[19px] font-[500] leading-tight tracking-[0.04em] text-[#000000]">
              Let Us Curate Your Journey
            </h2>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="cursor-pointer p-1 text-[#262626] transition-opacity hover:opacity-60 focus:outline-none"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <div className="px-6 py-5 sm:px-10 sm:py-6">
            {submitted ? (
              <div className="py-6">
                <h3 className="text-[17px] font-semibold text-[#000000]">Inquiry Submitted!</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#555555]">
                  Thank you! Our travel designers will start shaping a journey around your
                  plans and get back to you within 48hrs. Your details are never shared with
                  third parties.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 flex h-[35px] w-[130px] items-center justify-center rounded-[30px] bg-[#2C3078] text-[14px] font-medium text-[#FAFAFA] transition hover:opacity-90 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-y-4 sm:gap-y-5">
                {/* First Name + Last Name */}
                <div className="grid grid-cols-1 gap-x-12 gap-y-3.5 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label className={labelClass}>
                      First Name
                      <Required />
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Your first name"
                      className={underlineClass(errors.firstName)}
                    />
                    <FieldError message={errors.firstName} />
                  </div>

                  <div className="flex flex-col">
                    <label className={labelClass}>
                      Last Name
                      <Required />
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Your last name"
                      className={underlineClass(errors.lastName)}
                    />
                    <FieldError message={errors.lastName} />
                  </div>
                </div>

                {/* Title + Email */}
                <div className="grid grid-cols-1 gap-x-12 gap-y-3.5 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label className={labelClass}>
                      Title
                      <Required />
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Your title"
                      className={underlineClass(errors.title)}
                    />
                    <FieldError message={errors.title} />
                  </div>

                  <div className="flex flex-col">
                    <label className={labelClass}>
                      Email ID
                      <Required />
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email ID"
                      className={underlineClass(errors.email)}
                    />
                    <FieldError message={errors.email} />
                  </div>
                </div>

                {/* Contact Number + Guests */}
                <div className="grid grid-cols-1 gap-x-12 gap-y-3.5 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label className={labelClass}>
                      Contact Number
                      <Required />
                    </label>
                    <div className="flex items-end gap-3 pt-0.5">
                      <div
                        className={`relative min-w-[55px] shrink-0 border-b ${
                          errors.phone ? "border-red-400" : "border-[#262626]"
                        } pb-1`}
                      >
                        <span className="pointer-events-none text-[13px] sm:text-[14px] text-[#000000]">
                          {formData.countryCode}
                        </span>
                        <span className="pointer-events-none absolute right-0.5 top-1/2 -translate-y-1/2 text-[8px] text-[#262626]">
                          ▼
                        </span>
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleChange}
                          className="absolute inset-0 w-full h-full cursor-pointer opacity-0 text-[13px]"
                        >
                          {countryCodes.map((item, index) => (
                            <option
                              key={`${item.code}-${index}`}
                              value={item.code}
                              className="text-[#000000] bg-white"
                            >
                              {item.code} ({item.country})
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your number"
                        maxLength={10}
                        inputMode="numeric"
                        className={underlineClass(errors.phone)}
                      />
                    </div>
                    <FieldError message={errors.phone} />
                  </div>

                  <div className="flex flex-col">
                    <label className={labelClass}>
                      No. of Guests
                      <Required />
                    </label>
                    <input
                      type="text"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      placeholder="How many guests?"
                      inputMode="numeric"
                      maxLength={3}
                      className={underlineClass(errors.guests)}
                    />
                    <FieldError message={errors.guests} />
                  </div>
                </div>

                {/* Travel Month + Travel Year */}
                <div className="grid grid-cols-1 gap-x-12 gap-y-3.5 sm:grid-cols-2">
                  <SelectField
                    label="Travel Month"
                    name="travelMonth"
                    value={formData.travelMonth}
                    onChange={handleChange}
                    options={MONTHS}
                    placeholder="Which month would you like to travel?"
                    error={errors.travelMonth}
                  />
                  <div className="flex flex-col">
                    <label className={labelClass}>
                      Travel Year
                      <Required />
                    </label>
                    <input
                      type="text"
                      name="travelYear"
                      value={formData.travelYear}
                      onChange={handleChange}
                      placeholder={`e.g. ${currentYear + 1}`}
                      inputMode="numeric"
                      maxLength={4}
                      className={underlineClass(errors.travelYear)}
                    />
                    <FieldError message={errors.travelYear} />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <label className={`mb-1.5 ${labelClass}`}>
                    Your Message
                    <Required />
                  </label>
                  <textarea
                    rows={3}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us everything- your budget, your vision, your interests. The more the better."
                    className={`w-full resize-none rounded-[10px] border ${
                      errors.message ? "border-red-400" : "border-[#262626]"
                    } bg-transparent p-3 text-[13px] leading-relaxed tracking-[0.03em] text-[#000000] placeholder:text-[#757575] focus:outline-none`}
                  />
                  <FieldError message={errors.message} />
                </div>

                {/* Consent + Submit */}
                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col">
                    <label className="flex max-w-[320px] cursor-pointer items-start gap-2.5 select-none">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="mt-[3px] h-[16px] w-[16px] shrink-0 rounded-[4px] border border-[#262626] accent-[#2C3078] cursor-pointer"
                      />
                      <span className="text-[12px] sm:text-[12.5px] leading-[1.35] text-[#000000]">
                        I agree to be contacted by TravelOStyle regarding
                        <br className="hidden sm:inline" /> my inquiry.
                      </span>
                    </label>
                    <FieldError message={errors.consent} />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-[37px] w-[172px] shrink-0 rounded-[30px] bg-[#2C3078] text-[15px] font-medium tracking-[0.03em] text-[#FAFAFA] transition hover:opacity-90 cursor-pointer flex items-center justify-center self-end sm:self-auto disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                  </button>
                </div>

                <p className="pt-2 text-[12px] sm:text-[13px] tracking-[0.02em] text-[#555555] sm:whitespace-nowrap">
                  TravelOStyle typically responds within 48 hours. Your details are never shared
                  with third parties.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
