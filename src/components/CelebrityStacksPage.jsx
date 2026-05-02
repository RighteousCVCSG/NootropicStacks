import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, AlertTriangle, ArrowRight, ExternalLink, Shield, Brain, Users, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { useStack } from '@/contexts/StackContext.jsx';
import { supplements } from '@/data/supplements.js';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { CELEBRITIES, MATRIX_EXPERTS, MATRIX_DATA, FAQ_DATA, SUPPLEMENT_SLUG_MAP } from '@/data/celebrityStacks.js';
import { JsonLd } from './JsonLd.jsx';
import { buildItemListSchema } from '@/lib/schema/builders.js';

function StarRow({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= count ? 'fill-accent-500 text-accent-500' : 'text-ink-200'
          }`}
        />
      ))}
    </div>
  );
}

export function CelebrityStacksPage() {
  const { addSupplement } = useStack();

  const loadCelebStack = (celeb) => {
    celeb.supplements.forEach((s) => {
      const supplementId = SUPPLEMENT_SLUG_MAP[s.slug];
      if (!supplementId) return;
      const supplement = supplements.find((sup) => sup.id === supplementId);
      if (supplement) {
        addSupplement(supplement);
      }
    });
  };

  const loadFoundationStack = () => {
    const foundationSlugs = ['omega-3', 'creatine', 'magnesium'];
    foundationSlugs.forEach((slug) => {
      const id = SUPPLEMENT_SLUG_MAP[slug];
      if (!id) return;
      const supplement = supplements.find((s) => s.id === id);
      if (supplement) {
        addSupplement(supplement);
      }
    });
  };

  const itemListItems = CELEBRITIES.flatMap((celeb) =>
    (celeb.supplements || [])
      .map((s) => {
        const id = SUPPLEMENT_SLUG_MAP[s.slug];
        if (!id) return null;
        return {
          name: s.name,
          url: `https://nootropicstacker.com/supplements/${id}`,
        };
      })
      .filter(Boolean)
  );

  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="Celebrity Supplement Stacks — What Experts Actually Take | NootropicStacker"
        customDescription="We traced every supplement Huberman, Bryan Johnson, Peter Attia, Rhonda Patrick, and 4 others actually take back to the exact podcast episode or book page. Doses, brands, and sources — all in one place."
      />
      <JsonLd
        data={buildItemListSchema({
          name: 'Celebrity Supplement Stacks',
          items: itemListItems,
        })}
      />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero */}
        <div className="text-center">
          <Badge className="bg-primary-100 text-primary-800 border-primary-200 mb-4">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified Sources
          </Badge>
          <h1 className="text-3xl md:text-5xl font-semibold text-ink-900 mb-4 leading-tight">
            What 8 Biohacking Experts<br />
            <span className="text-primary-800">Actually Take</span>
          </h1>
          <p className="text-ink-700 max-w-2xl mx-auto mb-4">
            We mapped every supplement to the exact podcast episode, newsletter, or book where they
            mentioned it. Verify it yourself.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="px-5 py-3 rounded-md bg-surface-card border border-ink-200 flex items-center gap-3">
              <Users className="w-5 h-5 text-primary-800" />
              <div className="text-left">
                <div className="text-2xl font-semibold text-ink-900 leading-none">8</div>
                <div className="text-xs text-ink-500 mt-0.5">Experts</div>
              </div>
            </div>
            <div className="px-5 py-3 rounded-md bg-surface-card border border-ink-200 flex items-center gap-3">
              <Brain className="w-5 h-5 text-primary-800" />
              <div className="text-left">
                <div className="text-2xl font-semibold text-ink-900 leading-none">100+</div>
                <div className="text-xs text-ink-500 mt-0.5">Supplements Documented</div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-ink-200" />

        {/* Comparison Matrix */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-ink-900 mb-1">
              The Cross-Expert Comparison Matrix
            </h2>
            <p className="text-ink-500 text-sm max-w-3xl">
              Which supplements appear across multiple experts? Rows are the most cross-cited
              compounds. A check means the expert has publicly documented taking it.
            </p>
          </div>
          <div className="rounded-md border border-ink-200 bg-surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-sunk border-b border-ink-200">
                    <th className="sticky left-0 z-10 bg-surface-sunk text-left font-semibold text-ink-900 px-4 py-3 min-w-[160px]">
                      Supplement
                    </th>
                    {MATRIX_EXPERTS.map((name) => (
                      <th
                        key={name}
                        className="text-center font-semibold text-ink-900 px-3 py-3 min-w-[90px] text-xs"
                      >
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX_DATA.map((row, idx) => (
                    <tr
                      key={row.supplement}
                      className={`border-b border-ink-100 ${
                        idx % 2 === 0 ? 'bg-surface-card' : 'bg-surface-sunk/50'
                      }`}
                    >
                      <td className="sticky left-0 z-10 bg-surface-card/95 backdrop-blur font-medium text-ink-900 px-4 py-3">
                        {row.supplement}
                      </td>
                      {row.values.map((v, i) => (
                        <td key={i} className="text-center px-3 py-3">
                          {v ? (
                            <CheckCircle className="w-4 h-4 text-accent-500 inline-block" />
                          ) : (
                            <span className="text-ink-300">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Key Findings */}
        <section>
          <Card className="border-primary-200 bg-primary-050">
            <CardContent className="p-3">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary-100 border border-primary-200 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-800" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-ink-900 mb-2">
                    The 3 supplements that appear in 7+ of 8 stacks:{' '}
                    <span className="text-primary-800">Omega-3, Creatine, Magnesium</span>
                  </h3>
                  <p className="text-ink-700 text-sm mb-4 leading-relaxed">
                    Start with these three before anything else. They have the broadest expert
                    consensus, the strongest research base, and the lowest cost-per-day.
                  </p>
                  <Button onClick={loadFoundationStack} className="gap-2">
                    Build the Foundation Stack <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Celebrity Cards */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-ink-900 mb-1">
              The 8 Expert Stacks
            </h2>
            <p className="text-ink-500 text-sm max-w-3xl">
              Top nootropic-relevant supplements only — focus, memory, sleep, energy. Prescription
              drugs and food items are excluded.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {CELEBRITIES.map((celeb) => (
              <div
                key={celeb.name}
                className="p-3 rounded-md border border-ink-200 bg-surface-card flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-semibold text-ink-900 mb-1">
                      {celeb.name}
                    </h3>
                    <Badge variant="outline" className="text-xs text-ink-500 border-ink-200">
                      {celeb.role}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StarRow count={celeb.credibility} />
                    {celeb.conflictOfInterest && (
                      <Badge className="bg-warn-100 text-warn-700 border-warn-500 text-[10px] gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Conflict of Interest
                      </Badge>
                    )}
                  </div>
                </div>

                {celeb.conflictOfInterest && celeb.conflictNote && (
                  <p className="text-xs text-warn-700/80 mb-3 italic">
                    Note: {celeb.conflictNote}
                  </p>
                )}

                <blockquote className="border-l-2 border-primary-300 pl-3 mb-4 text-sm text-ink-500 italic">
                  &ldquo;{celeb.quote}&rdquo;
                </blockquote>

                <div className="mb-4">
                  <span className="text-xs font-semibold text-ink-700">Focus:</span>{' '}
                  <span className="text-xs text-ink-500">{celeb.focus}</span>
                </div>

                <div className="mb-4 flex-1">
                  <h4 className="text-xs font-semibold text-ink-700 mb-2 uppercase tracking-wide">
                    Top 5 Supplements
                  </h4>
                  <div className="space-y-1.5">
                    {celeb.supplements.map((s, i) => (
                      <div
                        key={`${s.name}-${i}`}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-surface-sunk border border-ink-100"
                      >
                        <span className="text-sm font-medium text-ink-900 truncate">
                          {s.name}
                        </span>
                        <span className="text-xs text-primary-800 font-semibold flex-shrink-0">
                          {s.dose}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={celeb.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ink-500 hover:text-primary-800 transition-colors mb-4 inline-flex items-center gap-1"
                >
                  Source: {celeb.sourceLabel}
                  <ExternalLink className="w-3 h-3" />
                </a>

                <Button
                  onClick={() => loadCelebStack(celeb)}
                  variant="outline"
                  className="w-full gap-2 border-primary-200 hover:bg-primary-050 hover:text-primary-700"
                >
                  Load This Stack <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Source Transparency */}
        <section>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary-800 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-ink-900 mb-2">
                    Source transparency
                  </h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    Every supplement above is cited from a primary source — the expert's own website,
                    podcast episode, newsletter, or published book. We note conflicts of interest
                    where experts own the brands they recommend. We don't profit from any expert's
                    personal brand, and we don't reorder this list based on affiliate payouts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-ink-900 mb-1">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {FAQ_DATA.map((item) => (
              <Card key={item.q}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-ink-900 text-base mb-2">{item.q}</h3>
                  <p className="text-sm text-ink-700 leading-relaxed">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="p-4 rounded-md border border-primary-200 bg-primary-050 text-center">
          <Brain className="w-8 h-8 text-primary-800 mx-auto mb-3" />
          <h2 className="text-2xl font-semibold text-ink-900 mb-2">
            Build Your Own Evidence-Based Stack
          </h2>
          <p className="text-ink-700 mb-3 max-w-md mx-auto text-sm">
            Don't copy a celebrity. Start from your goals, build progressively, and verify what
            actually works for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/build">
              <Button className="gap-2 w-full sm:w-auto">
                Open Stack Builder <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/start-here">
              <Button variant="outline" className="gap-2 w-full sm:w-auto border-ink-200">
                Start Here Guide
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
