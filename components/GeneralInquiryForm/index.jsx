"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { countryCodes } from "../utils/country";

const initialFormData = {
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  countryCode: "+1",
  phone: "",
  message: "",
  consent: false,
};

export default function GeneralInquiryForm({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts correcting the field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleClose = () => {
    onClose?.();
    setFormData(initialFormData);
    setSubmitted(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    // Last Name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    // Title
    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Please enter a valid email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Contact number is required.";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit mobile number.";
    }

    // Message
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    // Consent
    if (!formData.consent) {
      newErrors.consent = "Please agree to be contacted.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Drupal Webform REST Payload
      const payload = {
        webform_id: "contact_inquiry",
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        title: formData.title.trim(),
        email_id: formData.email.trim(),
        country_code: formData.countryCode,
        phone: `${formData.countryCode} ${formData.phone.trim()}`,
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

        alert(
          data.message ||
            data.error?.message ||
            "Something went wrong."
        );

        setIsSubmitting(false);
        return;
      }

      console.log("Success Response:", data);

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
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 overflow-y-auto antialiased py-6 sm:py-0">
      <div className="bg-[#fafafa] p-[1px] w-full max-w-[1100px] rounded-[12px] my-auto">
        <div className="relative rounded-[12px] flex flex-col border border-[#262626] shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#262626] px-6 sm:px-10 py-3.5">
            <h2 className="text-[16px] sm:text-[19px] font-[500] leading-tight tracking-[0.04em] text-[#000000]">
              Inquire With Us
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
                <h3 className="text-[17px] font-semibold text-[#000000]">
                  Inquiry Submitted!
                </h3>

                <p className="mt-2 text-[13px] leading-relaxed text-[#555555]">
                  Your inquiry has been received by team TravelOStyle. We
                  typically respond within 48hrs. Your details are never shared
                  with third parties.
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
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-y-4 sm:gap-y-5"
              >

                {/* First Name + Last Name */}
                <div className="grid grid-cols-1 gap-x-12 gap-y-3.5 sm:grid-cols-2">

                  {/* First Name */}
                  <div className="flex flex-col">
                    <label className="text-[13px] sm:text-[14px] font-medium leading-normal tracking-[0.02em] text-[#000000]">
                      First Name
                      <span className="text-[10px] align-top text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Your first name"
                      className={`w-full border-b ${
                        errors.firstName
                          ? "border-red-400"
                          : "border-[#262626]"
                      } bg-transparent pb-1 pt-0.5 text-[13px] sm:text-[14px] tracking-[0.04em] text-[#000000] placeholder:text-[#757575] focus:outline-none`}
                    />

                    {errors.firstName && (
                      <p className="mt-1 text-[11px] text-red-400">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col">
                    <label className="text-[13px] sm:text-[14px] font-medium leading-normal tracking-[0.02em] text-[#000000]">
                      Last Name
                      <span className="text-[10px] align-top text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Your last name"
                      className={`w-full border-b ${
                        errors.lastName
                          ? "border-red-400"
                          : "border-[#262626]"
                      } bg-transparent pb-1 pt-0.5 text-[13px] sm:text-[14px] tracking-[0.04em] text-[#000000] placeholder:text-[#757575] focus:outline-none`}
                    />

                    {errors.lastName && (
                      <p className="mt-1 text-[11px] text-red-400">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Title + Email */}
                <div className="grid grid-cols-1 gap-x-12 gap-y-3.5 sm:grid-cols-2">

                  {/* Title */}
                  <div className="flex flex-col">
                    <label className="text-[13px] sm:text-[14px] font-medium leading-normal tracking-[0.02em] text-[#000000]">
                      Title
                      <span className="text-[10px] align-top text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Your title"
                      className={`w-full border-b ${
                        errors.title
                          ? "border-red-400"
                          : "border-[#262626]"
                      } bg-transparent pb-1 pt-0.5 text-[13px] sm:text-[14px] tracking-[0.04em] text-[#000000] placeholder:text-[#757575] focus:outline-none`}
                    />

                    {errors.title && (
                      <p className="mt-1 text-[11px] text-red-400">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="text-[13px] sm:text-[14px] font-medium leading-normal tracking-[0.02em] text-[#000000]">
                      Email ID
                      <span className="text-[10px] align-top text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email ID"
                      className={`w-full border-b ${
                        errors.email
                          ? "border-red-400"
                          : "border-[#262626]"
                      } bg-transparent pb-1 pt-0.5 text-[13px] sm:text-[14px] tracking-[0.04em] text-[#000000] placeholder:text-[#757575] focus:outline-none`}
                    />

                    {errors.email && (
                      <p className="mt-1 text-[11px] text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Number */}
                <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                  <div className="flex flex-col">

                    <label className="text-[13px] sm:text-[14px] font-medium leading-normal tracking-[0.02em] text-[#000000]">
                      Contact Number
                      <span className="text-[10px] align-top text-red-500">
                        *
                      </span>
                    </label>

                    <div className="flex items-end gap-3 pt-0.5">

                      {/* Country Code */}
                      <div
                        className={`relative min-w-[55px] shrink-0 border-b ${
                          errors.phone
                            ? "border-red-400"
                            : "border-[#262626]"
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

                      {/* Phone */}
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your number"
                        maxLength={10}
                        inputMode="numeric"
                        className={`w-full border-b ${
                          errors.phone
                            ? "border-red-400"
                            : "border-[#262626]"
                        } bg-transparent pb-1 text-[13px] sm:text-[14px] leading-tight tracking-[0.04em] text-[#000000] placeholder:text-[#757575] focus:outline-none`}
                      />
                    </div>

                    {errors.phone && (
                      <p className="mt-1 text-[11px] text-red-400">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col">

                  <label className="mb-1.5 text-[13px] sm:text-[14px] font-medium leading-normal tracking-[0.02em] text-[#000000]">
                    Your Message
                    <span className="text-[10px] align-top text-red-500">
                      *
                    </span>
                  </label>

                  <textarea
                    rows={3}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us everything- your budget, your vision, your interests. The more the better."
                    className={`w-full resize-none rounded-[10px] border ${
                      errors.message
                        ? "border-red-400"
                        : "border-[#262626]"
                    } bg-transparent p-3 text-[13px] leading-relaxed tracking-[0.03em] text-[#000000] placeholder:text-[#757575] focus:outline-none`}
                  />

                  {errors.message && (
                    <p className="mt-1 text-[11px] text-red-400">
                      {errors.message}
                    </p>
                  )}
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

                    {errors.consent && (
                      <p className="mt-1 text-[11px] text-red-400">
                        {errors.consent}
                      </p>
                    )}
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
                  TravelOStyle typically responds within 48 hours. Your details
                  are never shared with third parties.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}