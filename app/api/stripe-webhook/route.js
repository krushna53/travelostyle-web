import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

async function sendFollowUpEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: `"Travel O Style" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
}

// Stripe webhook: the source of truth for delayed-notification payment
// methods like ACH Direct Debit. Card payments already resolve instantly
// client-side (see BookingModal's handlePay), so this only sends follow-up
// emails for the us_bank_account (ACH) case, to avoid double-emailing.
export async function POST(req) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("stripe-webhook: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not configured.");
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text(); // must be the raw body for signature verification

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("stripe-webhook: signature verification failed:", err.message);
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
      const intent = event.data.object;

      // `intent.payment_method_types` lists the types ALLOWED on this
      // PaymentIntent (now always ["card", "us_bank_account"] since we
      // restrict it in create-payment-intent), not the one the customer
      // actually used — checking it directly would fire ACH follow-up
      // emails for card payments too. Retrieve the intent with the actual
      // payment_method expanded to get the real type.
      const fullIntent = await stripe.paymentIntents.retrieve(intent.id, {
        expand: ["payment_method"],
      });
      const actualMethodType = fullIntent.payment_method?.type;

      // Only act on ACH — card payments were already handled synchronously
      // when the customer completed checkout.
      if (actualMethodType === "us_bank_account") {
        const { tour = "your journey", leadEmail, leadName = "Traveler" } = intent.metadata || {};
        const amount = (intent.amount / 100).toLocaleString();
        const succeeded = event.type === "payment_intent.succeeded";

        const adminHtml = `
          <p>ACH payment ${succeeded ? "cleared" : "failed"} for <strong>${tour}</strong>.</p>
          <p>Amount: <strong>$${amount}</strong> | PaymentIntent: ${intent.id}</p>
          ${leadEmail ? `<p>Lead traveler: ${leadName} (${leadEmail})</p>` : ""}
        `;
        await sendFollowUpEmail({
          to: process.env.EMAIL_TO,
          subject: `ACH payment ${succeeded ? "cleared" : "failed"} - ${tour}`,
          html: adminHtml,
        });

        if (leadEmail) {
          const customerHtml = succeeded
            ? `
              <p>Hi ${leadName},</p>
              <p>Good news — your ACH bank transfer of <strong>$${amount}</strong> for <strong>${tour}</strong> has
              cleared. Your booking is now confirmed on our end.</p>
              <p>Safe travels,<br/>TravelOStyle</p>
            `
            : `
              <p>Hi ${leadName},</p>
              <p>Unfortunately your ACH bank transfer of <strong>$${amount}</strong> for <strong>${tour}</strong>
              was not successful. Please reach out to us or try an alternate payment method to complete your
              booking.</p>
              <p>TravelOStyle</p>
            `;
          await sendFollowUpEmail({
            to: leadEmail,
            subject: succeeded ? `Your ACH payment has cleared - ${tour}` : `Action needed - ACH payment failed for ${tour}`,
            html: customerHtml,
          });
        }
      }
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("stripe-webhook: handler error:", err);
    // Still acknowledge receipt so Stripe doesn't retry indefinitely for a
    // problem on our side (e.g. SMTP hiccup) — errors are logged for review.
    return Response.json({ received: true, warning: err.message });
  }
}
