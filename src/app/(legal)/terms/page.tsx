import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Terms and Conditions of Sale",
  description: `The contract between you and ${brand.name}`,
  robots: { index: false, follow: true },
};

/**
 * Replaced 21 Aug 2026 — the previous content on this page was an
 * unrelated, older placeholder draft with completely different section
 * numbering. This is the client's real, final document
 * (`source-files/TCLC_Terms_and_Conditions_of_Sale_v1.docx`, v1.1,
 * effective 20.08.2026), pasted verbatim per this project's standing
 * "paste required copy exactly" rule — do not paraphrase or reorder.
 * Section numbers matter: the Phase 6 checkout consent copy and its
 * confirmation email both reference "section 11" by number, and that
 * cross-reference is only correct against this exact document.
 */
export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions of Sale" updatedAt="20 August 2026 (v1.1)">
      <p>The contract between you and The Confident Learning Co.</p>

      <h2>1. Who we are and how to reach us</h2>
      <p>
        You are buying from Adam Parker-Steed, a sole trader, trading as The Confident Learning
        Co. Our address for service is 49 Station Road, Polegate, East Sussex, BN26 6EA.
      </p>
      <p>
        For anything to do with an order, a cancellation, a refund or a complaint, email{" "}
        <a href="mailto:complaints@theconfidentlearningco.org">
          complaints@theconfidentlearningco.org
        </a>
        . For anything to do with your personal information, email{" "}
        <a href="mailto:privacy@theconfidentlearningco.org">privacy@theconfidentlearningco.org</a>
        . For anything else, email{" "}
        <a href="mailto:adam@theconfidentlearningco.org">adam@theconfidentlearningco.org</a>.
      </p>
      <p>If we need to contact you, we will use the email address you gave us at checkout.</p>

      <h2>2. These terms and your contract with us</h2>
      <p>
        These terms apply to everything we sell. Please read them before you buy. By completing
        checkout, you agree to them.
      </p>
      <p>
        Your order is an offer to buy. A contract is formed when we send you an order
        confirmation by email. If we cannot accept your order, we will tell you and will not
        charge you.
      </p>
      <p>
        You buy from us on our website at theconfidentlearningco.org. Our member community is
        hosted separately by Circle, and you reach it by a personal invitation we send you after
        you buy. Your monthly membership fee is taken by Circle. Everything else is paid for on
        our website.
      </p>
      <p>These terms are only available in English.</p>
      <p>
        Our Community Terms of Use also apply once you are inside Inside the Loop. Where the two
        overlap, these terms govern price, payment, cancellation and refunds, and the Community
        Terms of Use govern how the community is used.
      </p>
      <p>
        These terms are for consumers. If you are buying in the course of a business, tell us
        before you buy, because different terms apply and the cancellation rights in section 9 do
        not.
      </p>

      <h2>3. What we sell</h2>
      <p>Different products carry different cancellation rights. This table is a summary. Section 9 is what governs.</p>
      <ul>
        <li>
          <strong>Learning Confidence Parent Guide</strong> — a written guide, delivered as a
          download, including 30 days of access to Inside the Loop. Anyone can buy it. Lost on
          download, if you consented and acknowledged at checkout (section 9.2).
        </li>
        <li>
          <strong>Inside the Loop</strong> — monthly membership community and resource library.
          Guide buyers only. 14 days from purchase (section 9.3).
        </li>
        <li>
          <strong>Member packs</strong> — downloadable resource packs. Active members only. Lost
          on download, if you consented and acknowledged at checkout (section 9.2).
        </li>
        <li>
          <strong>Workshops</strong> — a live online session on a set date, delivered on Zoom.
          Booked on our website, joined from the member community. Guide buyers with an active
          membership. 14 days from purchase, or until the session runs if sooner (section 9.4;
          see also section 7).
        </li>
        <li>
          <strong>Group Programmes</strong> — a live cohort programme run over several weeks.
          Members who have completed a Pathway call. 14 days from purchase, with a proportionate
          charge if the cohort has started (section 9.4).
        </li>
        <li>
          <strong>Pathway call</strong> — a 30 minute one to one call, booked on a members-only
          page on our website. Active members who have completed the Fit Check. 14 days from
          purchase, or until the call takes place if sooner (section 9.4).
        </li>
        <li>
          <strong>Confidence Reset and Calm Reset</strong> — a one to one programme, payable in
          full. Members who have completed a Pathway call. 14 days from purchase, with a
          proportionate charge if work has started (section 9.4).
        </li>
      </ul>

      <h2>4. Prices and payment</h2>
      <p>
        The price is the price shown at checkout. It includes everything you have to pay. There
        are no additional charges added later.
      </p>
      <p>We are not currently registered for VAT, so no VAT is charged.</p>
      <p>
        Payment is taken by Stripe on our website. Your monthly membership fee is taken by Circle.
        We do not see or store your full card details in either case.
      </p>
      <p>All prices are in pounds sterling.</p>
      <p>Founders pricing is a limited introductory price.</p>
      <p>Workshops are sold at a single price with no comparison price shown.</p>
      <p>
        If we have made an obvious pricing error and you could reasonably have spotted it, we may
        cancel the order and refund you in full.
      </p>

      <h2>5. The Parent Guide and your 30 days of Inside the Loop</h2>
      <p>
        The Learning Confidence Parent Guide is delivered as a download as soon as your payment
        goes through.
      </p>
      <p>
        Your purchase also includes 30 days of access to Inside the Loop at no extra charge. We do
        not take card details for that period and it does not renew automatically. Nothing will be
        charged to you when the 30 days end.
      </p>
      <p>
        If you want to carry on after 30 days, you choose to continue and pay separately. We will
        email you before your access ends to remind you.
      </p>
      <p>
        If you do not continue, your access to Inside the Loop stops at the end of the 30 days.
        The Guide is yours to keep either way.
      </p>

      <h2>6. Inside the Loop membership</h2>
      <p>
        Membership costs £24.99 a month and continues until you cancel. It is taken by Circle,
        which hosts the community.
      </p>
      <p>
        You need to have bought the Learning Confidence Parent Guide to join. Membership is not
        sold on its own.
      </p>
      <p>
        You can cancel at any time from your account, in the same number of steps it took to
        join. Cancelling stops the next payment. It does not refund payments already taken, except
        where section 9 or section 10 applies.
      </p>
      <p>
        When your membership ends, your access to the community ends on the same day. Anything you
        bought that is delivered through the community, including a workshop place, is covered by
        section 7.2.
      </p>
      <p>If you cancel, you keep access until the end of the month you have paid for.</p>
      <p>
        If you have previously bought the Guide and let your membership lapse, you can rejoin at
        the current monthly price without buying the Guide again.
      </p>
      <p>
        We may change the monthly price. If we do, we will give you at least 30 days notice by
        email, and the new price applies from your next payment after that. You can cancel before
        it takes effect.
      </p>

      <h2>7. Workshops, Group Programmes and calls</h2>
      <p>
        <strong>7.1 All live sessions.</strong> Live sessions run on Zoom. The joining link is
        inside the member community rather than sent by email, and we admit only people on the
        attendee list.
      </p>
      <p>
        Sessions are not recorded. We do not record them and you may not record them either.
        Please do not record, screenshot or photograph any part of a live session. Other parents
        speak openly about their own children, and they are able to do that only because what is
        said in the room stays in the room.
      </p>
      <p>
        Because sessions are not recorded, there is no catch-up. If you do not attend a session you
        have booked and have not told us in advance, we cannot offer a replacement session or a
        refund.
      </p>
      <p>
        If we have to cancel or move a session, we will offer you an alternative date or a full
        refund for that session.
      </p>
      <p>
        <strong>7.2 Workshops.</strong> Your membership must be active on the day. Workshops are
        available to buyers of the Learning Confidence Parent Guide who hold an active Inside the
        Loop membership. Your membership must be active on the day of the workshop as well as on
        the day you book, because workshop access is delivered through your member account.
      </p>
      <p>
        If your membership ends before the workshop takes place, you will not be able to attend
        and we will refund your workshop fee in full. We check bookings against active memberships
        on the working day before each session, so you should receive the refund before the
        session runs rather than afterwards.
      </p>
      <p>
        If your membership has ended because a payment did not go through, we will contact you
        before refunding, so that you have the chance to update your payment details and keep your
        place. We will hold your place until 24 hours before the session.
      </p>
      <p>
        Workshop places go on sale ten days before each session and close 48 hours before it. Each
        workshop is a single live session at a set date and time.
      </p>
      <p>
        <strong>7.3 Group Programmes.</strong> Group Programmes have a maximum of 10 families and
        need a minimum of 6 to run. If a cohort does not reach 6, we will offer you the next
        cohort or a full refund, whichever you prefer.
      </p>
      <p>
        <strong>7.4 Pathway calls.</strong> Before you can book a Pathway call you complete a
        short Fit Check. It tells us whether a call would help your family, and sometimes it tells
        us that it would not. If it does, we will say so and point you somewhere more useful
        rather than selling you a call.
      </p>
      <p>
        You choose your availability from a set of options when you book. We do not use a booking
        calendar. Jane will contact you within three working days to arrange a time.
      </p>
      <p>A Pathway call can be rescheduled once, with at least 48 hours notice, at no charge.</p>

      <h2>8. Confidence Reset and Calm Reset</h2>
      <p>
        Both are one-to-one programmes, payable in full before the work begins. We do not offer
        instalments.
      </p>
      <p>
        Both require an active Inside the Loop membership and a completed Pathway call with our
        Pathway Coordinator before you can book.
      </p>
      <p>
        If the Pathway call concludes that the programme is not the right fit for your family, we
        will not sell it to you. You will receive a Your Way Forward plan instead, and the Pathway
        call fee still applies because that work has been done.
      </p>
      <p>Once the programme has started, section 9.4 applies.</p>

      <h2>9. Your right to cancel</h2>
      <p>
        You have legal rights to change your mind under the Consumer Contracts (Information,
        Cancellation and Additional Charges) Regulations 2013. How they work depends on what you
        bought.
      </p>
      <p>
        <strong>9.1 The general position.</strong> You normally have 14 days from the day we
        confirm your order to change your mind and cancel, without giving a reason. Sections 9.2
        to 9.4 explain how that works for each thing we sell.
      </p>
      <p>
        <strong>9.2 Downloads: the Guide and member packs.</strong> This is the important part.
        These products are digital content delivered immediately. The law lets you get them
        straight away rather than waiting 14 days, but there is a trade-off.
      </p>
      <p>
        At checkout you are asked to tick two boxes: one giving your express consent for us to
        supply the download immediately, and one confirming you understand that once the download
        starts, your 14 day right to change your mind is lost.
      </p>
      <p>
        If you tick both and the download starts, you no longer have a right to cancel and get
        your money back simply because you changed your mind.
      </p>
      <p>
        If you do not tick them, we will wait until your 14-day period has passed before giving
        you the download, and you keep the right to cancel during it.
      </p>
      <p>
        This does not affect your rights if the product is faulty, not as described, or not fit
        for purpose. Those rights are in section 11 and cannot be taken away.
      </p>
      <p>
        <strong>9.3 Inside the Loop membership.</strong> You have 14 days from joining to cancel
        and get your money back. If you ask us to give you access straight away, which is what
        happens when you join, and you then cancel within those 14 days, we will refund what you
        paid less a proportionate amount for the part of the month you had access to. Section 10
        gives you something more generous than this on your first month.
      </p>
      <p>The 30 days of access included with the Guide is not charged for, so there is nothing to refund on it.</p>
      <p>After the first 14 days, you can cancel any time to stop the next payment, but the month you are in is not refunded.</p>
      <p>
        <strong>9.4 Live sessions and programmes.</strong> You have 14 days from booking to cancel
        and get your money back.
      </p>
      <p>
        If the session or programme is due to run inside those 14 days and you ask us to go ahead
        anyway, and you then cancel, we will refund what you paid less a proportionate amount for
        what has already been delivered. For a group programme, that means the sessions that have
        already run. For a call or a workshop that has already taken place, no refund is due.
      </p>
      <p>Once the 14 days have passed, section 7 applies.</p>
      <p>
        <strong>9.5 How to cancel.</strong> Email us at{" "}
        <a href="mailto:complaints@theconfidentlearningco.org">
          complaints@theconfidentlearningco.org
        </a>{" "}
        and tell us clearly that you want to cancel. Give your name, your order reference and the
        date you ordered. You can use the form in Annex A, but you do not have to.
      </p>
      <p>To cancel a membership, use the cancel option in your account. To cancel anything else, email us.</p>
      <p>We will confirm we have received it. We will refund you using the same payment method you used, within 14 days of you telling us.</p>

      <h2>10. Our first month guarantee</h2>
      <p>
        Beyond your legal rights above, we offer one further guarantee. If you join Inside the
        Loop and it is not right for you, tell us within 14 days of your first payment and we will
        refund that first month in full, whether or not you have used the community.
      </p>
      <p>
        We do not offer a separate goodwill refund on the Learning Confidence Parent Guide.
        Because it is a download supplied to you immediately, your position on cancellation is set
        out in section 9.2, and your rights if the Guide is faulty or not as described are in
        section 11 and are unaffected.
      </p>
      <p>Where we do refund you, we will use the same payment method you used, and we will not charge you a fee for doing it.</p>

      <h2>11. If something is wrong with what we sold you</h2>
      <p>
        Your legal rights under the Consumer Rights Act 2015 always apply, whatever else these
        terms say. Nothing here reduces them.
      </p>
      <p>
        For digital content, including the Guide and member packs, it must be of satisfactory
        quality, fit for any purpose you told us about before you bought, and as described by us.
        If it is not, you can ask us to put it right. If we cannot, or do not do it within a
        reasonable time, you can ask for some or all of your money back.
      </p>
      <p>
        For services, including membership, workshops, programmes and calls, they must be carried
        out with reasonable care and skill. If they are not, you can ask us to do the work again,
        or ask for a price reduction.
      </p>
      <p>
        If you want to raise something, email{" "}
        <a href="mailto:complaints@theconfidentlearningco.org">
          complaints@theconfidentlearningco.org
        </a>{" "}
        and describe what is wrong. We would much rather hear it than not. You can find more
        information about your rights from Citizens Advice at{" "}
        <a href="https://www.citizensadvice.org.uk">citizensadvice.org.uk</a>, or by calling 0808
        223 1133.
      </p>

      <h2>12. What you may and may not do with our materials</h2>
      <p>
        Everything we produce belongs to The Confident Learning Co. When you buy, you get a
        personal, non-transferable right to use the materials for your own family.
      </p>
      <p>You may read, print and use the materials for your own family, and use the ideas in them with your own child, for as long as you like.</p>
      <p>
        You may not share, forward, upload, sell or give away the materials, in whole or in part;
        post them in other groups or communities, however helpful the intention; record,
        screenshot or photograph any live session; teach from them, or use them in your own paid
        or professional work with families; or reproduce our method or our materials in a product
        or service of your own.
      </p>
      <p>
        If you work professionally with children or families and want to use our materials in
        your work, get in touch and we will talk about it properly. We are not unreasonable about
        this, but it needs to be agreed rather than assumed.
      </p>

      <h2>13. What we do, and what we do not do</h2>
      <p>
        We provide parent education and parent coaching. We work through the parent, and we do
        not work directly with your child.
      </p>
      <p>
        What we sell is not therapy, counselling, psychological assessment, or a clinical service
        of any kind. It is not a substitute for your GP, your child&rsquo;s school, an educational
        psychologist, a SENCO, or any other qualified professional.
      </p>
      <p>Adam and Michela do not diagnose, treat, or assess any condition.</p>
      <p>Our work is designed to sit alongside professional support, never to replace it.</p>
      <p>
        We do not promise a particular outcome for your child. Every family is different, and what
        happens depends on a great deal that is outside our control. What we promise is that the
        work will be done with reasonable care and skill, by people who know what they are doing.
      </p>

      <h2>14. Ending your contract, or ours</h2>
      <p>You can end an ongoing membership at any time from your account, as set out in section 6.</p>
      <p>
        We may suspend or end your access if you seriously or repeatedly break these terms or our
        Community Terms of Use, if a payment fails and is not put right, or if we reasonably
        believe your conduct puts another member or a child at risk.
      </p>
      <p>
        If we end your membership because you have seriously or repeatedly broken these terms, we
        do not refund the remainder of the month you have paid for. If we end your membership for
        any other reason, or if we close the community, we refund the unused part of the month you
        have paid for.
      </p>
      <p>This does not affect your legal rights if what you bought was faulty, not as described, or not fit for purpose.</p>
      <p>If we stop selling something you have paid for and not yet received, we will refund you for the part you have not had.</p>

      <h2>15. Our responsibility to you</h2>
      <p>
        To the maximum extent permitted by law, the Seller&rsquo;s total liability to you for any
        losses, costs, damages, or legal claims arising out of or in connection with this digital
        guide, whether in contract, tort (including negligence), or otherwise, will be strictly
        limited to the actual purchase price paid for the guide.
      </p>
      <p>
        The Seller provides the digital guide &ldquo;as is&rdquo; and for general informational and
        educational purposes only. The Seller does not guarantee any specific outcomes, results, or
        success from following the contents of the guide, and will not be liable for any indirect,
        incidental, or downstream financial losses you may experience.
      </p>
      <p>
        Whatever that clause says, it will not limit our liability for death or personal injury
        caused by our negligence, for fraud or fraudulent misrepresentation, or for anything else
        that cannot be limited by law. It will not affect your statutory rights as a consumer.
      </p>

      <h2>16. Changes to these terms</h2>
      <p>
        We may update these terms. The version that applies to your purchase is the version that
        was on our site when you bought. For ongoing membership, we will give you at least 30 days
        notice of a material change by email, and you can cancel before it takes effect.
      </p>

      <h2>17. Complaints</h2>
      <p>
        If something has gone wrong, email{" "}
        <a href="mailto:complaints@theconfidentlearningco.org">
          complaints@theconfidentlearningco.org
        </a>
        . We will acknowledge it within 5 working days and give you a full response within 21
        days.
      </p>
      <p>
        If your complaint is about how we handle your information, email{" "}
        <a href="mailto:privacy@theconfidentlearningco.org">privacy@theconfidentlearningco.org</a>
        . We will acknowledge it within 30 days and respond without undue delay. Our Privacy
        Policy explains your rights and how to complain to the Information Commissioner&rsquo;s
        Office.
      </p>

      <h2>18. General</h2>
      <p>You cannot transfer your purchase or your membership to someone else without our agreement.</p>
      <p>If we do not insist on something straight away, that does not mean we have given up the right to.</p>
      <p>If any part of these terms turns out to be unenforceable, the rest continues to apply.</p>
      <p>
        These terms are governed by the law of England and Wales. You can bring court proceedings
        in England and Wales, and if you live in Scotland or Northern Ireland you can also bring
        them in your own country.
      </p>

      <h2>Annex A: Model cancellation form</h2>
      <p>You do not have to use this form, but you may. Complete it and email it back to us if you want to cancel.</p>
      <p>
        To: Adam Parker-Steed, trading as The Confident Learning Co., 49 Station Road, Polegate,
        East Sussex, BN26 6EA,{" "}
        <a href="mailto:complaints@theconfidentlearningco.org">
          complaints@theconfidentlearningco.org
        </a>
      </p>
      <p>I hereby give notice that I cancel my contract of sale for the following:</p>
      <ul>
        <li>Ordered on:</li>
        <li>Order reference:</li>
        <li>Name:</li>
        <li>Address:</li>
        <li>Signature (only if sending on paper):</li>
        <li>Date:</li>
      </ul>
    </LegalPage>
  );
}
