import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://nootropicstacker.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

// SEO data for different pages and supplements
const SEO_DATA = {
  home: {
    title: 'NootropicStacker — Build Your Perfect Nootropic Stack Builder',
    description: 'Build nootropic supplement stacks with 195 compounds. Stack Score rates synergy, coverage, and balance. Free quiz and interaction warnings.',
    keywords: 'nootropic stacker, nootropics, biohacking, supplement stack, racetams, modafinil, cognitive enhancement, smart drugs, supplement interactions, biohacker tools, stack score',
    canonical: 'https://nootropicstacker.com'
  },
  nootropics: {
    title: 'Best Nootropics Guide 2026 - Racetams, Modafinil & Cognitive Enhancers',
    description: 'Complete guide to the most effective nootropics including racetams, modafinil, armodafinil, and natural cognitive enhancers. Dosage, effects, and safety information.',
    keywords: 'nootropics, racetams, modafinil, armodafinil, piracetam, phenylpiracetam, cognitive enhancement, smart drugs, memory enhancement',
    canonical: 'https://nootropicstacker.com/nootropics'
  },
  supplements: {
    title: 'Supplement Database — 195 Biohacking Supplements with Effects & Dosages',
    description: 'Comprehensive database of 195 biohacking supplements including nootropics, adaptogens, vitamins, and performance enhancers. Complete with dosage recommendations and safety warnings.',
    keywords: 'supplement database, biohacking supplements, supplement effects, dosage guide, supplement interactions, health supplements',
    canonical: 'https://nootropicstacker.com/supplements'
  }
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

// Generate FAQ structured data
const generateFAQStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a supplement stack?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A supplement stack is a combination of different supplements taken together to achieve specific health or performance goals. Stacking allows for synergistic effects between supplements while minimizing potential negative interactions."
        }
      },
      {
        "@type": "Question",
        "name": "Are nootropics safe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most nootropics are generally safe when used as directed, but safety varies by compound. Always consult with a healthcare professional before starting any new supplement regimen, especially if you have medical conditions or take medications."
        }
      },
      {
        "@type": "Question",
        "name": "How do I choose the right supplements for my goals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Start by identifying your specific goals (energy, focus, mood, etc.), research supplements that target those areas, consider potential interactions, and start with lower doses to assess tolerance. Our NootropicStacker tool can help guide these decisions."
        }
      },
      {
        "@type": "Question",
        "name": "What are racetams?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Racetams are a family of nootropic compounds that share a similar chemical structure. They include piracetam, oxiracetam, aniracetam, and phenylpiracetam, each with unique cognitive enhancement properties."
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
      <meta property="og:site_name" content="NootropicStacker" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="NootropicStacker Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Structured Data — FAQ (home page only) */}
      {page === 'home' && (
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
    <section className="mt-12 px-4 py-8 bg-surface-card border border-ink-200 rounded-lg space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">The Nootropic Stack Builder for Biohackers</h2>
        <p className="text-ink-500 mb-4">
          NootropicStacker is a free tool for building, analyzing, and optimizing nootropic supplement stacks. Our database
          covers 195 supplements — including racetams, adaptogens, cholinergics, vitamins, and performance compounds — with
          detailed effect profiles, dosage ranges, and interaction data sourced from research literature and biohacking communities.
        </p>
        <p className="text-ink-500 mb-4">
          Unlike simple supplement databases, NootropicStacker evaluates how your chosen compounds work <em>together</em>.
          The Stack Score system rates your combination across four dimensions: Synergy (do these supplements enhance each other?),
          Coverage (does the stack address your goals?), Balance (is there unnecessary overlap?), and Efficiency (is the stack
          lean and purposeful?). Each dimension scores 0-25, combining into an overall 0-100 rating with a letter grade.
        </p>
        <p className="text-ink-500">
          Whether you're a first-time stacker looking for a focus and energy combo or an experienced biohacker fine-tuning a
          complex protocol, the tools here help you make informed decisions. Set your goals, add supplements, and let the
          scoring system show you where your stack is strong and where it can improve.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-2">195 Supplements with Effect Profiles</h3>
          <p className="text-sm text-ink-500">
            Explore racetams, modafinil alternatives, adaptogens like ashwagandha and rhodiola, and natural cognitive
            enhancers like Bacopa Monnieri, Lion's Mane, and Alpha-GPC. Each supplement includes effect ratings across
            seven categories, dosage recommendations, interaction warnings, and mechanism of action.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Stack Score &amp; Interaction Analysis</h3>
          <p className="text-sm text-ink-500">
            Our Stack Score system analyzes 60+ pairwise supplement interactions and detects mechanism overlap across
            9 categories — stimulants, GABAergics, cholinergics, adaptogens, racetams, and more. Get real-time feedback
            as you build, with specific optimization tips to improve your stack's effectiveness.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Personalized Recommendations</h3>
          <p className="text-sm text-ink-500">
            Take the 6-question Stack Quiz for a personalized starting point, or set your goals directly in the Stack Builder.
            The recommendation engine suggests supplements that fill gaps in your stack while avoiding redundancy and diminishing
            returns. Compare supplements side-by-side to choose between similar options.
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Built for Biohackers Who Want Signal, Not Noise</h3>
        <p className="text-sm text-ink-500">
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

