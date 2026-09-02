"use client";

import { useState } from "react";

const initialFormData = {
  firstName: "",
  email: "",
  consent: false,
};

export default function FooterNewsletterForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (!formData.email.trim()) {
      newErrors.email = "Please enter a valid email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.consent) {
      newErrors.consent = "Please agree to receive updates.";
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

      const payload = {
        webform_id: "newsletter_subscription",
        your_name: formData.firstName.trim(),
        email_id: formData.email.trim(),
        consent: formData.consent ? "1" : "0",
      };

      console.log("Newsletter Payload:", payload);

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
        console.error("Newsletter Submission Error:", data);

        alert(
          data.message ||
            data.error?.message ||
            "Something went wrong."
        );

        setIsSubmitting(false);
        return;
      }

      console.log("Newsletter Success Response:", data);

      setSubmitted(true);

      // Reset form
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error("Newsletter Submission Error:", error);

      alert(
        "Unable to subscribe. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[350px] mt-4 md:mt-0">
      {submitted ? (
        <div className="py-4">
          <h3 className="text-[16px] font-semibold">
            Subscribed Successfully!
          </h3>

          <p className="mt-2 text-[13px] text-white/80">
            Thank you for subscribing to TravelOStyle updates.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col"
        >
          {/* First Name */}
          <div className="flex flex-col">
            <label className="block text-[14px] font-medium mb-2 md:mb-3">
              Your Name*
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Your First Name"
              className={`w-full max-w-[708px] bg-transparent border-b ${
                errors.firstName
                  ? "border-red-400"
                  : "border-white/60 focus:border-white"
              } outline-none pb-2 placeholder:text-white/40 text-[14px]`}
            />

            {errors.firstName && (
              <p className="mt-1 text-[11px] text-red-400">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="block text-[14px] font-medium mt-6 md:mt-8 mb-2 md:mb-3">
              Email ID*
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email ID"
              className={`w-full max-w-[708px] bg-transparent border-b ${
                errors.email
                  ? "border-red-400"
                  : "border-white/60 focus:border-white"
              } outline-none pb-2 placeholder:text-white/40 text-[14px]`}
            />

            {errors.email && (
              <p className="mt-1 text-[11px] text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Consent */}
          <div className="flex flex-col mt-8">
            <label className="flex items-start gap-3 max-w-[290px] md:max-w-none cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="w-5 h-5 md:w-8 md:h-8 cursor-pointer mt-0.5 shrink-0 rounded"
              />

              <span className="text-[11px] md:text-[14px] leading-tight text-white/90">
                I agree to receive news, updates and more from
                TravelOStyle
              </span>
            </label>

            {errors.consent && (
              <p className="mt-1 text-[11px] text-red-400">
                {errors.consent}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="overflow-hidden mt-8 md:mt-10 w-full md:w-[366px] h-[44px] rounded-[100px] bg-[#FAFAFA] text-[#2C3078] text-[13px] md:text-[14px] font-bold md:font-semibold tracking-wide active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Subscribing..."
              : "Subscribe To Our Newsletter"}
          </button>
        </form>
      )}
    </div>
  );
}