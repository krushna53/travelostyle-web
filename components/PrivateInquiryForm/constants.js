// Steps are intentionally kept in a single array so more steps can be
// dropped in later without touching index.jsx — just add a step object
// here and a matching case in index.jsx.
export const TOTAL_STEPS = 4;

export const initialFormData = {
  firstName: "",
  lastName: "",
  title: "",
  countryCode: "+1",
  phone: "",
  email: "",
  guests: "",
  travelingWithChildren: "No",
  flightAssistance: "Yes",
  // Only collected when the form is opened without a specific departure
  // (see PrivateInquiryForm's `showDepartureDate` prop) — replaces the
  // departure-date card with a "when do you want to travel" question.
  travelYear: "",
  travelMonth: "",
  customizations: [],
  stopovers: [],
  discussCustomStopovers: false,
  tripReason: "",
  travelInfoNote: "",
  consent: false,
};

export const CUSTOMIZATION_OPTIONS = [
  "I would like to explore different accommodation categories or stay styles",
  "I would like to adjust how relaxed or packed the journey feels",
  "I would like to increase or decrease the no.of days for which I am traveling",
  "I am traveling with my own group and would like a private rate",
  "I would like to explore sights, activities, or experience different from those mentioned in the itinerary",
  "I have dietary, accessibility, rooming, or other travel needs which I would like to discuss",
  "My budget is flexible for the right experience",
  "I would like to explore different travel dates",
  "I am traveling with an infant and require some guidance",
  "I would like to customize another part of the trip which is not listed above",
];

// Option `id` values here MUST match the "Option value" keys configured on
// the "Stopovers" element of the private_journey_inquiry_webform in Drupal
// exactly, or the webform_rest submission is rejected with a "Submitted
// Data contains validation errors" 400 response.
export const STOPOVER_OPTIONS = [
  {
    id: "dubai-3d2n",
    title: "Dubai, U.A.E",
    duration: "3 Days, 2 Nights",
    price: 750,
    image: "/Dubai.svg",
  },
  {
    id: "muscat-3d2n",
    title: "Muscat, Oman",
    duration: "3 Days, 2 Nights",
    price: 750,
    image: "/placeholder-image.svg",
  },
  {
    id: "mumbai-3d2n",
    title: "Mumbai, India",
    duration: "3 Days, 2 Nights",
    price: 1000,
    image: "/placeholder-image.svg",
  },
  {
    id: "mumbai-2n",
    title: "Mumbai, India",
    duration: "2 Nights",
    price: 1000,
    image: "/placeholder-image.svg",
  },
  {
    id: "dubai-5d4n",
    title: "Dubai, U.A.E",
    duration: "5 Days, 4 Nights",
    price: 1500,
    image: "/Dubai.svg",
  },
];

// Shown in StepOne's "When do you want to travel?" row, used only when
// the form has no specific departure to display instead.
export const TRAVEL_YEARS = ["2026", "2027", "2028"];

export const TRAVEL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const TRIP_REASONS = [
  "Honeymoon",
  "Birthday",
  "Babymoon",
  "Anniversary",
  "Family Trip",
  "Bucket List",
  "Graduation",
  "Friend Trip",
  "Because I love to travel",
  "Other",
];

// ---------------------------------------------------------------------
// The "Inspirational Itineraries" flow (showDepartureDate = false, submits
// to the separate `inspirational_itineraries_form` webform) has its OWN
// option lists configured in Drupal — confirmed distinct from the values
// above, which belong only to `private_journey_inquiry_webform`.
// ---------------------------------------------------------------------

// Confirmed as the complete list (only 2 real options configured).
export const INSPIRATIONAL_CUSTOMIZATION_OPTIONS = [
   "I would like to explore different accommodation categories or stay styles",
  "I would like to adjust how relaxed or packed the journey feels",
  "I would like to increase or decrease the no.of days for which I am traveling",
  "I am traveling with my own group and would like a private rate",
  "I would like to explore sights, activities, or experience different from those mentioned in the itinerary",
  "I have dietary, accessibility, rooming, or other travel needs which I would like to discuss",
  "My budget is flexible for the right experience",
  "I would like to explore different travel dates",
  "I am traveling with an infant and require some guidance",
  "I would like to customize another part of the trip which is not listed above",
];

// Option `id` values match the "Stopovers" element's configured option
// values on the inspirational form exactly. NOTE: Drupal only gave us the
// value/label pairs, not price or duration — `price`/`duration`/`image`
// below are placeholders and should be swapped for the real figures.
export const INSPIRATIONAL_STOPOVER_OPTIONS = [
  {
    id: "dubai-2n",
    title: "Dubai, U.A.E",
    duration: "2 Nights",
    price: 750,
    image: "/Dubai.svg",
  },
  {
    id: "mumbai-2n",
    title: "Mumbai, India",
    duration: "2 Nights",
    price: 750,
    image: "/placeholder-image.svg",
  },
  {
    id: "singapore-2n",
    title: "Singapore",
    duration: "2 Nights",
    price: 750,
    image: "/placeholder-image.svg",
  },
  {
    id: "doha-2n",
    title: "Doha, Qatar",
    duration: "2 Nights",
    price: 750,
    image: "/placeholder-image.svg",
  },
];

// Confirmed as the complete list configured on the inspirational form's
// "Reason for Trip" element.
export const INSPIRATIONAL_TRIP_REASONS = [
  "Anniversary",
  "Honeymoon",
  "Vacation",
  "Birthday",
  "Graduation",
  "Other",
];
