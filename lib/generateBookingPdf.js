import PDFDocument from "pdfkit";

const NAVY = "#2C3078";
const MUTED = "#555555";

function line(doc, label, value) {
  if (value === undefined || value === null || value === "") return;
  doc
    .font("Helvetica-Bold")
    .fillColor(NAVY)
    .fontSize(10)
    .text(`${label}: `, { continued: true })
    .font("Helvetica")
    .fillColor(MUTED)
    .text(String(value));
}

function sectionHeader(doc, title) {
  doc.moveDown(0.6);
  doc.font("Helvetica-Bold").fillColor(NAVY).fontSize(13).text(title);
  doc
    .moveTo(doc.x, doc.y + 2)
    .lineTo(545, doc.y + 2)
    .strokeColor("#d9d6ea")
    .stroke();
  doc.moveDown(0.4);
}

/**
 * Builds a PDF summarizing a booking request and returns it as a Buffer.
 * Pure server-side generation (pdfkit), no headless browser needed — safe
 * to run inside a Next.js serverless/edge-adjacent API route.
 */
export function generateBookingPdf(payload) {
  const {
    journey = {},
    counts = {},
    travelers = [],
    lead = {},
    flexibleDates,
    flights = {},
    transfers = {},
    visa,
    insurance,
    notes = {},
    declaration = {},
    payMode,
    amountDue,
    paymentStatus,
    paymentMethod,
  } = payload;

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc.font("Helvetica-Bold").fillColor(NAVY).fontSize(20).text("TravelOStyle — Booking Confirmation");
      doc.font("Helvetica").fillColor(MUTED).fontSize(10).text(`Generated ${new Date().toLocaleString("en-US")}`);
      doc.moveDown(1);

      doc.font("Helvetica-Bold").fillColor(NAVY).fontSize(16).text(journey.title || "Journey");
      doc.moveDown(0.3);
      line(doc, "Destinations", journey.destinationsList || journey.region);
      line(doc, "Departure", journey.date);
      line(doc, "Duration", journey.duration);
      line(doc, "Price per person", journey.price ? `$${journey.price}` : undefined);
      line(doc, "Travelers", `${counts.adults || 0} Adult(s), ${counts.children || 0} Child(ren), ${counts.infants || 0} Infant(s)`);
      line(doc, "Flexible Dates", flexibleDates);
      line(doc, "Travel Type", "Escorted");

      sectionHeader(doc, "Lead Traveler");
      line(doc, "Full Name", lead.fullName);
      line(doc, "Date of Birth", lead.dob);
      line(doc, "Gender", lead.gender);
      line(doc, "Nationality", lead.nationality);
      line(doc, "Passport Number", lead.passportNumber);
      line(doc, "Passport Expiry", lead.passportExpiry);
      line(doc, "Phone", lead.phone);
      line(doc, "Email", lead.email);
      line(doc, "Address Line 1", lead.address1);
      line(doc, "Address Line 2", lead.address2);
      line(doc, "City", lead.city);
      line(doc, "State", lead.state);
      line(doc, "Zip Code", lead.zip);
      line(doc, "Country", lead.country);
      line(doc, "Meal Type", lead.mealType);
      line(doc, "Food Allergies / Restrictions", lead.mealAllergies);
      line(
        doc,
        "Emergency Contact",
        lead.emergencyContactPhone
          ? `${lead.emergencyContactName || "-"} (${lead.emergencyContactRelationship || "-"}) — ${lead.emergencyContactPhone}`
          : undefined
      );

      sectionHeader(doc, "Additional Travelers");
      if (travelers.length === 0) {
        doc.font("Helvetica").fillColor(MUTED).fontSize(10).text("None");
      }
      travelers.forEach((t, i) => {
        doc.font("Helvetica-Bold").fillColor(NAVY).fontSize(11).text(`Traveler ${i + 2} (${t.type})`);
        doc.moveDown(0.15);
        line(doc, "Full Name", t.fullName);
        line(doc, "Date of Birth", t.dob);
        line(doc, "Gender", t.gender);
        line(doc, "Nationality", t.nationality);
        line(doc, "Passport Number", t.passportNumber);
        line(doc, "Passport Expiry", t.passportExpiry);
        line(doc, "Meal Type", t.mealType);
        line(doc, "Food Allergies / Restrictions", t.mealAllergies);
        doc.moveDown(0.4);
      });

      sectionHeader(doc, "Flights");
      line(doc, "Departure City", flights.departureCity);
      line(doc, "Preferred Airline", flights.airline);
      line(doc, "Cabin Class", flights.cabin);
      line(doc, "Frequent Flyer Details", flights.frequentFlyer);
      line(doc, "Airport Transfers Required", transfers.airport);
      line(doc, "Guide Required", transfers.guide);
      line(doc, "Language Preference", Array.isArray(transfers.language) ? transfers.language.join(", ") : transfers.language);

      sectionHeader(doc, "Visa & Travel Insurance");
      line(doc, "Visa Assistance Requested", visa);
      line(doc, "Travel Insurance Requested", insurance);

      sectionHeader(doc, "Additional Notes");
      line(doc, "Special Occasions", notes.occasion);
      line(doc, "Medical / Mobility Considerations", notes.medical);
      line(doc, "Other Remarks", notes.other);

      sectionHeader(doc, "Declaration & Payment");
      line(doc, "Declaration Confirmed By", lead.fullName);
      line(doc, "Declaration Confirmed", declaration.checked ? "Yes" : "No");
      line(doc, "Payment Option", payMode === "deposit" ? "Deposit" : "Full Amount");
      line(doc, "Amount Paid", amountDue ? `$${amountDue}` : undefined);
      line(doc, "Payment Status", paymentStatus || "Paid");
      line(doc, "Payment Method", paymentMethod);
      doc.moveDown(0.6);
      doc
        .font("Helvetica")
        .fillColor(MUTED)
        .fontSize(9)
        .text(
          "This document summarizes your booking request with TravelOStyle. It does not constitute a confirmed booking " +
            "until the required deposit is received and written confirmation is issued. See Terms & Conditions for full details."
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
