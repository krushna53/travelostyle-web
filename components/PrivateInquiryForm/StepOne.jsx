"use client";

import { useState } from "react";
import { TRAVEL_YEARS, TRAVEL_MONTHS } from "./constants";
import CustomSelect from "@/components/ui/CustomSelect";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{10}$/;

// Values here MUST match the Title element's "Option value" keys in the
// Drupal webform exactly (mr/ms/mrs/dr), not the displayed text.
const TITLE_OPTIONS = [
  { value: "mr", label: "Mr." },
  { value: "ms", label: "Ms." },
  { value: "mrs", label: "Mrs." },
  { value: "dr", label: "Dr." },
];

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

      <span className="text-[11px] text-[#4A4A4A]">
        {label}
      </span>
    </label>
  );
}

export default function StepOne({
  formData,
  updateField,
  showTravelWindow,
  phoneError: externalPhoneError,
  showValidation = false,
}) {
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    updateField(name, value);

    // Email format error
    if (name === "email" && emailError) {
      if (
        value.trim() === "" ||
        EMAIL_PATTERN.test(value.trim())
      ) {
        setEmailError("");
      }
    }

    // Phone format error
    if (name === "phone" && phoneError) {
      if (
        value.trim() === "" ||
        PHONE_PATTERN.test(value.trim())
      ) {
        setPhoneError("");
      }
    }
  };

  const handleEmailBlur = (e) => {
    const value = e.target.value.trim();

    if (value && !EMAIL_PATTERN.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePhoneBlur = (e) => {
    const value = e.target.value.trim();

    if (value && !PHONE_PATTERN.test(value)) {
      setPhoneError(
        "Please enter a valid 10-digit mobile number."
      );
    } else {
      setPhoneError("");
    }
  };

const displayedPhoneError =
  phoneError ||
  externalPhoneError ||
  (showValidation && !formData.phone?.trim()
    ? "This field is required."
    : "");

  const firstNameRequired =
    showValidation && !formData.firstName?.trim();

  const lastNameRequired =
    showValidation && !formData.lastName?.trim();

  const titleRequired =
    showValidation && !formData.title?.trim();

  const emailRequired =
    showValidation && !formData.email?.trim();

  const guestsRequired =
    showValidation && !formData.guests;

  const childrenRequired =
    showValidation && !formData.travelingWithChildren;
    

  return (
    <div className="w-full">
      <h3 className="text-[13px] font-bold text-[#1A1A1A]">
        Guest Details
      </h3>

      <div className="mt-3.5 grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">

        {/* First Name */}
        <div>
          <label className="block text-[11px] font-bold text-[#1A1A1A]">
            First Name*
          </label>

          <input
            type="text"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            placeholder="Your First Name"
            required
            aria-invalid={firstNameRequired}
            className={`mt-0.5 block w-full border-b bg-transparent pb-1 text-[11px] text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none ${
              firstNameRequired
                ? "border-red-500 focus:border-red-500"
                : "border-[#5A5A5A] focus:border-black"
            }`}
          />

          {firstNameRequired && (
            <p className="mt-0.5 text-[10.5px] font-medium text-red-600">
              This field is required.
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-[11px] font-bold text-[#1A1A1A]">
            Last Name*
          </label>

          <input
            type="text"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            placeholder="Your Last Name"
            required
            aria-invalid={lastNameRequired}
            className={`mt-0.5 block w-full border-b bg-transparent pb-1 text-[11px] text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none ${
              lastNameRequired
                ? "border-red-500 focus:border-red-500"
                : "border-[#5A5A5A] focus:border-black"
            }`}
          />

          {lastNameRequired && (
            <p className="mt-0.5 text-[10.5px] font-medium text-red-600">
              This field is required.
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-[11px] font-bold text-[#1A1A1A]">
            Title*
          </label>

          <CustomSelect
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            placeholder="Select your title"
            options={TITLE_OPTIONS}
            triggerClassName={`mt-0.5 border-b pb-1 text-[11px] text-[#1A1A1A] ${
              titleRequired
                ? "border-red-500"
                : "border-[#5A5A5A]"
            }`}
          />

          {titleRequired && (
            <p className="mt-0.5 text-[10.5px] font-medium text-red-600">
              This field is required.
            </p>
          )}
        </div>

        {/* Number / WhatsApp - Optional */}
        <div>
          <label className="block text-[11px] font-bold text-[#1A1A1A]">
            Number/ WhatsApp
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            onBlur={handlePhoneBlur}
            placeholder="Your Mobile Number"
            maxLength={10}
            inputMode="numeric"
            aria-invalid={Boolean(displayedPhoneError)}
            className={`mt-0.5 block w-full border-b bg-transparent pb-1 text-[11px] text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none ${
              displayedPhoneError
                ? "border-red-500 focus:border-red-500"
                : "border-[#5A5A5A] focus:border-black"
            }`}
          />

          {displayedPhoneError && (
            <p className="mt-0.5 text-[10.5px] font-medium text-red-600">
              {displayedPhoneError}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[11px] font-bold text-[#1A1A1A]">
            Email ID*
          </label>

          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            placeholder="Your Email ID"
            required
            aria-invalid={Boolean(
              emailRequired || emailError
            )}
            className={`mt-0.5 block w-full border-b bg-transparent pb-1 text-[11px] text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none ${
              emailRequired || emailError
                ? "border-red-500 focus:border-red-500"
                : "border-[#5A5A5A] focus:border-black"
            }`}
          />

          {emailRequired && !emailError && (
            <p className="mt-0.5 text-[10.5px] font-medium text-red-600">
              This field is required.
            </p>
          )}

          {emailError && (
            <p className="mt-0.5 text-[10.5px] font-medium text-red-600">
              {emailError}
            </p>
          )}
        </div>

        {/* No. of Guests */}
        <div>
          <label className="block text-[11px] font-bold text-[#1A1A1A]">
            No.of Guests*
          </label>

          <input
            type="number"
            min="1"
            name="guests"
            value={formData.guests || ""}
            onChange={handleChange}
            placeholder="Enter no .of Guests"
            required
            aria-invalid={guestsRequired}
            className={`mt-0.5 block w-full border-b bg-transparent pb-1 text-[11px] text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none ${
              guestsRequired
                ? "border-red-500 focus:border-red-500"
                : "border-[#5A5A5A] focus:border-black"
            }`}
          />

          {guestsRequired && (
            <p className="mt-0.5 text-[10.5px] font-medium text-red-600">
              This field is required.
            </p>
          )}
        </div>

        {/* Traveling with Children */}
        <div className="pt-0.5">
          <p className="mb-1.5 text-[11px] font-bold text-[#1A1A1A]">
            Are you traveling with children?* (under 12yrs)
          </p>

          <div
            className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 ${
              childrenRequired ? "text-red-600" : ""
            }`}
          >
            <RadioOption
              name="travelingWithChildren"
              value="Yes"
              checked={
                formData.travelingWithChildren === "Yes"
              }
              onChange={handleChange}
              label="Yes"
            />

            <RadioOption
              name="travelingWithChildren"
              value="No"
              checked={
                formData.travelingWithChildren === "No"
              }
              onChange={handleChange}
              label="No"
            />
          </div>

          {childrenRequired && (
            <p className="mt-1 text-[10.5px] font-medium text-red-600">
              This field is required.
            </p>
          )}
        </div>

   
        <div className="pt-0.5">
          <p className="mb-1.5 text-[11px] font-bold text-[#1A1A1A]">
            Do you require assistance with flight bookings?
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <RadioOption
              name="flightAssistance"
              value="Yes"
              checked={
                formData.flightAssistance === "Yes"
              }
              onChange={handleChange}
              label="Yes"
            />

            <RadioOption
              name="flightAssistance"
              value="No"
              checked={
                formData.flightAssistance === "No"
              }
              onChange={handleChange}
              label="No"
            />

            <RadioOption
              name="flightAssistance"
              value="Not sure yet"
              checked={
                formData.flightAssistance === "Not sure yet"
              }
              onChange={handleChange}
              label="Not sure yet"
            />
          </div>
        </div>

        {/* Travel Window */}
        {showTravelWindow && (
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-[11px] font-bold text-[#1A1A1A]">
              When do you want to travel?
            </p>

            <div className="grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
              <CustomSelect
                name="travelYear"
                value={formData.travelYear || ""}
                onChange={handleChange}
                placeholder="Pick Year of Travel"
                options={TRAVEL_YEARS.map((year) => ({
                  value: year,
                  label: year,
                }))}
                triggerClassName="mt-0.5 border-b border-[#5A5A5A] pb-1 text-[11px] text-[#1A1A1A]"
              />

              <CustomSelect
                name="travelMonth"
                value={formData.travelMonth || ""}
                onChange={handleChange}
                placeholder="Pick Month of Travel"
                options={TRAVEL_MONTHS.map((month) => ({
                  value: month,
                  label: month,
                }))}
                triggerClassName="mt-0.5 border-b border-[#5A5A5A] pb-1 text-[11px] text-[#1A1A1A]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}