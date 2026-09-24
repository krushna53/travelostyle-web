export const STEPS = [
  { id: 1, label: "Tell us about how you imagine travel" },
  { id: 2, label: "We'll discuss further to personalize an itinerary" },
  { id: 3, label: "Next, we refine until we arrive at your ideal trip" },
  { id: 4, label: "Complete the booking and payment schedules and set off!" },
];

// Must match the "Experiences" webform element's configured option values
// in Drupal exactly (Structure > Webforms > craft_your_journey > Build).
// This element uses the same string for both option value and option
// text, so no separate label mapping is needed.
export const EXPERIENCES = [
  "Adventure",
  "Culture",
  "Relaxation",
  "Wildlife",
  "Beach",
  "Culinary",
];

// Must match the "Reason for Trip" webform element's configured option
// values in Drupal exactly.
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

// Must match the "budget preferences" webform element's configured
// option values/text in Drupal exactly.
export const BUDGET_PREFERENCES = [
  { value: "strict", label: "Strict budget" },
  { value: "open-to-increase", label: "Open to increase for the right experience" },
];

// Must match the "Budget Range" webform element's configured option
// values in Drupal exactly.
export const BUDGET_RANGES = ["$2500-4000", "$4000-8000", "$8000-12000", "$12000+"];

// Must match the "Duration" webform element's configured option values
// in Drupal exactly.
export const DURATION_OPTIONS = ["2-5 Days", "6-10 Days", "11-15 Days", "16+ Days"];

// Must match the "Tailor Topics" webform element's configured option
// values in Drupal exactly (confirmed straight from the element's option
// list in Drupal admin — Structure > Webforms > Craft Your Journey >
// Tailor Topics — rather than guessed, after several submitted values
// turned out not to be configured options and got rejected).

export const TAILOR_TOPICS = [
  "I want to discuss my ideal accommodation type",
  "I want to discuss the pace of my journey",
  "I'm traveling with my own group and would like a private rate",
  "I want you to recommend sights, activities, or experiences",
  "I have dietary, accessibility, rooming, or other travel needs which I would like to discuss",
  "My budget is flexible for the right experience",
  "I want to explore different travel dates",
  "I am traveling with an infant and require some guidance",
  "I want you to recommend more destinations and/or stopovers",
];
export const TOTAL_STEPS = 6;

export const initialFormData = {
  destination: "",
  // Drupal node ID (drupal_internal__nid) of the journey selected from the
  // "Where do you want to go?" list — set alongside `destination` (its
  // title, kept for display/free-text fallback) when the visitor picks a
  // real option instead of just typing.
  destinationId: null,
  // field_journey_tag term ids ("Journey Style", e.g. Private Journey)
  // of the selected destination journey — set alongside destinationId.
  journeyTypeIds: [],
  experiences: [],
  guests: { adults: 0, children: 0 },
  duration: [],
  tailorTopics: [],
  tripReason: "",
  expertNote: "",
  budgetAmount: "",
  budgetRange: "",
  includesFlights: "No",
  flightAssistance: "No",
  budgetPreference: "open-to-increase",
  firstName: "",
  lastName: "",
  title: "",
  phone: "",
  email: "",
  consent: false,
};
