import Stripe from "stripe";
import nodemailer from "nodemailer";
import { generateBookingPdf } from "@/lib/generateBookingPdf";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const PAYMENT_METHOD_LABELS = {
  card: "Card",
  us_bank_account: "US Bank Transfer (ACH)",
  amazon_pay: "Amazon Pay",
  cashapp: "Cash App Pay",
  link: "Link",
};

function friendlyPaymentMethod(type) {
  if (!type) return null;
  return PAYMENT_METHOD_LABELS[type] || type.replace(/_/g, " ");
}

// Looks up how the customer actually paid (card vs. ACH vs. wallet, etc.)
// from the confirmed PaymentIntent, so the notification email/PDF can show
// the real payment method rather than just "Paid".
async function resolvePaymentMethod(paymentIntentId) {
  if (!stripe || !paymentIntentId) return null;
  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["payment_method"],
    });
    const type = intent.payment_method?.type;
    return friendlyPaymentMethod(type);
  } catch (err) {
    console.error("Failed to resolve payment method:", err);
    return null;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const journeyTitle = body?.journey?.title || "Journey";
    const leadEmail = body?.lead?.email;
    const leadName = body?.lead?.fullName || "Traveler";

    const paymentMethod = await resolvePaymentMethod(body?.paymentIntentId);
    const pdfBuffer = await generateBookingPdf({ ...body, paymentMethod });
    const fileName = `TravelOStyle-Booking-${journeyTitle.replace(/[^a-z0-9]+/gi, "-")}.pdf`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const attachments = [{ filename: fileName, content: pdfBuffer, contentType: "application/pdf" }];

    // 1. Admin copy
    await transporter.sendMail({
      from: `"Travel O Style" <${process.env.SMTP_EMAIL}>`,
      to: process.env.EMAIL_TO,
      replyTo: leadEmail || undefined,
      subject: `New Booking Request - ${journeyTitle}`,
      html: `
        <p>A new booking request has been submitted for <strong>${journeyTitle}</strong>.</p>
        <p>Amount paid: <strong>$${body?.amountDue ?? "-"}</strong> via <strong>${paymentMethod || "unknown method"}</strong>.</p>
        <p>Full traveler, passport, and trip details are attached as a PDF.</p>
      `,
      attachments,
    });

    // 2. Customer (lead traveler) copy
    if (leadEmail) {
      await transporter.sendMail({
        from: `"Travel O Style" <${process.env.SMTP_EMAIL}>`,
        to: leadEmail,
        replyTo: process.env.EMAIL_TO,
        subject: `Your TravelOStyle Booking Request - ${journeyTitle}`,
        html: `
          <p>Hi ${leadName},</p>
          <p>Thank you for booking <strong>${journeyTitle}</strong> with TravelOStyle. A copy of your submitted
          booking details is attached as a PDF for your records.</p>
          <p>Payment received: <strong>$${body?.amountDue ?? "-"}</strong>${paymentMethod ? ` via <strong>${paymentMethod}</strong>` : ""}.</p>
          <p>This confirms we've received your request — a booking is finalized once your deposit is received and
          we send written confirmation. Our team will be in touch shortly.</p>
          <p>Safe travels,<br/>TravelOStyle</p>
        `,
        attachments,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("create-booking error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
