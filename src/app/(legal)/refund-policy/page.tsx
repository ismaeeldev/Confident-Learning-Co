import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { brand } from "@/config/brand";
import { PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "Refunds and Cancellations",
  description: `Refunds and cancellations at ${brand.name}`,
};

/**
 * Replaced 21 Aug 2026 — the previous content here was a stale, generic
 * placeholder that actively contradicted the real refund mechanics built
 * since (it described the 30-day Guide access as a "trial" and said
 * membership was never refundable, both wrong). This is the client's real,
 * final content (`source-files/TCLC_Refunds_Page_Content_v1_2.html`, v1.2,
 * in force from 20 August 2026), reused at the existing `/refund-policy`
 * route rather than the dev note's suggested `/refunds` — same nav slot,
 * no orphaned duplicate page. `{{TERMS_URL}}` resolved to the real Terms
 * page; the `id="wrong"` anchor is preserved exactly, since the page
 * links to itself. Content is controlled by the client and changes when
 * the Terms change — do not edit the wording here without a matching
 * update from them.
 */
export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refunds and Cancellations" updatedAt="20 August 2026" version="1.2" isDraft={false}>
      <p>
        <em>What happens if you change your mind, or something is not right.</em>
      </p>

      <div className="border-border bg-surface rounded-2xl border p-5 text-sm">
        <p className="font-heading text-base">Before you read on</p>
        <p className="mt-2">This page is a plain summary, written so you can find the answer quickly.</p>
        <p className="mt-2">
          Our <a href={PUBLIC_ROUTES.terms}>Terms and Conditions of Sale</a> are what actually
          apply. If anything here differs from them, the Terms are what count.
        </p>
        <p className="mt-2">Nothing on this page reduces your legal rights.</p>
      </div>

      <h2>The Learning Confidence Parent Guide</h2>
      <p>
        At checkout you are asked to tick two boxes. One gives us your permission to send the
        download straight away rather than waiting for your 14 day cancellation period to end.
        The other confirms you understand that once the download starts, you lose the right to
        change your mind and get a refund.
      </p>
      <p>If you tick both and the download starts, we cannot refund the Guide simply because you have changed your mind.</p>
      <p>
        If you would rather keep your right to change your mind, do not tick them. Your purchase
        goes through as normal and we hold your download for 14 days from the day we confirm your
        order. We will tell you the exact date it will arrive, both at checkout and in your
        confirmation email, and you can see it in your account at any time. During those 14 days
        you can cancel and get a full refund. You get the Guide either way; the only difference is
        when.
      </p>
      <p>
        If you change your mind during the wait and decide you would rather have it now, you can
        release the download yourself from your account. That ends your right to cancel, and we
        will say so before you do it.
      </p>
      <p>
        If the Guide is faulty, or it is not what we described, that is a different thing
        entirely. Your rights there are unaffected and we will put it right. See{" "}
        <a href="#wrong">If something is faulty</a> below.
      </p>

      <h2>Member packs</h2>
      <p>
        Downloadable packs work exactly the same way as the Guide. Two boxes at checkout, and the
        same choice between having it now or keeping your right to change your mind.
      </p>

      <h2>Inside the Loop membership</h2>
      <p>
        If you join and it is not right for you, tell us within 14 days of your first payment and
        we will refund that first month in full. It does not matter whether you have used the
        community or not. We would rather you told us it was not for you than paid for something
        you are not using.
      </p>
      <p>
        That guarantee is more generous than your legal right, which would allow us to keep a
        proportionate amount for the part of the month you had access to. We do not do that on
        your first month.
      </p>
      <p>
        After those first 14 days, you can cancel at any time from your account and it stops your
        next payment. The month you are already in is not refunded.
      </p>
      <p>Cancelling takes the same few steps that joining did. If you cannot find it, email us and we will do it for you.</p>
      <p>The 30 days of access included with the Guide is not charged for, so there is nothing to refund on it.</p>

      <h2>Workshops</h2>
      <p>
        Your membership needs to be active on the day of the workshop, not just on the day you
        book, because we deliver workshop access through your member account.
      </p>
      <p>
        If your membership ends before the workshop takes place, you will not be able to attend
        and we will refund your place in full. We check bookings against active memberships the
        working day before each session, so you should have the refund before the session runs
        rather than afterwards.
      </p>
      <p>
        If your membership ended because a payment did not go through, we will contact you before
        refunding, so you have the chance to update your details and keep your place. We will hold
        it until 24 hours before the session.
      </p>
      <p>
        If you simply do not attend a session you booked, and you have not told us in advance, we
        cannot offer a refund or a replacement. Our sessions are live and we do not record them, so
        there is nothing to catch up on. Please only book a date you can make.
      </p>

      <h2>Pathway calls, Group Programmes, and the Resets</h2>
      <p>You have 14 days from booking to change your mind and get your money back.</p>
      <p>
        If the call or the session has already happened within those 14 days, or part of a
        programme has already run, we will refund what you paid less the part that has already
        been delivered. For a call or a workshop that has already taken place, there is nothing
        left to refund.
      </p>
      <p>A Pathway call can be moved once, at no charge, if you give us at least 48 hours notice.</p>
      <p>
        If a Pathway call concludes that a programme is not the right fit for your family, we will
        not sell it to you. You will get a Your Way Forward plan instead. The call fee still
        applies, because that work has been done.
      </p>

      <h2>If we cancel or move something</h2>
      <p>If we have to move or cancel a session, you choose: an alternative date, or a full refund for that session.</p>
      <p>
        Group Programmes need a minimum of six families to run. If a cohort does not reach six, we
        will offer you the next one or a full refund, whichever you prefer.
      </p>
      <p>If we ever close the community, we will refund the unused part of the month you have paid for.</p>

      <h2>If we end your membership</h2>
      <p>
        If we end your membership because you have seriously or repeatedly broken our Community
        Terms of Use, we do not refund the remainder of the month you have paid for.
      </p>
      <p>If we end it for any other reason, we refund the unused part of the month.</p>

      <h2 id="wrong">If something is faulty, or not what we described</h2>
      <p>
        Your rights under the Consumer Rights Act 2015 always apply, and nothing on this page or
        in our Terms reduces them.
      </p>
      <p>
        Anything we sell has to be of satisfactory quality, fit for the purpose you told us about,
        and as we described it. Anything we deliver as a service has to be carried out with
        reasonable care and skill. If that has not happened, tell us and we will put it right. If
        we cannot, you can ask for some or all of your money back.
      </p>
      <p>
        We would much rather hear about it than not. You can also get free advice from Citizens
        Advice at <a href="https://www.citizensadvice.org.uk">citizensadvice.org.uk</a> or on 0808
        223 1133.
      </p>

      <h2>How to ask for a refund</h2>
      <p>
        Email <a href="mailto:complaints@theconfidentlearningco.org">complaints@theconfidentlearningco.org</a> and
        tell us what you would like to cancel or refund. Include your name, your order reference,
        and the date you ordered.
      </p>
      <p>To cancel a membership, use the cancel option in your account. To cancel anything else, email us.</p>
      <p>
        We will confirm we have received it. Where a refund is due, we will send it back to the
        same payment method you used, within 14 days of you telling us. We never charge a fee for
        making a refund.
      </p>

      <div className="border-border bg-surface-sage rounded-2xl border p-5 text-sm">
        <p>
          We would rather refund a parent who is not getting value than keep money from someone who
          is not using what they bought. If you are unsure whether something applies to you, just
          ask us.
        </p>
      </div>
    </LegalPage>
  );
}
