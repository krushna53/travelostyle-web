"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@heroui/react";
import Image from "@/components/SafeImage";
import TermsModal from "./TermsModal";

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const TOTAL_STEPS = 7;

function depositFor(price) {
  const p = Number(price);
  if (p < 2499) return 500;
  if (p <= 4999) return 1000;
  return 1500;
}

// `journey.date` is whatever's available for this trip's nearest departure —
// an ISO date string ("2026-09-07") when a book_your_journey node exists for
// it, otherwise empty. Range strings like "Jun-Nov 2026" are also handled
// here in case a caller ever passes free text instead.
function parseJourneyDate(str) {
  if (!str) return null;
  // Check range patterns ("Jun-Nov 2026", "June to Dec 2026") first — native
  // Date parsing of hyphenated month ranges is inconsistent across engines
  // and can silently pick the wrong month, so don't let it run on these.
  const rangeMatch = str.match(/([A-Za-z]+)\s*(?:-|–|to)\s*[A-Za-z]+\s+(\d{4})/);
  if (rangeMatch) {
    const [, month, year] = rangeMatch;
    const rangeDate = new Date(`${month} 1, ${year}`);
    if (!isNaN(rangeDate.getTime())) return rangeDate;
  }
  const direct = new Date(str);
  if (!isNaN(direct.getTime())) return direct;
  return null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts an optional leading +, then 7-15 digits, with spaces/dashes/parens
// allowed as separators (covers international formats without being overly strict).
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

function isValidPhone(value) {
  const trimmed = value.trim();
  const digitCount = trimmed.replace(/\D/g, "").length;
  return PHONE_PATTERN.test(trimmed) && digitCount >= 7;
}

// Used to cap the Date of Birth picker so it can't be set to a future date.
const TODAY_STR = new Date().toISOString().slice(0, 10);

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad",
  "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
  "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
  "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
  "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

// Major departure hubs — travelers can still type any city not listed here;
// this is just a convenience shortlist for the autocomplete suggestions.
const DEPARTURE_CITIES = [
  "New York", "Newark", "Los Angeles", "San Francisco", "Chicago", "Boston", "Washington D.C.", "Miami",
  "Atlanta", "Dallas", "Houston", "Denver", "Seattle", "Las Vegas", "Orlando", "Philadelphia", "Phoenix",
  "San Diego", "Detroit", "Minneapolis", "Charlotte", "Toronto", "Vancouver", "Montreal", "London", "Paris",
  "Frankfurt", "Amsterdam", "Madrid", "Rome", "Zurich", "Dubai", "Doha", "Istanbul", "Delhi", "Mumbai",
  "Bangalore", "Hyderabad", "Chennai", "Singapore", "Hong Kong", "Tokyo", "Sydney",
];

const AIRLINES = [
  "American Airlines", "Delta Air Lines", "United Airlines", "Southwest Airlines", "JetBlue", "Alaska Airlines",
  "Air Canada", "British Airways", "Lufthansa", "Air France", "KLM", "Emirates", "Qatar Airways",
  "Etihad Airways", "Turkish Airlines", "Singapore Airlines", "Cathay Pacific", "Japan Airlines", "ANA",
  "Qantas", "Air India", "IndiGo", "Vistara", "Swiss International Air Lines", "Virgin Atlantic",
];

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Mandarin", "Cantonese", "Japanese",
  "Korean", "Hindi", "Gujarati", "Punjabi", "Marathi", "Bengali", "Tamil", "Telugu", "Arabic", "Russian",
  "Vietnamese", "Thai", "Indonesian", "Dutch", "Greek", "Hebrew", "Turkish", "Polish", "Swedish",
];

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const DEPOSIT_CUTOFF_DAYS = 90; // matches the Terms & Conditions final-payment window (3 months)

// Deposit is only offered when departure is safely more than 3 months out.
// If we can't confidently parse the date (or there's no nearest departure
// for this journey), default to requiring full payment rather than risk
// under-collecting close to departure.
function isDepositEligible(dateStr) {
  const departure = parseJourneyDate(dateStr);
  if (!departure) return false;
  const diffDays = (departure.getTime() - Date.now()) / MS_PER_DAY;
  return diffDays > DEPOSIT_CUTOFF_DAYS;
}

function emptyTraveler(type) {
  return {
    type,
    fullName: "",
    passportNumber: "",
    passportExpiry: "",
    nationality: "",
    dob: "",
    gender: "Female",
    mealType: "No Preference",
    mealAllergies: "",
  };
}

function emptyLead() {
  return {
    fullName: "",
    passportNumber: "",
    passportExpiry: "",
    nationality: "",
    dob: "",
    gender: "Female",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    mealType: "No Preference",
    mealAllergies: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
  };
}

// `journey` expects: { title, image, destinationsList, location, date,
// duration, price } — a trip card already has title/image/duration(days)/
// price; `destinationsList`/`location` fall back to the journey's region,
// and `date` to its nearest departure's start date (both optional — the
// form degrades gracefully with "-" / full-payment-only when absent).
export default function BookingModal({ journey, onClose }) {
  const [step, setStep] = useState(1);
  const [counts, setCounts] = useState({ adults: 1, children: 0, infants: 0 });
  // Only additional travelers (Traveler 2+) — the lead traveler (always one
  // of the adults) has their own record in `lead`, merging identity/passport
  // and contact/address into a single set of fields.
  const [travelers, setTravelers] = useState([]);
  const [lead, setLead] = useState(emptyLead());
  // Not user-editable — flexible dates aren't offered for escorted group
  // journeys with a fixed departure, so this is always "No".
  const flexibleDates = "No";
  const [flights, setFlights] = useState({ departureCity: "", airline: "", cabin: "Economy", frequentFlyer: "" });
  const [transfers, setTransfers] = useState({ airport: "Yes", guide: "Yes", language: [] });
  const [visa, setVisa] = useState("Yes");
  const [insurance, setInsurance] = useState("Yes");
  const [notes, setNotes] = useState({ occasion: "", medical: "", other: "" });
  const [declaration, setDeclaration] = useState({ checked: false });
  const [payMode, setPayMode] = useState("deposit");
  const [showTerms, setShowTerms] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");

  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const stripeRef = useRef(null);
  const elementsRef = useRef(null);
  const paymentElRef = useRef(null);

  // The lead traveler occupies one adult slot, so additional travelers
  // (this array) only need `adults - 1` Adult records plus all Child records.
  function resizeTravelers(prev, adults, children) {
    const additionalAdults = Math.max(adults - 1, 0);
    const total = additionalAdults + children;
    const next = [...prev];
    while (next.length < total) {
      next.push(emptyTraveler(next.length < additionalAdults ? "Adult" : "Child"));
    }
    while (next.length > total) {
      next.pop();
    }
    return next.map((t, i) => ({ ...t, type: i < additionalAdults ? "Adult" : "Child" }));
  }

  const travelerTotal = counts.adults + counts.children;
  const depositEligible = useMemo(() => isDepositEligible(journey.date), [journey.date]);
  // Only trust "deposit" once the departure date has actually qualified —
  // this avoids ever charging a deposit amount for a trip inside the
  // 90-day window, even if `payMode` state hasn't been touched yet.
  const effectivePayMode = depositEligible ? payMode : "full";

  const amountDue = useMemo(() => {
    const n = Math.max(travelerTotal, 1);
    const per = effectivePayMode === "deposit" ? depositFor(journey.price) : Number(journey.price);
    return per * n;
  }, [effectivePayMode, travelerTotal, journey.price]);

  function updateCount(type, delta) {
    setCounts((prev) => {
      const min = type === "adults" ? 1 : 0;
      const nextVal = Math.max(min, prev[type] + delta);
      const next = { ...prev, [type]: nextVal };
      if (type === "adults" || type === "children") {
        setTravelers((prevTravelers) => resizeTravelers(prevTravelers, next.adults, next.children));
      }
      return next;
    });
  }

  function updateTraveler(index, field, value) {
    setTravelers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  }

  function validateStep() {
    setValidationMsg("");
    if (step === 2) {
      if (
        !lead.fullName.trim() ||
        !lead.dob ||
        !lead.passportNumber.trim() ||
        !lead.passportExpiry ||
        !lead.nationality.trim()
      ) {
        setValidationMsg(
          "Please complete Full Name, Date of Birth, and all passport details (Number, Expiry Date, Nationality) for the lead traveler."
        );
        return false;
      }
      if (lead.dob > TODAY_STR) {
        setValidationMsg("Date of Birth for the lead traveler cannot be a future date.");
        return false;
      }
      if (
        !lead.phone.trim() ||
        !lead.email.trim() ||
        !lead.address1.trim() ||
        !lead.city.trim() ||
        !lead.state.trim() ||
        !lead.zip.trim() ||
        !lead.country.trim()
      ) {
        setValidationMsg("Please provide the lead traveler's contact number, email, and address (line 1, city, state, zip, country).");
        return false;
      }
      if (!isValidPhone(lead.phone)) {
        setValidationMsg("Please enter a valid contact number for the lead traveler.");
        return false;
      }
      if (!isValidEmail(lead.email)) {
        setValidationMsg("Please enter a valid email address for the lead traveler.");
        return false;
      }
      if (!lead.emergencyContactPhone.trim()) {
        setValidationMsg("Please provide an emergency contact number for the lead traveler.");
        return false;
      }
      if (!isValidPhone(lead.emergencyContactPhone)) {
        setValidationMsg("Please enter a valid emergency contact phone number.");
        return false;
      }
      for (const t of travelers) {
        if (
          !t.fullName.trim() ||
          !t.dob ||
          !t.passportNumber.trim() ||
          !t.passportExpiry ||
          !t.nationality.trim()
        ) {
          setValidationMsg(
            "Please complete Full Name, Date of Birth, and all passport details (Number, Expiry Date, Nationality) for every traveler."
          );
          return false;
        }
        if (t.dob > TODAY_STR) {
          setValidationMsg(`Date of Birth for ${t.fullName || "traveler"} cannot be a future date.`);
          return false;
        }
      }
    }
    if (step === 5) {
      if (!declaration.checked) {
        setValidationMsg("Please confirm the declaration and accept the Terms & Conditions to continue.");
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validateStep()) return;
    if (step === TOTAL_STEPS) {
      onClose();
      return;
    }
    setStep((s) => s + 1);
  }

  const bookingEmailSentRef = useRef(false);
  async function submitBookingRequest(paymentIntentId, paymentStatus = "Paid") {
    if (bookingEmailSentRef.current) return;
    bookingEmailSentRef.current = true;
    try {
      await fetch("/api/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journey: {
            title: journey.title,
            destinationsList: journey.destinationsList,
            location: journey.location,
            date: journey.date,
            duration: journey.duration,
            price: journey.price,
          },
          counts,
          travelers,
          lead,
          flexibleDates,
          flights,
          transfers,
          visa,
          insurance,
          notes,
          declaration,
          payMode: effectivePayMode,
          amountDue,
          paymentStatus,
          paymentIntentId,
        }),
      });
    } catch (err) {
      // Non-blocking: the booking has already been paid for at this point,
      // so a failed notification shouldn't disrupt the customer's flow —
      // surfaced only in the console for now.
      console.error("Failed to send booking notification:", err);
      bookingEmailSentRef.current = false;
    }
  }
  function back() {
    setValidationMsg("");
    if (step > 1) setStep((s) => s - 1);
  }

  // ---- Stripe payment (step 7) ----
  useEffect(() => {
    if (step !== 7) return;
    let cancelled = false;

    async function loadStripeJs() {
      if (window.Stripe) return window.Stripe;
      await new Promise((resolve, reject) => {
        const existing = document.querySelector('script[src="https://js.stripe.com/v3/"]');
        if (existing) {
          existing.addEventListener("load", resolve);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      return window.Stripe;
    }

    async function init() {
      setPaymentError("");
      setPaymentReady(false);
      try {
        if (!STRIPE_PUBLISHABLE_KEY) {
          throw new Error("Stripe publishable key not configured yet (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).");
        }
        const StripeCtor = await loadStripeJs();
        if (cancelled) return;
        stripeRef.current = StripeCtor(STRIPE_PUBLISHABLE_KEY);

        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(amountDue * 100),
            currency: "usd",
            metadata: {
              tour: journey.title,
              travelers: String(travelerTotal),
              payMode: effectivePayMode,
              leadEmail: lead.email || "",
              leadName: lead.fullName || "",
            },
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.clientSecret) {
          throw new Error(data.error || "Could not initialize payment.");
        }
        if (cancelled) return;
        elementsRef.current = stripeRef.current.elements({ clientSecret: data.clientSecret });
        // Link is hidden so the confirmed payment_method.type always reflects
        // the actual funding method (card / us_bank_account) shown in our
        // booking emails, instead of resolving to "link".
        const paymentElement = elementsRef.current.create("payment", {
          wallets: { link: "never" },
        });
        paymentElement.mount("#booking-payment-element");
        paymentElRef.current = paymentElement;
        setPaymentReady(true);
      } catch (err) {
        setPaymentError(err.message);
      }
    }
    init();

    return () => {
      cancelled = true;
      if (paymentElRef.current) {
        paymentElRef.current.unmount?.();
        paymentElRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function handlePay() {
    if (!stripeRef.current || !elementsRef.current) return;
    setPayLoading(true);
    setPaymentError("");
    const { error, paymentIntent } = await stripeRef.current.confirmPayment({
      elements: elementsRef.current,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });
    setPayLoading(false);
    if (error) {
      setPaymentError(error.message);
      return;
    }
    // Card payments resolve to "succeeded" immediately. ACH (us_bank_account)
    // resolves to "processing" here — the money hasn't actually cleared yet,
    // it can still fail days later, so don't tell the customer it's "Paid".
    // The /api/stripe-webhook route sends a separate follow-up once Stripe
    // confirms the ACH transfer has actually settled.
    if (paymentIntent?.status === "processing") {
      setPaymentProcessing(true);
      submitBookingRequest(paymentIntent?.id, "Processing (ACH — funds not yet cleared)");
    } else {
      setPaymentSuccess(true);
      submitBookingRequest(paymentIntent?.id, "Paid");
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-0 py-0 sm:px-4 sm:py-6">
        <button type="button" aria-label="Close booking backdrop" className="absolute inset-0 cursor-pointer" onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          className="relative z-10 flex h-dvh w-full flex-col overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.25)] sm:h-auto sm:max-h-[92vh] sm:max-w-3xl sm:rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#e5e3f5] px-4 pb-4 pt-5 sm:px-7 sm:pt-6">
            <h3 className="text-lg font-semibold text-[#3a219a] sm:text-2xl">Book: {journey.title}</h3>
            <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center text-[#3a219a] hover:opacity-70">
              <span className="relative block h-5 w-5">
                <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 rotate-45 rounded bg-current" />
                <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 -rotate-45 rounded bg-current" />
              </span>
            </button>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 px-4 pt-4 sm:px-7">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-[#2C3078]" : "bg-[#e5e3f5]"}`} />
            ))}
          </div>

          <div className="overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <StepTitle n={1} title="Number of Travelers" sub="Tell us how many travelers are joining this journey." />
                <div className="flex flex-wrap gap-8">
                  <CounterField label="Adults (12+) *" value={counts.adults} onDec={() => updateCount("adults", -1)} onInc={() => updateCount("adults", 1)} />
                  <CounterField label="Children (2–11)" value={counts.children} onDec={() => updateCount("children", -1)} onInc={() => updateCount("children", 1)} />
                  <CounterField label="Infants (0–2)" value={counts.infants} onDec={() => updateCount("infants", -1)} onInc={() => updateCount("infants", 1)} />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <StepTitle n={2} title="Traveler & Passport Details" sub="Lead traveler details are required first, followed by one record per additional Adult/Child traveler." />

                <FieldsetBox title="Lead Traveler">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <TextInput label="Full Name (as per passport) *" value={lead.fullName} onChange={(v) => setLead((p) => ({ ...p, fullName: v }))} />
                    <SelectInput
                      label="Gender"
                      value={lead.gender}
                      onChange={(v) => setLead((p) => ({ ...p, gender: v }))}
                      options={["Female", "Male", "Non-binary", "Prefer not to say"]}
                    />
                    <TextInput label="WhatsApp Number *" type="tel" value={lead.phone} onChange={(v) => setLead((p) => ({ ...p, phone: v }))} />
                    <TextInput label="Email Address *" type="email" value={lead.email} onChange={(v) => setLead((p) => ({ ...p, email: v }))} />
                    <TextInput label="Passport Number *" value={lead.passportNumber} onChange={(v) => setLead((p) => ({ ...p, passportNumber: v }))} />
                    <TextInput label="Passport Expiry Date *" type="date" value={lead.passportExpiry} onChange={(v) => setLead((p) => ({ ...p, passportExpiry: v }))} />
                    <TextInput label="Nationality *" value={lead.nationality} onChange={(v) => setLead((p) => ({ ...p, nationality: v }))} />
                    <TextInput label="Date of Birth *" type="date" max={TODAY_STR} value={lead.dob} onChange={(v) => setLead((p) => ({ ...p, dob: v }))} />
                    <div className="sm:col-span-2">
                      <TextInput label="Address Line 1 *" value={lead.address1} onChange={(v) => setLead((p) => ({ ...p, address1: v }))} />
                    </div>
                    <div className="sm:col-span-2">
                      <TextInput label="Address Line 2" value={lead.address2} onChange={(v) => setLead((p) => ({ ...p, address2: v }))} />
                    </div>
                    <TextInput label="City *" value={lead.city} onChange={(v) => setLead((p) => ({ ...p, city: v }))} />
                    <TextInput label="State *" value={lead.state} onChange={(v) => setLead((p) => ({ ...p, state: v }))} />
                    <TextInput label="Zip Code *" value={lead.zip} onChange={(v) => setLead((p) => ({ ...p, zip: v }))} />
                    <AutocompleteInput label="Country *" value={lead.country} onChange={(v) => setLead((p) => ({ ...p, country: v }))} options={COUNTRIES} />
                  </div>

                  <p className="mb-1.5 mt-4 text-[11px] font-bold uppercase tracking-wide text-[#7772a8]">Meal Preferences</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <SelectInput
                      label="Meal Type"
                      value={lead.mealType}
                      onChange={(v) => setLead((p) => ({ ...p, mealType: v }))}
                      options={["No Preference", "Vegetarian", "Vegan", "Gluten-Free", "Kosher", "Halal", "Jain"]}
                    />
                    <TextInput label="Food Allergies / Restrictions" value={lead.mealAllergies} onChange={(v) => setLead((p) => ({ ...p, mealAllergies: v }))} />
                  </div>

                  <p className="mb-1.5 mt-4 text-[11px] font-bold uppercase tracking-wide text-[#7772a8]">Emergency Contact</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <TextInput label="Name" value={lead.emergencyContactName} onChange={(v) => setLead((p) => ({ ...p, emergencyContactName: v }))} />
                    <TextInput label="Relationship" value={lead.emergencyContactRelationship} onChange={(v) => setLead((p) => ({ ...p, emergencyContactRelationship: v }))} />
                    <div className="sm:col-span-2">
                      <TextInput label="Contact Number *" type="tel" value={lead.emergencyContactPhone} onChange={(v) => setLead((p) => ({ ...p, emergencyContactPhone: v }))} />
                    </div>
                  </div>
                </FieldsetBox>

                {travelers.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {travelers.map((t, i) => (
                      <div key={i} className="rounded-lg bg-[#f6f5fc] p-4">
                        <p className="mb-3 text-sm font-semibold text-[#3a219a]">
                          Traveler {i + 2} ({t.type})
                        </p>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <TextInput label="Full Name (as per passport) *" value={t.fullName} onChange={(v) => updateTraveler(i, "fullName", v)} />
                          <TextInput label="Passport Number *" value={t.passportNumber} onChange={(v) => updateTraveler(i, "passportNumber", v)} />
                          <TextInput label="Passport Expiry Date *" type="date" value={t.passportExpiry} onChange={(v) => updateTraveler(i, "passportExpiry", v)} />
                          <TextInput label="Nationality *" value={t.nationality} onChange={(v) => updateTraveler(i, "nationality", v)} />
                          <TextInput label="Date of Birth *" type="date" max={TODAY_STR} value={t.dob} onChange={(v) => updateTraveler(i, "dob", v)} />
                          <SelectInput
                            label="Gender"
                            value={t.gender}
                            onChange={(v) => updateTraveler(i, "gender", v)}
                            options={["Female", "Male", "Non-binary", "Prefer not to say"]}
                          />
                        </div>

                        <p className="mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wide text-[#7772a8]">Meal Preferences</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <SelectInput
                            label="Meal Type"
                            value={t.mealType}
                            onChange={(v) => updateTraveler(i, "mealType", v)}
                            options={["No Preference", "Vegetarian", "Vegan", "Gluten-Free", "Kosher", "Halal", "Jain"]}
                          />
                          <TextInput label="Food Allergies / Restrictions" value={t.mealAllergies} onChange={(v) => updateTraveler(i, "mealAllergies", v)} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mt-3 text-sm font-semibold text-[#3a219a] underline underline-offset-2"
                >
                  Missing someone? Add traveler
                </button>

                <FieldsetBox title="Trip Travel Details" className="mt-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <TextInput label="Destination(s)" value={journey.destinationsList || journey.location || "-"} readOnly />
                    <TextInput label="Date of Departure" value={journey.date || "To be confirmed"} readOnly />
                    <TextInput label="Duration" value={journey.duration} readOnly />
                    <TextInput label="Flexible Dates" value={flexibleDates} readOnly />
                    <TextInput label="Travel Type" value="Escorted" readOnly />
                  </div>
                </FieldsetBox>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <StepTitle n={3} title="Flights" />
                <FieldsetBox title="Flights">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AutocompleteInput
                      label="Departure City"
                      value={flights.departureCity}
                      onChange={(v) => setFlights((p) => ({ ...p, departureCity: v }))}
                      options={DEPARTURE_CITIES}
                    />
                    <AutocompleteInput
                      label="Preferred Airline"
                      value={flights.airline}
                      onChange={(v) => setFlights((p) => ({ ...p, airline: v }))}
                      options={AIRLINES}
                      placeholder="Start typing, or enter your own..."
                    />
                    <SelectInput label="Cabin Class" value={flights.cabin} onChange={(v) => setFlights((p) => ({ ...p, cabin: v }))} options={["Economy", "Premium", "Business Class"]} />
                    <TextInput label="Frequent Flyer Details" value={flights.frequentFlyer} onChange={(v) => setFlights((p) => ({ ...p, frequentFlyer: v }))} />
                  </div>
                </FieldsetBox>
                <FieldsetBox title="Transfers & Services" className="mt-4">
                  <p className="mb-3 rounded-md border border-[#f3c98b] bg-[#fff4e5] px-3 py-2 text-xs font-semibold text-[#92400e]">
                    * Not applicable for escorted journeys — already included as part of the tour.
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <SelectInput label="Airport Transfers Required" value={transfers.airport} onChange={(v) => setTransfers((p) => ({ ...p, airport: v }))} options={["Yes", "No"]} />
                    <SelectInput label="Guide Required" value={transfers.guide} onChange={(v) => setTransfers((p) => ({ ...p, guide: v }))} options={["Yes", "No"]} />
                    <div className="sm:col-span-2">
                      <MultiAutocompleteInput
                        label="Language Preference"
                        values={transfers.language}
                        onChange={(v) => setTransfers((p) => ({ ...p, language: v }))}
                        options={LANGUAGES}
                      />
                    </div>
                  </div>
                </FieldsetBox>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div>
                <StepTitle n={4} title="Visa & Travel Insurance" />
                <FieldsetBox title="Visa">
                  <RadioRow name="visa" value={visa} onChange={setVisa} />
                  <p className="mt-2 text-xs leading-5 text-[#7772a8]">
                    For Visa: Guests are responsible for obtaining all required visas and travel documents for their trip.
                    TravelOStyle will assist with guidance, but final approval is solely at the discretion of the respective
                    consulates and immigration authorities.
                  </p>
                </FieldsetBox>
                <FieldsetBox title="Travel Insurance" className="mt-4">
                  <RadioRow name="insurance" value={insurance} onChange={setInsurance} />
                  <p className="mt-2 text-xs leading-5 text-[#7772a8]">
                    Travel insurance is highly recommended for all bookings. It is the client&rsquo;s responsibility to
                    purchase comprehensive travel insurance that covers cancellation, medical emergencies, baggage loss, and
                    other unforeseen events. TravelOStyle is not responsible for any costs incurred due to lack of travel
                    insurance.
                  </p>
                </FieldsetBox>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div>
                <StepTitle n={5} title="Additional Notes & Declaration" />
                <FieldsetBox title="Additional Notes">
                  <div className="space-y-3">
                    <TextInput label="Special Occasions" value={notes.occasion} onChange={(v) => setNotes((p) => ({ ...p, occasion: v }))} />
                    <TextInput label="Medical / Mobility Considerations" value={notes.medical} onChange={(v) => setNotes((p) => ({ ...p, medical: v }))} />
                    <TextAreaInput label="Other Remarks" value={notes.other} onChange={(v) => setNotes((p) => ({ ...p, other: v }))} />
                  </div>
                </FieldsetBox>

                <div className="mt-4 flex items-start gap-3 rounded-lg bg-[#f6f5fc] p-4">
                  <input
                    type="checkbox"
                    checked={declaration.checked}
                    onChange={(e) => setDeclaration((p) => ({ ...p, checked: e.target.checked }))}
                    className="mt-0.5 h-5 w-5 rounded-sm border-2 border-[#4b2aa3] accent-[#4b2aa3]"
                  />
                  <span className="text-[13px] leading-5 text-[#4d4a7e]">
                    I confirm that the above details are accurate and authorize TravelOStyle to use this information for
                    travel planning and bookings. I have read and agree to the{" "}
                    <button type="button" onClick={() => setShowTerms(true)} className="font-semibold text-[#3a219a] underline">
                      Terms and Conditions
                    </button>
                    .
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextInput label="Date" type="date" value={TODAY_STR} readOnly />
                  <TextInput label="Name" value={lead.fullName} readOnly />
                </div>
              </div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div>
                <StepTitle n={6} title="Review Your Booking" />
                <div className="overflow-hidden rounded-lg border border-[#e5e3f5]">
                  <div className="relative h-40 w-full">
                    <Image src={journey.image} alt={journey.title} fill className="object-cover" />
                  </div>
                  <div className="space-y-1 p-4 text-[13px]">
                    <p className="mb-1 text-base font-semibold text-[#3a219a]">{journey.title}</p>
                    <ReviewRow label="Destinations" value={journey.destinationsList || journey.location || "-"} />
                    <ReviewRow label="Departure" value={journey.date || "To be confirmed"} />
                    <ReviewRow label="Duration" value={journey.duration} />
                    <ReviewRow label="Travelers" value={`${counts.adults} Adult(s), ${counts.children} Child(ren), ${counts.infants} Infant(s)`} />
                    <ReviewRow label="Price per person" value={`$${journey.price}`} />
                  </div>
                </div>

                <p className="mb-2 mt-4 text-sm text-[#7772a8]">
                  {depositEligible
                    ? "Choose how much you’d like to pay now."
                    : "Departures within 90 days require full payment."}
                </p>
                {depositEligible && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPayMode("deposit")}
                      className={`flex-1 rounded-lg border-2 border-[#2C3078] py-2 text-sm font-semibold ${effectivePayMode === "deposit" ? "bg-[#2C3078] text-white" : "text-[#2C3078]"}`}
                    >
                      Pay Deposit Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayMode("full")}
                      className={`flex-1 rounded-lg border-2 border-[#2C3078] py-2 text-sm font-semibold ${effectivePayMode === "full" ? "bg-[#2C3078] text-white" : "text-[#2C3078]"}`}
                    >
                      Pay Now
                    </button>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between rounded-lg bg-[#F6F5FC] px-4 py-3">
                  <span className="text-sm text-[#7772a8]">Amount Due Now</span>
                  <span className="text-xl font-bold text-[#2C3078]">${amountDue.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* STEP 7 */}
            {step === 7 && (
              <div>
                <StepTitle n={7} title="Secure Payment" sub="Pay by card or US bank transfer (ACH), powered by Stripe." />
                {!paymentSuccess && !paymentProcessing && (
                  <p className="mb-3 rounded-md border border-[#f3c98b] bg-[#fff4e5] px-3 py-2 text-xs font-semibold text-[#92400e]">
                    A 3.5% processing fee will be applied to all credit card payments.
                  </p>
                )}
                {paymentSuccess ? (
                  <div className="rounded-lg border-2 border-green-600 bg-green-50 p-4 text-sm text-green-800">
                    Payment successful! A confirmation email will be sent to you shortly. Thank you for booking with
                    TravelOStyle.
                  </div>
                ) : paymentProcessing ? (
                  <div className="rounded-lg border-2 border-amber-500 bg-amber-50 p-4 text-sm text-amber-800">
                    Your ACH bank transfer has been submitted and is processing — this typically takes a few business
                    days to clear. We&rsquo;ve emailed you a copy of your booking details, and you&rsquo;ll get a
                    separate confirmation once the payment has fully cleared.
                  </div>
                ) : (
                  <>
                    <div id="booking-payment-element" className="min-h-[120px]" />
                    {!paymentReady && !paymentError && (
                      <p className="text-sm text-[#7772a8]">Loading secure payment form…</p>
                    )}
                    {paymentError && (
                      <p className="mt-2 text-sm text-red-600">{paymentError}</p>
                    )}
                  </>
                )}
              </div>
            )}

            {validationMsg && <p className="mt-4 text-sm font-medium text-red-600">{validationMsg}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#e5e3f5] px-4 py-4 sm:px-7">
            <button
              type="button"
              onClick={back}
              className={`text-sm font-semibold text-[#3a219a] ${step === 1 ? "invisible" : ""}`}
            >
              Back
            </button>
            {step === 7 && !paymentSuccess && !paymentProcessing ? (
              <Button
                type="button"
                onClick={handlePay}
                disabled={!paymentReady || payLoading}
                className="rounded-full bg-[#2C3078] px-6 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-[#2C3078]/60"
              >
                {payLoading ? "Processing…" : "Pay Now"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={paymentSuccess || paymentProcessing ? onClose : next}
                className="rounded-full bg-[#2C3078] px-6 py-2 font-medium text-white"
              >
                {paymentSuccess || paymentProcessing
                  ? "Close"
                  : step === TOTAL_STEPS
                    ? "Done"
                    : step === 6
                      ? "Proceed to Payment"
                      : "Next"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </>
  );
}

/* ---------- small presentational helpers ---------- */

function StepTitle({ n, title, sub }) {
  return (
    <div className="mb-4">
      <p className="text-base font-bold text-[#3a219a]">
        {n}. {title}
      </p>
      {sub && <p className="text-xs text-[#7772a8]">{sub}</p>}
    </div>
  );
}

function FieldsetBox({ title, children, className = "" }) {
  return (
    <div className={`rounded-lg border-2 border-[#e5e3f5] p-4 ${className}`}>
      <p className="mb-3 text-sm font-bold text-[#3a219a]">{title}</p>
      {children}
    </div>
  );
}

function TextInput({ label, value, onChange, type = "text", readOnly = false, max, min }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[#3a219a]">{label}</span>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        max={max}
        min={min}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full rounded-md border-2 px-3 py-2 text-sm outline-none ${
          readOnly ? "border-[#e5e3f5] bg-[#f1f1f6] text-[#7772a8]" : "border-[#c9c4ea] bg-white text-[#3a219a]"
        }`}
      />
    </label>
  );
}

// Type-to-filter single-value combobox — plain text input + a filtered
// dropdown of `options`, no external library or API key. Native <select>
// works fine but is slow to scan with a long option list; native <datalist>
// autocomplete is also an option but has inconsistent/weak support on iOS
// Safari, so this is a small hand-rolled combobox instead for consistent
// behavior everywhere. The value is plain free text, not locked to the
// list, so typing anything not suggested (an "Other" answer) just works.
function AutocompleteInput({ label, value, onChange, options, placeholder = "Start typing to search..." }) {
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [value, options]);

  return (
    <label className="relative block">
      <span className="mb-1 block text-xs font-semibold text-[#3a219a]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-md border-2 border-[#c9c4ea] bg-white px-3 py-2 text-sm text-[#3a219a] outline-none"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border-2 border-[#c9c4ea] bg-white text-sm shadow-lg">
          {filtered.map((o) => (
            <li
              key={o}
              // onMouseDown (not onClick) fires before the input's onBlur closes the list.
              onMouseDown={() => {
                onChange(o);
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-[#3a219a] hover:bg-[#f1f1f6]"
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </label>
  );
}

// Multi-value version of AutocompleteInput — used for Language Preference,
// where a traveler may want more than one language noted (e.g. "English,
// Hindi"). Selected values render as removable chips; typing filters the
// suggestion list, and anything typed that isn't in the list can still be
// added as a custom value ("Other").
function MultiAutocompleteInput({ label, values, onChange, options }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter((o) => !values.includes(o) && (!q || o.toLowerCase().includes(q)));
  }, [query, options, values]);

  const queryTrimmed = query.trim();
  const showAddCustom =
    queryTrimmed && !options.some((o) => o.toLowerCase() === queryTrimmed.toLowerCase()) && !values.includes(queryTrimmed);

  function addValue(v) {
    const trimmed = v.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setQuery("");
  }
  function removeValue(v) {
    onChange(values.filter((x) => x !== v));
  }

  return (
    <label className="relative block">
      <span className="mb-1 block text-xs font-semibold text-[#3a219a]">{label}</span>
      <div className="flex min-h-[42px] w-full flex-wrap items-center gap-1.5 rounded-md border-2 border-[#c9c4ea] bg-white px-2 py-1.5">
        {values.map((v) => (
          <span key={v} className="flex items-center gap-1 rounded-full bg-[#efe9ff] px-2.5 py-1 text-xs font-medium text-[#3a219a]">
            {v}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => removeValue(v)}
              aria-label={`Remove ${v}`}
              className="text-[#7772a8] hover:text-[#3a219a]"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addValue(query);
            } else if (e.key === "Backspace" && !query && values.length) {
              removeValue(values[values.length - 1]);
            }
          }}
          placeholder={values.length ? "" : "Start typing to search or add..."}
          autoComplete="off"
          className="min-w-[120px] flex-1 border-none text-sm text-[#3a219a] outline-none"
        />
      </div>
      {open && (filtered.length > 0 || showAddCustom) && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border-2 border-[#c9c4ea] bg-white text-sm shadow-lg">
          {filtered.map((o) => (
            <li key={o} onMouseDown={() => addValue(o)} className="cursor-pointer px-3 py-2 text-[#3a219a] hover:bg-[#f1f1f6]">
              {o}
            </li>
          ))}
          {showAddCustom && (
            <li onMouseDown={() => addValue(queryTrimmed)} className="cursor-pointer px-3 py-2 italic text-[#3a219a] hover:bg-[#f1f1f6]">
              Add &ldquo;{queryTrimmed}&rdquo;
            </li>
          )}
        </ul>
      )}
    </label>
  );
}

function TextAreaInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[#3a219a]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-md border-2 border-[#c9c4ea] bg-white px-3 py-2 text-sm text-[#3a219a] outline-none"
      />
    </label>
  );
}

function SelectInput({ label, value, onChange, options, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-[#3a219a]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border-2 border-[#c9c4ea] bg-white px-3 py-2 text-sm text-[#3a219a] outline-none"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function CounterField({ label, value, onInc, onDec }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-semibold text-[#3a219a]">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onDec} className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#2C3078] font-bold text-[#2C3078]">
          −
        </button>
        <span className="min-w-[20px] text-center font-semibold text-[#3a219a]">{value}</span>
        <button type="button" onClick={onInc} className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-[#2C3078] font-bold text-[#2C3078]">
          +
        </button>
      </div>
    </div>
  );
}

function RadioRow({ name, value, onChange }) {
  return (
    <div className="flex gap-6">
      {["Yes", "No"].map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-sm text-[#3a219a]">
          <input type="radio" name={name} checked={value === opt} onChange={() => onChange(opt)} />
          {opt}
        </label>
      ))}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-dashed border-[#e5e3f5] py-1.5 last:border-none">
      <span className="text-[#7772a8]">{label}</span>
      <span className="font-medium text-[#3a219a]">{value}</span>
    </div>
  );
}
