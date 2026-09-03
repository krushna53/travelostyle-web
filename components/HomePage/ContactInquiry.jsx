"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { countryCodes } from "../utils/country";

export default function ContactInquiry() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    countryCode: "+1",
    phone: "",
    message: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

    if (!formData.phone.trim()) {
      newErrors.phone = "Contact number is required.";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit mobile number.";
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
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
            phone: formData.phone.trim(),
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
        phone: "",
        message: "",
        consent: false,
      });

      setErrors({});
    } catch (error) {
      console.error(error);
      alert("Unable to submit the form. Please try again.");
    }
  };

  return (
  <section className="w-full px-0 py-0 max-md:px-0 max-md:py-0 mt-8">
      <div
        className="relative mx-auto h-[48vw] max-w-[200vw] overflow-hidden
        max-md:h-auto max-w-full max-md:min-h-screen"
      >
        <Image
          src="/Australia.svg"
          alt="Australia"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0" />
        <div className="absolute inset-0" />

        <div
          className="relative z-10 flex h-full gap-[5vw]
          px-[4.5vw] py-[2vw] text-[#FAFAFA]
          max-md:flex-col max-md:px-6 max-md:py-8 max-md:gap-6"
        >
          <div className="w-[28%] pt-[1vw] max-md:w-full max-md:pt-0">
          <h2
 className="mt-[3px] mb-[2px] w-[397px] text-[40px] font-semibold
leading-[48px] tracking-[0.05em] text-[#FAFAFA]
max-md:w-full max-md:h-auto
  max-md:text-[length:var(--fs-heading-nohemi-semibold)]
  max-md:leading-[length:var(--lh-heading-nohemi-semibold)]"
>
  Not sure where to<br className="hidden max-md:inline" /> begin? Talk to us!
</h2>

            <p
  className="mt-[15px] w-[395px] max-w-[395px] text-[18px]
leading-[24px] font-normal tracking-[0.05em] text-[#FAFAFA]
 max-md:w-[336px] max-md:max-w-[336px] max-md:mt-3
      max-md:text-[16px]
      max-md:leading-[24px]
      max-md:tracking-[0.05em]"
>
  We’re here to design the kind of travel<br className="hidden max-md:inline" /> that actually gives
  something back.
</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 pt-[0.1vw] max-md:pt-0"
            noValidate
          >
            <div
              className="grid grid-cols-2 gap-x-[4vw] gap-y-[1.6vw]
              max-md:grid-cols-1 max-md:gap-y-5"
            >
              <div>
              <label className="mb-[0.25vw] ml-[3px] block w-[145px] h-[13px] text-[0.9vw] max-md:w-auto max-md:h-auto max-md:text-[14px] text-[#FAFAFA]">
  First Name*
</label>

             <input
  type="text"
  name="firstName"
  value={formData.firstName}
  onChange={handleChange}
  placeholder="Your first name"
  className={`w-[350px] border-b ${
    errors.firstName
      ? "border-red-400"
      : "border-white/70"
  } bg-transparent pb-[0.45vw] pl-[3px] text-[0.7vw]
  max-md:w-full max-md:pb-2 max-md:text-[13px] text-white
  placeholder:text-white/45 focus:outline-none`}
/>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-300">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
              <label className="mb-[0.25vw] ml-[3px] block w-[145px] h-[13px] text-[0.9vw] max-md:w-auto max-md:h-auto max-md:text-[14px] text-[#FAFAFA]">
  Last Name*
</label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Your last name"
                  className={`w-[350px] border-b ${
    errors.firstName
      ? "border-red-400"
      : "border-white/70"
  } bg-transparent pb-[0.45vw] pl-[3px] text-[0.7vw]
  max-md:w-full max-md:pb-2 max-md:text-[13px] text-white
  placeholder:text-white/45 focus:outline-none`}
                />

                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-300">
                    {errors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-[0.25vw] ml-[3px] block w-[145px] h-[13px] text-[0.9vw] max-md:w-auto max-md:h-auto max-md:text-[14px] text-[#FAFAFA]">
  Title*
</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Your title"
                  className={`w-[350px] border-b ${
    errors.firstName
      ? "border-red-400"
      : "border-white/70"
  } bg-transparent pb-[0.45vw] pl-[3px] text-[0.7vw]
  max-md:w-full max-md:pb-2 max-md:text-[13px] text-white
  placeholder:text-white/45 focus:outline-none`}
                />

                {errors.title && (
                  <p className="mt-1 text-xs text-red-300">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
             <label className="mb-[0.25vw] ml-[3px] block w-[145px] h-[13px] text-[0.9vw] max-md:w-auto max-md:h-auto max-md:text-[14px] text-[#FAFAFA]">
  Email*
</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email ID"
                  className={`w-[350px] border-b ${
    errors.firstName
      ? "border-red-400"
      : "border-white/70"
  } bg-transparent pb-[0.45vw] pl-[3px] text-[0.7vw]
  max-md:w-full max-md:pb-2 max-md:text-[13px] text-white
  placeholder:text-white/45 focus:outline-none`}
                />

                {errors.email && (
                  <p className="mt-1 text-xs text-red-300">
                    {errors.email}
                  </p>
                )}
              </div>
<div>
  <label
    className="mb-[0.25vw] ml-[3px] block w-[180px] h-[13px]
    text-[0.9vw] max-md:w-auto max-md:h-auto max-md:text-[14px]
    text-[#FAFAFA]"
  >
    Contact Number*
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
        className="w-full bg-transparent text-[0.72vw]
        max-md:text-[13px] text-white outline-none"
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
      className={` w-[500px] max-md:w-full max-md:flex-1 border-b ${
        errors.phone ? "border-red-400" : "border-white/70"
      } pb-[0.1vw]`}
    >
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Your number"
        className="w-[100px] bg-transparent text-[0.72vw]
        max-md:text-[13px] text-white
        placeholder:text-white/70 focus:outline-none"
      />
    </div>
  </div>

  {errors.phone && (
    <p className="mt-1 text-xs text-red-300">
      {errors.phone}
    </p>
  )}
</div>
</div>

            <div className="mt-[1.7vw]">
            <label
  className="mt-[5px] mb-[0.45vw] block w-[169px] h-[13px]
  text-[13px] leading-[13px] text-[#FAFAFA]
  max-md:w-auto max-md:h-auto max-md:text-[14px] max-md:leading-normal"
>
  Your Message*
</label>
             <textarea
  rows={5}
  name="message"
  value={formData.message}
  onChange={handleChange}
  placeholder={
    isMobile
      ? "Tell us everything– your budget, your\nvision, your interests. The more the\nbetter."
      : "Tell us everything- your budget, your vision, your interests. The more the better."
  }
  className={`mt-[10px]
    h-[9.58vw] min-h-[200px]
    w-full resize-none
    rounded-[10px]
    border-2 border-[#D9D9D9]
    bg-white
    px-[1vw] py-[0.75vw]
    text-[0.7vw]
    leading-[1.4]
    text-[#222]
    placeholder:text-[#8d8d8d]
    focus:outline-none
    max-md:h-[184px] max-md:min-h-[184px]
    max-md:rounded-md
    max-md:px-3 max-md:py-3
    max-md:text-[13px]
    ${errors.message ? "border-red-400" : ""}`}
  />

              {errors.message && (
                <p className="mt-1 text-xs text-red-300">
                  {errors.message}
                </p>
              )}
            </div>

  <div className="flex flex-col">
  <div className="mt-5 w-full max-md:mt-5">
  {/* Checkbox + first consent line */}
  <div className="flex items-start gap-3">
    <input
      type="checkbox"
      name="consent"
      checked={formData.consent}
      onChange={handleChange}
      className={`mt-0 h-[16px] w-[16px] shrink-0 cursor-pointer accent-white
      ${errors.consent ? "outline outline-2 outline-red-400" : ""}`}
    />

    <p
      className="h-[13px] w-[686px]
      text-[13px] leading-[13px] text-white/90
      max-md:h-auto max-md:w-auto
      max-md:text-[12px] max-md:leading-5"
    >
      I consent to being contacted on the above provided details by TravelOStyle.
    </p>
  </div>

  {/* Second line — directly below checkbox */}
  

  {errors.consent && (
    <p className="mt-1 text-xs text-red-300">
      {errors.consent}
    </p>
  )}

            </div>

           <button
  type="submit"
  className="mt-[1vw] flex h-[40px] w-[150px] items-center justify-center gap-[10px] rounded-[100px] bg-white px-[24px] py-[16px] text-[14px] font-semibold text-[#2f2d89] max-md:mt-5 max-md:mb-5 max-md:h-[37px] max-md:w-auto max-md:self-start max-md:px-4 max-md:py-3"
>
  Submit Inquiry
</button>
<p
    className="mt-[20px] w-full h-[13px]
    text-[13px] leading-[13px] text-white/70
    max-md:h-auto max-md:w-auto
    max-md:mt-2
    max-md:text-[12px] max-md:leading-5"
  >
    TravelOStyle typically responds within 48 hours.
    Your details are never shared with third parties.
  </p>
          </div>
          </form>
        </div>
      </div>
    </section>
  );
}