import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://nootropicstacker.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// Per-page meta defaults. Canonical is derived from window.location.pathname
// in the component (line ~196), so we don't store one here — that prevents
// stale-canonical bugs where two routes share a SEO_DATA key.
const SEO_DATA = {
  home: {
    title: 'NootropicStacker — Free Nootropic Stack Builder | 195 Supplements',
    description: 'Build nootropic supplement stacks with 195 compounds. Stack Score rates synergy, coverage, balance, and efficiency. Free quiz and interaction warnings.',
  },
  build: {
    title: 'Stack Builder — Pick Goals, Add Supplements, Score the Stack',
    description: 'Free interactive nootropic stack builder. Choose goals, browse 195 supplements, get a Stack Score across four 0–25 dimensions, and see interaction warnings live.',
  },
  quiz: {
    title: 'Stack Quiz — Get a Personalized Nootropic Starting Point',
    description: 'Five quick questions and you get a starter nootropic stack matched to your goals — focus, sleep, energy, mood, or memory.',
  },
  supplements: {
    title: 'Supplement Library — 195 Nootropics with Effects & Dosages',
    description: 'Search 195 nootropic and biohacking supplements by goal, evidence tier, or category. Effect profiles, dosage ranges, interaction warnings, every claim cited.',
  },
};

// Generate structured data for supplements
const generateSupplementStructuredData = (supplement) => {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": supplement.name,
    "description": supplement.description,
    "category": supplement.category,
    "brand": {
      "@type": "Brand",
      "name": "Various Manufacturers"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "10",
      "highPrice": "200",
      "availability": "https://schema.org/InStock"
    },
    // AggregateRating intentionally omitted: fabricating reviewCount on a
    // YMYL health page is a Google quality-rater spam signal. We don't have
    // real review data, so we don't claim it. Trust > rich-snippet star CTR.
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Dosage Range",
        "value": `${supplement.dosage.min}-${supplement.dosage.max} ${supplement.dosage.unit}`
      },
      {
        "@type": "PropertyValue",
        "name": "Timing",
        "value": supplement.dosage.timing
      }
    ]
  };

  const medicalWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `${supplement.name} — Effects, Dosage & Safety`,
    "description": supplement.description,
    "url": `https://nootropicstacker.com/supplements/${encodeURIComponent(supplement.name.toLowerCase().replace(/\s+/g, '-'))}`,
    "about": {
      "@type": "DietarySupplement",
      "name": supplement.name,
      "description": supplement.description,
      "maximumIntake": `${supplement.dosage.max} ${supplement.dosage.unit}`,
      "recommendedIntake": {
        "@type": "RecommendedDoseSchedule",
        "doseUnit": supplement.dosage.unit,
        "doseValue": `${supplement.dosage.min}-${supplement.dosage.max}`
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "NootropicStacker",
      "url": "https://nootropicstacker.com"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://nootropicstacker.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Supplements",
          "item": "https://nootropicstacker.com/supplements"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": supplement.name,
          "item": `https://nootropicstacker.com/supplements/${encodeURIComponent(supplement.name.toLowerCase().replace(/\s+/g, '-'))}`
        }
      ]
    }
  };

  return [productSchema, medicalWebPageSchema];
};

// Generate FAQ structured data — product-specific Qs with PubMed
// citations on the answers. AI Crawler + Critic panels both flagged
// the previous 4 generic Qs as the unsourced-claim pattern that
// HCU/Perplexity downrank on YMYL pages.
const generateFAQStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is NootropicStacker free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The stack builder, supplement library, quiz, interaction warnings, and Stack Score are all free. We earn small affiliate commissions on optional outbound product links to vendors like Amazon and iHerb; commissions never influence rankings or recommendations."
        }
      },
      {
        "@type": "Question",
        "name": "How does the Stack Score work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Stack Score is a 0-100 composite of four 0-25 sub-dimensions: Synergy (do these supplements enhance each other?), Coverage (does the stack address your stated goals?), Balance (is there unnecessary mechanism overlap?), and Efficiency (is the stack lean and purposeful?). The score updates in real time as you add or remove supplements."
        }
      },
      {
        "@type": "Question",
        "name": "Are caffeine and L-theanine actually synergistic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes — there is randomized-controlled-trial evidence that combining L-theanine with caffeine improves attention and reaction time more than caffeine alone, while reducing the jittery side effects. The 1:2 caffeine-to-L-theanine ratio (e.g., 100 mg caffeine + 200 mg L-theanine) is the most-studied dosing.",
          "citation": [
            { "@type": "ScholarlyArticle", "url": "https://pubmed.ncbi.nlm.nih.gov/18681988/" },
            { "@type": "ScholarlyArticle", "url": "https://pubmed.ncbi.nlm.nih.gov/19571720/" }
          ]
        }
      },
      {
        "@type": "Question",
        "name": "Can I stack multiple racetams?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is generally redundant. Racetams act on overlapping cholinergic and glutamatergic pathways, so stacking two or more typically produces diminishing returns rather than additive benefit, and most users report better results pairing a single racetam with an adequate choline source (e.g., alpha-GPC or citicoline) than pairing racetams with each other."
        }
      },
      {
        "@type": "Question",
        "name": "Where does the interaction data come from?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Each of the 60+ pairwise interactions is mapped to peer-reviewed research, primarily indexed via PubMed. Tier 1 evidence is a systematic review or multiple RCTs; Tier 2 is a single high-quality RCT or strong cohort data; Tier 3 is mechanistic / preclinical only. Tier is shown on every supplement and warning."
        }
      },
      {
        "@type": "Question",
        "name": "Is this medical advice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. NootropicStacker is an educational tool. Statements have not been evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease. Consult a licensed healthcare professional before starting any supplement regimen, especially if you take prescription medication, are pregnant, or have a chronic condition."
        }
      }
    ]
  };
};

export function SEOOptimizer({
  page = 'home',
  supplement = null,
  article = null,
  customTitle = null,
  customDescription = null,
  ogImage = null,
}) {
  const seoData = SEO_DATA[page] || SEO_DATA.home;
  const { pathname } = useLocation();

  // Generate dynamic title and description for supplement and article pages
  let title = customTitle || seoData.title;
  let description = customDescription || seoData.description;
  // Derive canonical from current pathname so every route emits an explicit canonical
  let canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
  let ogType = 'website';

  if (supplement) {
    title = `${supplement.name} - Effects, Dosage & Safety | NootropicStacker`;
    description = `Complete guide to ${supplement.name}: ${supplement.description} Learn about effects, optimal dosage (${supplement.dosage.min}-${supplement.dosage.max} ${supplement.dosage.unit}), and safety considerations.`;
    canonical = `${SITE_URL}/supplements/${encodeURIComponent(supplement.id || supplement.name.toLowerCase().replace(/\s+/g, '-'))}`;
  }

  if (article) {
    title = article.title || title;
    description = article.description || description;
    canonical = article.url || canonical;
    ogType = 'article';
  }

  const finalOgImage = ogImage || DEFAULT_OG_IMAGE;

  useEffect(() => {
    // Track page views for SEO analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-FZEY2PKWFQ', {
        page_title: title,
        page_location: window.location.href
      });
    }
  }, [title]);

  const supplementSchemas = supplement ? generateSupplementStructuredData(supplement) : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* keywords meta dropped: zero SEO value since 2009 and listing
          prescription-class names (modafinil etc.) can trigger pharma-policy
          classifiers (Google Ads disapproval, conservative LLM filters). */}
      <link rel="canonical" href={canonical} />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:site" content="@nootropicstacker" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="NootropicStacker" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Vera Huang, NootropicStacker" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Structured Data — FAQ (home + /faq only). Gated on pathname,
          not the `page` prop, because many non-home routes pass
          page="home" to inherit the default meta and would otherwise
          inject duplicate FAQPage schemas across the site. */}
      {(pathname === '/' || pathname === '/faq') && (
        <script type="application/ld+json">
          {JSON.stringify(generateFAQStructuredData())}
        </script>
      )}

      {/* Structured Data — Supplement Product + MedicalWebPage */}
      {supplementSchemas && supplementSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />

      {/* DNS Prefetch for affiliate links */}
      <link rel="dns-prefetch" href="//amazon.com" />
      <link rel="dns-prefetch" href="//iherb.com" />
      <link rel="dns-prefetch" href="//nootropicsdepot.com" />
    </Helmet>
  );
}

// SEO-friendly visible content section for the homepage
export function SEOContent() {
  return (
    <section className="px-3 py-4 bg-surface-card border border-ink-200 rounded-md space-y-4">
      <div>
        <h2 className="text-base font-semibold text-ink-900 mb-2">The Nootropic Stack Builder for Biohackers</h2>
        <p className="text-ink-500 mb-2 text-sm leading-snug">
          NootropicStacker is a free tool for building, analyzing, and optimizing nootropic supplement stacks. Our database
          covers 195 supplements — including racetams, adaptogens, cholinergics, vitamins, and performance compounds — with
          detailed effect profiles, dosage ranges, and interaction data sourced from research literature and biohacking communities.
        </p>
        <p className="text-ink-500 mb-2 text-sm leading-snug">
          Unlike simple supplement databases, NootropicStacker evaluates how your chosen compounds work <em>together</em>.
          The Stack Score system rates your combination across four dimensions: Synergy (do these supplements enhance each other?),
          Coverage (does the stack address your goals?), Balance (is there unnecessary overlap?), and Efficiency (is the stack
          lean and purposeful?). Each dimension scores 0-25, combining into an overall 0-100 rating with a letter grade.
        </p>
        <p className="text-ink-500 text-sm leading-snug">
          Whether you're a first-time stacker looking for a focus and energy combo or an experienced biohacker fine-tuning a
          complex protocol, the tools here help you make informed decisions. Set your goals, add supplements, and let the
          scoring system show you where your stack is strong and where it can improve.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink-900 mb-1">195 Supplements with Effect Profiles</h3>
          <p className="text-xs text-ink-500 leading-snug">
            Explore racetams, modafinil alternatives, adaptogens like ashwagandha and rhodiola, and natural cognitive
            enhancers like Bacopa Monnieri, Lion's Mane, and Alpha-GPC. Each supplement includes effect ratings across
            seven categories, dosage recommendations, interaction warnings, and mechanism of action.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink-900 mb-1">Stack Score &amp; Interaction Analysis</h3>
          <p className="text-xs text-ink-500 leading-snug">
            Our Stack Score system analyzes 60+ pairwise supplement interactions and detects mechanism overlap across
            9 categories — stimulants, GABAergics, cholinergics, adaptogens, racetams, and more. Get real-time feedback
            as you build, with specific optimization tips to improve your stack's effectiveness.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink-900 mb-1">Personalized Recommendations</h3>
          <p className="text-xs text-ink-500 leading-snug">
            Take the 5-question Stack Quiz for a personalized starting point, or set your goals directly in the Stack Builder.
            The recommendation engine suggests supplements that fill gaps in your stack while avoiding redundancy and diminishing
            returns. Compare supplements side-by-side to choose between similar options.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink-900 mb-1">Built for Biohackers Who Want Signal, Not Noise</h3>
        <p className="text-xs text-ink-500 leading-snug">
          NootropicStacker takes an optimization-first approach. The Stack Score acts like an audio mixer — telling you when
          your bass is too heavy or your coverage is thin — rather than a medical tool that warns you away from every decision.
          We track synergistic pairs (caffeine + L-theanine, racetams + choline sources, curcumin + piperine), flag redundant
          combinations (two choline sources, multiple racetams), and identify conflicting compounds (stimulants + sleep aids).
          The goal is to help you build smarter stacks, not to gatekeep supplement choices.
        </p>
      </div>
    </section>
  );
}

// Keywords for content optimization
export const TARGET_KEYWORDS = {
  primary: [
    'nootropic stacker',
    'nootropics',
    'biohacking supplements',
    'racetams',
    'modafinil',
    'cognitive enhancement'
  ],
  secondary: [
    'supplement interactions',
    'nootropic stack',
    'biohacker tools',
    'smart drugs',
    'supplement safety',
    'cognitive enhancers',
    'memory supplements',
    'focus supplements'
  ],
  longTail: [
    'best nootropic stack for focus',
    'modafinil vs armodafinil comparison',
    'racetam supplement guide',
    'supplement interaction checker',
    'biohacking supplement recommendations',
    'nootropic dosage calculator'
  ]
};

