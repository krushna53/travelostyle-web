"use client";

import Image from "next/image";
import { useState } from "react";
import bgImage from "./bgimg.png";
import { countryCodes } from "../utils/country";

export default function Form() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    countryCode: "+1",
    contact: "",
    message: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parameter 'e' added here
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email ID is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.countryCode.trim()) {
      newErrors.countryCode = "Country code is required.";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required.";
    } else if (!/^\d+$/.test(formData.contact.trim())) {
      newErrors.contact = "Contact number must contain only numbers.";
    } else if (formData.contact.trim().length < 7) {
      newErrors.contact = "Please enter a valid contact number.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    if (!formData.consent) {
      newErrors.consent = "Please provide your consent to continue.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
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
          body: JSON.stringify({
            webform_id: "contact_inquiry",
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            title: formData.title.trim(),
            email_id: formData.email.trim(),
            country_code: formData.countryCode,
            phone: formData.contact.trim(),
            message: formData.message.trim(),
            consent: formData.consent,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Submission Error:", data);
        alert(data.message || "Something went wrong.");
        return;
      }

      console.log("Success Response:", data);
      alert("Form Submitted Successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        title: "",
        email: "",
        countryCode: "+1",
        contact: "",
        message: "",
        consent: false,
      });

      setErrors({});
    } catch (error) {
      console.error(error);
      alert("Unable to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-fit md:min-h-[700px] w-full overflow-hidden">
      <Image
        src={bgImage}
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 w-full px-6 md:px-20 py-19 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
          <div className="w-full lg:w-[40%]">
            <h2 className="font-[Nohemi] font-semibold text-[#FAFAFA] text-[32px] md:text-[40px] leading-[40px] md:leading-[48px] tracking-[0.05em] max-w-[304px] md:max-w-[397px]">
              <span className="block">Can&apos;t decide</span>
              <span className="block">where to go?</span>
            </h2>
            <p className="font-nohemi mt-3 w-fit max-w-full text-[#FAFAFA] text-[16px] leading-[24px] font-normal tracking-[0.05em] md:max-w-[395px] md:text-[18px] md:leading-[32px]">
              Tell us what you&apos;re drawn to – your interests, how long you
              have, your budget, your group size and anything else – we&apos;ll
              come back with a curated list of destinations and journeys that
              make sense for you!
            </p>
          </div>

          <div className="w-full lg:w-[60%] lg:-mt-7">
            <form onSubmit={handleSubmit} className="text-white" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-[15px] md:text-[18px] leading-[18px] md:leading-[32px] font-normal tracking-[0.05em] text-white">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your first name"
                    className={`w-full border-b ${
                      errors.firstName ? "border-red-400" : "border-white"
                    } bg-transparent pb-2 md:pb-3 text-[15px] md:text-[14px] text-white placeholder:text-white/70 focus:outline-none`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-300">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-[15px] md:text-[18px] leading-[18px] md:leading-[32px] font-normal tracking-[0.05em] text-white">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Your last name"
                    className={`w-full border-b ${
                      errors.lastName ? "border-red-400" : "border-white"
                    } bg-transparent pb-2 md:pb-3 text-[15px] md:text-[14px] text-white placeholder:text-white/70 focus:outline-none`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-300">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="mb-2 block text-[15px] md:text-[18px] leading-[18px] md:leading-[32px] font-normal tracking-[0.05em] text-white">
                    Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Your title"
                    className={`w-full border-b ${
                      errors.title ? "border-red-400" : "border-white"
                    } bg-transparent pb-2 md:pb-3 text-[15px] md:text-[14px] text-white placeholder:text-white/70 focus:outline-none`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-300">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-[15px] md:text-[18px] leading-[18px] md:leading-[32px] font-normal tracking-[0.05em] text-white">
                    Email Id*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email Id"
                    className={`w-full border-b ${
                      errors.email ? "border-red-400" : "border-white"
                    } bg-transparent pb-2 md:pb-3 text-[15px] md:text-[14px] text-white placeholder:text-white/70 focus:outline-none`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-300">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Contact Number */}
              <div className="mt-6">
                <label className="mb-[0.25vw] ml-[3px] block w-[180px] h-[13px] text-[0.9vw] max-md:w-auto max-md:h-auto max-md:text-[14px] text-[#FAFAFA]">
                  <span className="hidden md:inline">Contact Number*</span>
                  <span className="md:hidden">Contact Number / WhatsApp*</span>
                </label>

                <div className="mt-[15px] flex items-center gap-[1vw]">
                  {/* Country Code */}
                  <div
                    className={`w-[48px] border-b ${
                      errors.countryCode ? "border-red-400" : "border-white/70"
                    } pb-[0.1vw]`}
                  >
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="w-full bg-transparent text-[0.72vw] max-md:text-[13px] text-white outline-none"
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

                  {/* Phone Number */}
                  <div
                    className={`w-[500px] max-md:w-full max-md:flex-1 border-b ${
                      errors.contact ? "border-red-400" : "border-white/70"
                    } pb-[0.1vw]`}
                  >
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="Your number"
                      className="w-[100px] bg-transparent text-[0.72vw] max-md:text-[13px] text-white placeholder:text-white/70 focus:outline-none"
                    />
                  </div>
                </div>
                {(errors.countryCode || errors.contact) && (
                  <p className="mt-1 text-xs text-red-300">
                    {errors.countryCode || errors.contact}
                  </p>
                )}
              </div>

              <div className="mt-8">
                <label className="font-nohemi mb-2 block font-normal text-[16px] md:text-[18px] leading-[32px] tracking-[0.05em] text-[#FAFAFA] md:text-white">
                  Your Message*
                </label>
                <textarea
                  rows={6}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us everything- your budget, your vision, your interests. The more the better."
                  className={`h-[200px] md:h-[180px] w-full rounded-[10px] border-2 ${
                    errors.message ? "border-red-400" : "border-white"
                  } bg-white p-4 text-black resize-none focus:outline-none`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-300">{errors.message}</p>
                )}
              </div>

              {/* Consent */}
              <div className="mt-8">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className={`h-[16px] md:h-[20px] w-[16px] md:w-[20px] shrink-0 cursor-pointer accent-white ${
                      errors.consent ? "outline outline-2 outline-red-400" : ""
                    }`}
                  />
                  <p className="font-normal text-[15px] md:text-[14px] leading-[18px] md:leading-[32px] tracking-[0.05em] text-white">
                    I consent to being contacted on the above provided details by
                    TravelOStyle
                  </p>
                </div>
                {errors.consent && (
                  <p className="mt-1 text-xs text-red-300">{errors.consent}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 flex h-[35px] md:h-[47px] w-fit text-[#2D3482] text-[16px] font-semibold md:text-base px-6 bg-white rounded-[100px] items-center justify-center whitespace-nowrap disabled:opacity-60 transition"
              >
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </button>

              <p className="font-nohemi mt-4 font-normal text-[16px] md:text-[12px] leading-[24px] md:leading-[32px] max-w-[334px] md:max-w-[1125px] tracking-[0.05em] text-[#FAFAFA] md:text-white/80">
                TravelOStyle typically responds within 48 hours. Your details are
                never shared with third parties.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}