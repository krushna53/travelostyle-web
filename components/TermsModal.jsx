"use client";

export default function TermsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-0 py-0 sm:px-4 sm:py-6">
      <button
        type="button"
        aria-label="Close terms backdrop"
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        className="relative z-10 flex h-dvh w-full flex-col overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.25)] sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e5e3f5] px-5 py-4 sm:px-7">
          <h3 id="terms-title" className="text-lg font-semibold text-[#3a219a] sm:text-xl">
            Terms &amp; Conditions
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center text-[#3a219a] hover:opacity-70"
          >
            <span className="relative block h-5 w-5">
              <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 rotate-45 rounded bg-current" />
              <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 -rotate-45 rounded bg-current" />
            </span>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 text-[13px] leading-6 text-[#4d4a7e] sm:px-7 sm:py-6">
          <Section title="1. Booking Process & Contract Formation">
            <p>1.1 All bookings are subject to availability and supplier confirmation.</p>
            <p>1.2 A booking is deemed confirmed only upon receipt of the required non-refundable deposit and issuance of written confirmation by TravelOStyle.</p>
            <p>1.3 TravelOStyle reserves the right, at its sole discretion, to decline any booking request without obligation to provide a reason.</p>
            <p>1.4 The person submitting the booking represents and warrants that they are authorized to accept these Terms on behalf of all travelers included in the booking.</p>
          </Section>

          <Section title="2. Client Responsibilities">
            <p>2.1 You are solely responsible for ensuring compliance with all passport, visa, entry, health, vaccination, and other travel requirements for all destinations.</p>
            <p>2.2 TravelOStyle shall not be liable for denied boarding, entry refusal, deportation, or additional costs arising from incomplete or incorrect documentation.</p>
            <p>2.3 You must disclose any medical conditions, dietary restrictions, allergies, or special needs at the time of booking. Failure to do so may limit our ability to accommodate such needs.</p>
          </Section>

          <Section title="3. Documentation Requirements">
            <p>3.1 A clear copy of each traveler&rsquo;s valid passport must be provided at the time of deposit.</p>
            <p>3.2 TravelOStyle may request additional documents (e.g., visas, health declarations, insurance certificates) depending on destination requirements.</p>
            <p>3.3 Services cannot be fully confirmed until all required documentation is received and verified.</p>
          </Section>

          <Section title="4. Payment Terms & Schedule (Per Person)">
            <p>To secure your booking, the following payment schedule applies to all land and air services:</p>
            <p className="mt-2 font-semibold text-[#3a219a]">4.1 Deposits – Land Services (Non-Refundable)</p>
            <p>A non-refundable deposit is required at the time of booking to confirm your land arrangements. Deposits secure your reservation but do not guarantee availability until confirmed by suppliers.</p>
            <table className="my-3 w-full border-collapse text-[12.5px]">
              <thead>
                <tr>
                  <th className="border border-[#e5e3f5] bg-[#f1f1fb] px-2 py-1.5 text-left">Tour Price</th>
                  <th className="border border-[#e5e3f5] bg-[#f1f1fb] px-2 py-1.5 text-left">Deposit per person</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-[#e5e3f5] px-2 py-1.5">Under $2,499</td><td className="border border-[#e5e3f5] px-2 py-1.5">$500 non-refundable</td></tr>
                <tr><td className="border border-[#e5e3f5] px-2 py-1.5">$2,500 – $4,999</td><td className="border border-[#e5e3f5] px-2 py-1.5">$1,000 non-refundable</td></tr>
                <tr><td className="border border-[#e5e3f5] px-2 py-1.5">Over $5,000</td><td className="border border-[#e5e3f5] px-2 py-1.5">$1,500 non-refundable</td></tr>
              </tbody>
            </table>
            <p className="font-semibold text-[#3a219a]">4.2 Airfare Payments</p>
            <p>Full payment is required at the time of ticketing for all domestic and international flights. Airline fares, schedules, and availability cannot be guaranteed until ticketed.</p>
            <p className="mt-2 font-semibold text-[#3a219a]">4.3 Final Payment</p>
            <p>Final payment is due 90 days prior to departure. Failure to remit payment by the deadline may result in automatic cancellation and forfeiture of all deposits paid.</p>
            <p className="mt-2 font-semibold text-[#3a219a]">4.4 Accepted Payment Methods</p>
            <p>Check, Credit/Debit Card, Wire/ACH Transfer. Credit card payments require a signed authorization form and valid government-issued ID. Third-party checks or credit cards are strictly prohibited. Check payments are processed only after funds clear.</p>
          </Section>

          <Section title="5. Cancellation & Refund Policy (Per Person)">
            <p>We understand that plans can change. However, as we commit to our global partners in advance, the following tiered penalty structure applies to all cancellations:</p>
            <table className="my-3 w-full border-collapse text-[12.5px]">
              <thead>
                <tr>
                  <th className="border border-[#e5e3f5] bg-[#f1f1fb] px-2 py-1.5 text-left">Days Prior to Departure</th>
                  <th className="border border-[#e5e3f5] bg-[#f1f1fb] px-2 py-1.5 text-left">Cancellation Penalty</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-[#e5e3f5] px-2 py-1.5">91+ Days</td><td className="border border-[#e5e3f5] px-2 py-1.5">Forfeiture of non-refundable deposit only</td></tr>
                <tr><td className="border border-[#e5e3f5] px-2 py-1.5">60–90 Days</td><td className="border border-[#e5e3f5] px-2 py-1.5">25% of the tour cost</td></tr>
                <tr><td className="border border-[#e5e3f5] px-2 py-1.5">45–59 Days</td><td className="border border-[#e5e3f5] px-2 py-1.5">50% of the tour cost</td></tr>
                <tr><td className="border border-[#e5e3f5] px-2 py-1.5">31–44 Days</td><td className="border border-[#e5e3f5] px-2 py-1.5">75% of the tour cost</td></tr>
                <tr><td className="border border-[#e5e3f5] px-2 py-1.5">30 Days or Less</td><td className="border border-[#e5e3f5] px-2 py-1.5">100% of the tour cost</td></tr>
              </tbody>
            </table>
            <p>All cancellation requests must be submitted in writing.</p>
          </Section>

          <Section title="6. Client-Requested Changes">
            <p>6.1 Any modification to a confirmed booking is subject to a minimum $50 administration fee plus any supplier-imposed charges.</p>
            <p>6.2 All changes are subject to availability and cannot be guaranteed.</p>
          </Section>

          <Section title="7. Changes by TravelOStyle & Supplier Liability">
            <p>7.1 TravelOStyle acts solely as an intermediary between clients and independent third-party suppliers, including hotels, airlines, transportation providers, and destination management companies.</p>
            <p>7.2 TravelOStyle does not own, operate, control, or manage any supplier and therefore cannot guarantee the performance or availability of any service.</p>
            <p>7.3 TravelOStyle reserves the right to modify, substitute, or alter any itinerary, accommodation, transportation, or service at any time due to circumstances beyond our control, including but not limited to: weather conditions, operational issues, supplier decisions, political events, natural disasters, safety concerns, and government regulations.</p>
            <p>7.4 Such changes do not constitute grounds for refunds, partial refunds, compensation, or claims against TravelOStyle.</p>
            <p>7.5 If a supplier alters, cancels, or fails to provide a service, any remedy — including refunds or alternative arrangements — will be governed strictly by the supplier&rsquo;s policies. TravelOStyle is not liable to issue refunds or bear financial responsibility for supplier actions or omissions.</p>
          </Section>

          <Section title="8. Force Majeure">
            <p>TravelOStyle shall not be liable for any failure, delay, or disruption caused by events beyond our reasonable control, including acts of God, war, terrorism, civil unrest, strikes, epidemics, pandemics, natural disasters, or government restrictions. No refunds, compensation, or claims shall be made against TravelOStyle in such circumstances.</p>
          </Section>

          <Section title="9. Travel Insurance">
            <p>Travel insurance is highly recommended. TravelOStyle strongly recommends purchasing comprehensive travel insurance covering cancellation, medical emergencies, evacuation, baggage loss, and other unforeseen events. Failure to obtain insurance is solely at the client&rsquo;s risk. TravelOStyle is not responsible for any costs incurred due to lack of insurance coverage.</p>
          </Section>

          <Section title="10. Complaints and Disputes">
            <p>10.1 Any complaint must be submitted in writing within 30 days of trip completion.</p>
            <p>10.2 TravelOStyle will make reasonable efforts to resolve matters amicably.</p>
            <p>10.3 These Terms shall be governed by and construed in accordance with the laws of the State of Illinois, and any dispute shall be subject to the exclusive jurisdiction of the courts located in Illinois.</p>
          </Section>

          <Section title="11. Limitation of Liability">
            <p>To the fullest extent permitted by law: TravelOStyle&rsquo;s liability is strictly limited to the amount paid directly to TravelOStyle for its services. TravelOStyle shall not be liable for indirect, incidental, consequential, punitive, or special damages. TravelOStyle is not responsible for acts, errors, omissions, or negligence of suppliers or third parties.</p>
          </Section>
        </div>

        <div className="border-t border-[#e5e3f5] px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#2C3078] px-5 py-2 text-sm font-medium text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <p className="mb-1.5 font-semibold text-[#3a219a]">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
