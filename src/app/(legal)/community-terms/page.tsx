import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Community Terms of Use",
  description: `Terms governing Inside the Loop, the membership community of ${brand.name}`,
};

/**
 * New page, 22 Aug 2026 (Build Addendum A v2.8, R13) —
 * `source-files/New/Community_Terms_of_Use_v1_4.docx`, v1.4, effective 24
 * August 2026. Pasted verbatim per this project's standing "paste required
 * copy exactly" rule. Section numbers matter — referenced by number from the
 * Terms and Conditions of Sale and by the client's own future correspondence.
 */
export default function CommunityTermsPage() {
  return (
    <LegalPage title="Community Terms of Use" updatedAt="24 August 2026" version="1.4" isDraft={false}>
      <p>Inside the Loop, the membership community of The Confident Learning Co.</p>

      <p>
        <strong>How this document fits with our Terms and Conditions of Sale.</strong> Both apply
        to you. Our Terms and Conditions of Sale govern price, payment, cancellation and refunds.
        This document governs how the community is used: who can be here, what may and may not be
        posted, how we moderate, and what happens if a rule is broken. Where the two overlap, the
        Terms and Conditions of Sale govern the money and this document governs the community.
      </p>

      <h2>Welcome, and why these terms exist</h2>
      <p>
        This community exists so that parents and carers can get practical help with a child who
        is struggling, and can do that without fear of judgement. It works because it is small,
        paid for, and made up of people who are here in good faith.
      </p>
      <p>
        These terms are not decoration. Some protect you, some protect your child, some protect
        other members, and some are here because the law requires them. Joining means agreeing to
        them, and you confirmed that at checkout.
      </p>

      <h2>1. What this community is, and what it is not</h2>
      <p>
        This is parent education and parent coaching. It is not therapy, counselling, assessment,
        or a clinical service of any kind, and it does not replace the work of your general
        practitioner, your child&rsquo;s school, an educational psychologist, a special
        educational needs coordinator, or any other qualified professional. Adam and Michela do
        not diagnose, treat, or assess any condition.
      </p>
      <p>
        If a child is showing signs of significant or persistent distress, withdrawal, low mood,
        anxiety, self harm, or any other concern relating to their mental or physical health,
        please speak to your general practitioner, your child&rsquo;s school, or a qualified
        mental health professional. This community sits alongside that work. It never replaces
        it.
      </p>

      <h2>2. Who can join</h2>
      <p>
        You must be eighteen or over. This is an adults only space. Children and young people must
        not be given access to your account and must not post here.
      </p>
      <p>
        You join under your real name. We hold your name, email address, postal address and
        telephone number, given when you joined. Your address and telephone number are never
        shown to other members.
      </p>
      <p>Your place here is personal. Do not share your login and do not post on behalf of anyone else.</p>
      <p>
        Access is by a single use invitation sent to the email address you used at checkout.
        Please sign in with that email address. If your invitation does not arrive, email{" "}
        <a href="mailto:adam@theconfidentlearningco.org">adam@theconfidentlearningco.org</a> and
        it will be reissued the same day.
      </p>
      <p>
        Members cannot message each other here. You can message us privately at any time, and we
        would rather you did that than post something you are unsure about.
      </p>

      <h2>3. Protecting children who are talked about here</h2>
      <p>Children discussed here have not agreed to be discussed. These rules are not optional.</p>
      <ul>
        <li>Refer to your child by first name or initial only. No surnames.</li>
        <li>Do not name your child&rsquo;s school, nursery, setting or class teacher.</li>
        <li>
          Do not name doctors, therapists, educational psychologists, social workers, local
          authority officers, or any other named practitioner.
        </li>
        <li>
          Do not post photographs or videos of children, including your own, and including
          images with faces obscured.
        </li>
        <li>
          Do not post documents containing identifying information, including reports, letters,
          plans, assessments or correspondence, unless every identifying detail has been removed.
        </li>
      </ul>
      <p>
        You can describe a situation fully without identifying anyone. If you are not sure how,
        ask before you post and we will help you word it.
      </p>

      <h2>4. Legal proceedings</h2>
      <p>
        Do not post about court proceedings involving your child or your family. That includes
        family court proceedings, care proceedings, contact and residence arrangements made
        through the court, and any report prepared for a court.
      </p>
      <p>
        This is not caution for its own sake. Publishing information about proceedings held in
        private concerning children can be a contempt of court, and that applies to you as well
        as to us. Posts of this kind are removed without discussion. We will not comment on the
        merits of your case and we will suggest you take legal advice.
      </p>
      <p>
        Appeals about educational provision are treated differently. You may discuss the process
        in general terms. Do not post case documents and do not name the setting, the officer or
        any witness.
      </p>

      <h2>5. If your child is not currently in school</h2>
      <p>
        If your child is not in school at the moment, tell us which of these fits, because the
        route is different for each one and getting it right saves you weeks.
      </p>
      <ul>
        <li>
          <strong>Your child is on a school roll and is not going in.</strong> The first two
          conversations are with the school and with your general practitioner, and they come
          before any conversation about programmes. The school has duties here and a set of
          things it can put in place. Your general practitioner is the door to anything needing a
          health route. Both move slowly, which is why they need starting now. Ask us for Your
          Way Forward and we will walk you through it.
        </li>
        <li>
          <strong>You have formally deregistered and you are home educating.</strong> That is a
          lawful choice and we are not going to send you back to a school you have left. Tell us
          whether your provision feels settled or whether you are still finding your footing, and
          we will start from wherever you actually are.
        </li>
        <li>
          <strong>You deregistered recently and it was not the choice you wanted.</strong> Then
          the first conversation is with your general practitioner, and we would like to hear
          more from you before we talk about anything else. There is no rush from our side and
          nothing you need to decide today.
        </li>
      </ul>
      <p>
        This is not us stepping back from you. It is the order that gets your child the right
        support fastest, and it stops you spending money and energy on the wrong thing at the
        wrong moment.
      </p>

      <h2>6. Advice and safety</h2>
      <p>
        Members must not give medical or clinical advice. That includes medication, dosage,
        supplements, diets, restriction, restraint, seclusion, or any therapy not delivered by a
        registered practitioner.
      </p>
      <p>
        Nothing posted here by any member, including by Adam or Michela, is a diagnosis, a
        clinical opinion, or a substitute for advice from a qualified professional.
      </p>
      <p>
        Content posted by other members is their own view. The Confident Learning Co. does not
        check it and does not endorse it.
      </p>
      <p>
        If you are worried about your child&rsquo;s immediate safety, or your own, contact
        emergency services rather than posting here. Urgent support contacts are pinned at the
        top of the community.
      </p>

      <h2>7. How we behave with each other</h2>
      <ul>
        <li>Disagree with the idea, not the person.</li>
        <li>No pile ons. If several people are already responding critically to one member, step back.</li>
        <li>No abuse, harassment, threats, intimidation or repeated unwanted contact.</li>
        <li>
          No discriminatory content, including on grounds of race, religion, disability, sex,
          gender reassignment, sexual orientation, age, pregnancy or marital status.
        </li>
        <li>
          No content that is sexual, violent, or that encourages self harm, disordered eating, or
          any other harm.
        </li>
        <li>No content that is illegal, or that encourages or assists an offence.</li>
        <li>
          No accusations of criminality, abuse, malpractice or professional misconduct against
          any identifiable person or organisation.
        </li>
      </ul>

      <h2>8. Privacy inside and outside</h2>
      <p>
        What is posted here stays here. Do not screenshot, copy, forward, quote or repost member
        content anywhere outside this community, including to social media, messaging groups,
        journalists, or legal or professional advisers.
      </p>
      <p>Do not use member content as evidence in any proceedings.</p>
      <p>Do not approach members outside the community without their agreement.</p>
      <p>
        This is enforceable and breaking it is a ground for immediate removal. Bear in mind that
        we cannot technically stop another member taking a screenshot. Post accordingly, and
        follow section three.
      </p>

      <h2>9. Selling, promotion and recruitment</h2>
      <ul>
        <li>
          No advertising, selling, affiliate links, recruitment or promotion of your own services
          or anyone else&rsquo;s, unless agreed in advance.
        </li>
        <li>No soliciting members into other paid groups, programmes or schemes.</li>
        <li>No research recruitment, surveys or data gathering without written permission.</li>
      </ul>

      <h2>10. Materials we provide</h2>
      <p>
        Resources, worksheets, recordings and frameworks provided by The Confident Learning Co.,
        including everything in the Confidence Library, are our intellectual property. Your
        membership gives you a personal, non transferable licence to use them with your own
        family. You may not share, sell, publish, adapt for commercial use, or teach from them
        without written permission.
      </p>

      <h2>11. Reporting a problem</h2>
      <p>
        Every post has a report option. You can also email{" "}
        <a href="mailto:complaints@theconfidentlearningco.org">
          complaints@theconfidentlearningco.org
        </a>{" "}
        or send a message to a moderator.
      </p>
      <p>
        We check the community twice each working day, at fixed times. Report notifications reach
        us at all times, including evenings and weekends, and anything urgent is dealt with when
        we see it rather than waiting for the next check. We aim to acknowledge a report within
        one working day and to tell you the outcome within five working days.
      </p>
      <p>
        Reports about illegal content, immediate risk to a child or an adult, or a safeguarding
        concern are dealt with as a priority and never wait for a scheduled check.
      </p>
      <p>
        If you are not satisfied with how a report was handled, email{" "}
        <a href="mailto:complaints@theconfidentlearningco.org">
          complaints@theconfidentlearningco.org
        </a>{" "}
        and ask for a review. Where possible the review is carried out by someone other than the
        person who made the original decision, and you will have a written answer within ten
        working days.
      </p>

      <h2>12. When rules are broken</h2>
      <p>We use a proportionate response. Serious matters go straight to the end of this list.</p>
      <ul>
        <li>
          <strong>Quiet correction</strong> — a short standard note asking for a change, or a
          single post removed with an explanation. Nothing is edited. Typical trigger: first
          breach of the naming, identifying or advice rules.
        </li>
        <li>
          <strong>Formal warning</strong> — written warning by email, recorded, with the specific
          rule identified. Typical trigger: repeat breach, or a single breach that affected
          another member.
        </li>
        <li>
          <strong>Suspension</strong> — posting paused for a set period. Access to the Confidence
          Library continues. Typical trigger: behaviour towards another member, or a third
          breach.
        </li>
        <li>
          <strong>Removal</strong> — membership ended, access withdrawn, unused period refunded
          unless there is a stated reason not to. Typical trigger: abuse, harassment, sharing
          member content outside, posting illegal content, or serious repeat breach.
        </li>
        <li>
          <strong>Referral</strong> — report to the police, a local authority or a regulator, with
          the relevant material preserved. Typical trigger: illegal content, or information
          indicating a child or adult is at risk.
        </li>
      </ul>
      <p>
        You will be told which stage applies and why, unless telling you would create a risk to
        someone or prejudice an investigation. You can challenge any decision by replying within
        ten working days.
      </p>

      <h2>13. Confidentiality has a limit</h2>
      <p>
        We treat what you share with care. There are situations where we pass information on
        without your agreement, and you should know what they are before you post.
      </p>
      <ul>
        <li>
          Where we believe a child is at risk of significant harm, we will share information with
          children&rsquo;s services for the area where the child lives, and with the police if the
          risk is immediate.
        </li>
        <li>
          Where we believe an adult at risk is being harmed, we will share information with adult
          social care or the police.
        </li>
        <li>Where we believe there is a risk to life, we will contact emergency services.</li>
        <li>
          Where we are required to by law, including in response to a court order or a lawful
          request from the police or a regulator.
        </li>
      </ul>
      <p>
        Wherever it is safe and appropriate, we will tell you we are doing this. Sometimes it will
        not be appropriate, and we will not.
      </p>

      <h2>14. Your data</h2>
      <p>
        Adam Parker-Steed, a sole trader, trading as The Confident Learning Co., is the data
        controller. Our privacy notice at{" "}
        <a href="/privacy">theconfidentlearningco.org/privacy</a> explains what we collect, why,
        how long we keep it and what your rights are. We are registered with the Information
        Commissioner&rsquo;s Office under registration number ZC219573.
      </p>
      <p>
        Your account and your posts are kept for twelve months after your membership ends, and
        then deleted. If you leave sooner and ask us to delete or anonymise your posts, we will,
        unless we need to keep something for a legal reason. Moderation records and safeguarding
        records are held separately, more securely, and for longer, because we may need them. The
        reasons and the periods are in the privacy notice.
      </p>
      <p>
        <strong>Why we hold your address and telephone number.</strong> Three reasons, and none
        of them involve showing them to other members. They allow us to identify you as the
        account holder. They allow us to reach emergency services on your behalf if we ever
        believe there is a risk to life. And where someone complains that something posted here is
        defamatory of them, the law gives us a procedure to follow, and that procedure can require
        us to pass a poster&rsquo;s name and postal address to the complainant, but only with that
        poster&rsquo;s consent or on a court order. Our privacy notice sets this out in full.
      </p>
      <p>
        Questions about your data go to{" "}
        <a href="mailto:privacy@theconfidentlearningco.org">privacy@theconfidentlearningco.org</a>
        . Safeguarding matters go to{" "}
        <a href="mailto:safeguarding@theconfidentlearningco.org">
          safeguarding@theconfidentlearningco.org
        </a>
        .
      </p>

      <h2>15. Money, cancellation and refunds are dealt with elsewhere</h2>
      <p>
        Everything about price, payment, your thirty days included with the Learning Confidence
        Parent Guide, continuing afterwards, cancelling and refunds is set out in our Terms and
        Conditions of Sale at <a href="/terms">theconfidentlearningco.org/terms</a>. You agreed to
        those at checkout alongside this document.
      </p>
      <p>
        The short version, so you are not hunting for it. Your first thirty days here come with
        the Parent Guide and cost nothing extra. We hold no card for you during them, so nothing
        can be charged by surprise. We will email you on day twenty five and again on day
        twenty nine. On day thirty your access ends unless you have chosen to continue at GBP
        24.99 a month, which you do yourself. The Terms and Conditions of Sale are what govern all
        of it, and if anything here and there ever disagreed, they would win.
      </p>

      <h2>16. Changes and things outside our control</h2>
      <p>
        We may change these terms. Where a change materially affects you, we give at least thirty
        days&rsquo; notice, you may cancel without penalty, and we will ask you to confirm you have
        seen the current version.
      </p>
      <p>
        The community is hosted on Circle, a third party platform. We are not responsible for
        their outages, but we will tell you what is happening.
      </p>
      <p>
        We do not guarantee any particular outcome for your child. What we offer is a way of
        working, a structure and support.
      </p>

      <h2>17. Law and contact</h2>
      <p>
        This agreement is governed by the law of England and Wales, and the courts of England and
        Wales have jurisdiction.
      </p>
      <p>
        Adam Parker-Steed, a sole trader, trading as The Confident Learning Co., 49 Station Road,
        Polegate, East Sussex, BN26 6EA. Information Commissioner&rsquo;s Office registration
        ZC219573. General contact{" "}
        <a href="mailto:adam@theconfidentlearningco.org">adam@theconfidentlearningco.org</a>.
      </p>

      <p>
        By joining you confirm you are eighteen or over, that you have read these terms and our
        privacy notice, and that you agree to them.
      </p>
      <p>Adam Parker-Steed, Founder and Learning Confidence Specialist, The Confident Learning Co.</p>
    </LegalPage>
  );
}
