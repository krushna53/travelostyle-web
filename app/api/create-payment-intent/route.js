import Stripe from "stripe";

// The Stripe SECRET key must only ever live server-side, as an environment
// variable (STRIPE_SECRET_KEY) — never in client code.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { error: "Stripe is not configured yet." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const amount = Math.round(Number(body.amount));
    const currency = body.currency || "usd";
    const metadata = body.metadata || {};

    if (!amount || amount < 50) {
      return Response.json({ error: "Invalid amount." }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      // Explicitly listing payment_method_types (e.g. ["card",
      // "us_bank_account"]) is rejected on accounts with Dynamic Payment
      // Methods enabled ("parameter is no longer supported... managed from
      // your Dashboard settings") — which newer Stripe accounts default to.
      // automatic_payment_methods defers to whatever's enabled under
      // Stripe Dashboard > Settings > Payment methods instead; to keep this
      // to just Card + US bank account (ACH) like before, disable any other
      // methods (Klarna/Affirm/Amazon Pay/etc.) there rather than here.
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("create-payment-intent error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
