import React from 'react';
import { SEOOptimizer } from './SEOOptimizer.jsx';

export function AffiliateDisclosurePage() {
  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="Affiliate Disclosure Policy | NootropicStacker"
        customDescription="Learn about how NootropicStacker earns commissions through affiliate partnerships while maintaining editorial independence."
      />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-3">Affiliate Disclosure Policy</h1>
        <p className="text-sm text-ink-500 mb-4">Last updated: April 2026</p>

        <section className="space-y-3 text-ink-700 leading-relaxed">
          <p>
            NootropicStacker is committed to transparency. We want you to understand
            how we sustain our operations while maintaining editorial independence.
          </p>

          <h2 className="text-xl font-semibold text-ink-900 mt-8">Affiliate Links</h2>
          <p>
            Some links on NootropicStacker are affiliate links. If you click an affiliate
            link and make a purchase, we may earn a small commission at no extra cost to
            you. These commissions help us cover research costs, hosting, and the time we
            invest in creating content.
          </p>
          <p>
            Not all links on the site are affiliate links. We distinguish affiliate links
            with a disclosure notice near the linked content and in prominent page-level
            banners.
          </p>

          <h2 className="text-xl font-semibold text-ink-900 mt-8">Amazon Associates</h2>
          <p>
            NootropicStacker is a participant in the Amazon Services LLC Associates
            Program, an affiliate advertising program designed to provide a means for
            sites to earn advertising fees by advertising and linking to Amazon.com and
            affiliated sites. As an Amazon Associate we earn from qualifying purchases.
          </p>

          <h2 className="text-xl font-semibold text-ink-900 mt-8">Other Affiliate Programs</h2>
          <p>
            We also participate in affiliate programs with the following partners:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mind Lab Pro</li>
            <li>Neurohacker (Qualia)</li>
            <li>Nootropics Depot</li>
            <li>Thorne</li>
            <li>Athletic Greens (AG1)</li>
            <li>iHerb</li>
            <li>Four Sigmatic</li>
            <li>Onnit</li>
          </ul>

          <h2 className="text-xl font-semibold text-ink-900 mt-8">Editorial Independence</h2>
          <p>
            Affiliate relationships do not influence our editorial content. We do not
            accept payment from supplement brands in exchange for coverage, rankings, or
            reviews. Our stack recommendations, supplement ratings, and research summaries
            are based on available scientific evidence and practical experience —
            independent of any commercial relationship.
          </p>
          <p>
            If a product is featured in an affiliate link, it is because our editorial
            team independently determined it meets our quality and evidence standards.
          </p>

          <h2 className="text-xl font-semibold text-ink-900 mt-8">Sponsored Content</h2>
          <p>
            Occasionally we publish sponsored content or banner advertisements. All
            sponsored content is clearly labeled. Sponsored placements do not affect our
            editorial recommendations or supplement ratings.
          </p>

          <h2 className="text-xl font-semibold text-ink-900 mt-8">Questions</h2>
          <p>
            If you have any questions about our affiliate relationships or this policy,
            please contact us.
          </p>
        </section>
      </div>
    </>
  );
}
