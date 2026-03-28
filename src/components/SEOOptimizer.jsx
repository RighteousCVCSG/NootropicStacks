import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// SEO data for different pages and supplements
const SEO_DATA = {
  home: {
    title: 'Nootropic Stacker - Smart Biohacker Stack Builder | Nootropics & Supplements',
    description: 'Build optimal supplement stacks with AI-powered recommendations. Track 70+ nootropics, adaptogens, and biohacking supplements. Safety monitoring and interaction warnings included.',
    keywords: 'nootropic stacker, nootropics, biohacking, supplement stack, racetams, modafinil, cognitive enhancement, smart drugs, supplement interactions, biohacker tools',
    canonical: 'https://nootropicstacker.com'
  },
  nootropics: {
    title: 'Best Nootropics Guide 2026 - Racetams, Modafinil & Cognitive Enhancers',
    description: 'Complete guide to the most effective nootropics including racetams, modafinil, armodafinil, and natural cognitive enhancers. Dosage, effects, and safety information.',
    keywords: 'nootropics, racetams, modafinil, armodafinil, piracetam, phenylpiracetam, cognitive enhancement, smart drugs, memory enhancement',
    canonical: 'https://nootropicstacker.com/nootropics'
  },
  supplements: {
    title: 'Supplement Database - 70+ Biohacking Supplements with Effects & Dosages',
    description: 'Comprehensive database of biohacking supplements including nootropics, adaptogens, vitamins, and performance enhancers. Complete with dosage recommendations and safety warnings.',
    keywords: 'supplement database, biohacking supplements, supplement effects, dosage guide, supplement interactions, health supplements',
    canonical: 'https://nootropicstacker.com/supplements'
  }
};

// Generate structured data for supplements
const generateSupplementStructuredData = (supplement) => {
  return {
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "100"
    },
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

// Generate organization structured data
const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nootropic Stacker",
    "url": "https://nootropicstacker.com",
    "logo": "https://nootropicstacker.com/logo.png",
    "description": "AI-powered supplement stack builder for biohackers and health enthusiasts",
    "sameAs": [
      "https://twitter.com/nootropicstacker",
      "https://facebook.com/nootropicstacker"
    ]
  };
};

export function SEOOptimizer({ page = 'home', supplement = null, customTitle = null, customDescription = null }) {
  const seoData = SEO_DATA[page] || SEO_DATA.home;
  
  // Generate dynamic title and description for supplement pages
  let title = customTitle || seoData.title;
  let description = customDescription || seoData.description;
  
  if (supplement) {
    title = `${supplement.name} - Effects, Dosage & Safety | Nootropic Stacker`;
    description = `Complete guide to ${supplement.name}: ${supplement.description} Learn about effects, optimal dosage (${supplement.dosage.min}-${supplement.dosage.max} ${supplement.dosage.unit}), and safety considerations.`;
  }

  useEffect(() => {
    // Track page views for SEO analytics
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-FZEY2PKWFQ', {
        page_title: title,
        page_location: window.location.href
      });
    }
  }, [title]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={seoData.keywords} />
      <link rel="canonical" href={seoData.canonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoData.canonical} />
      <meta property="og:image" content="https://nootropicstacker.com/og-image.jpg" />
      <meta property="og:site_name" content="Nootropic Stacker" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://nootropicstacker.com/twitter-image.jpg" />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Nootropic Stacker Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateOrganizationStructuredData())}
      </script>
      
      {page === 'home' && (
        <script type="application/ld+json">
          {JSON.stringify(generateFAQStructuredData())}
        </script>
      )}
      
      {supplement && (
        <script type="application/ld+json">
          {JSON.stringify(generateSupplementStructuredData(supplement))}
        </script>
      )}
      
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
    <section className="mt-12 px-4 py-8 bg-muted/30 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">About NootropicStacker</h2>
      <p className="text-muted-foreground mb-6">
        NootropicStacker is the most comprehensive nootropic stack builder for biohackers and cognitive optimizers.
        Build optimal supplement stacks from our database of 70+ nootropics, adaptogens, and performance supplements
        with real-time safety monitoring and interaction warnings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Nootropics &amp; Cognitive Enhancers</h3>
          <p className="text-sm text-muted-foreground">
            Explore racetams, modafinil alternatives, and natural cognitive enhancers like Bacopa Monnieri,
            Lion's Mane, and Alpha-GPC with detailed dosage and safety information.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Smart Stack Building</h3>
          <p className="text-sm text-muted-foreground">
            Our stack builder calculates synergistic effects, warns about dangerous interactions,
            and recommends supplements based on your goals — energy, focus, mood, or creativity.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Safety First</h3>
          <p className="text-sm text-muted-foreground">
            Every stack is analyzed for potential interactions, overdose risks, and contraindications.
            We track over 70 supplements to help you stack safely and effectively.
          </p>
        </div>
      </div>
    </section>
  );
}

// Generate sitemap data
export const generateSitemapData = () => {
  const baseUrl = 'https://nootropicstacker.com';
  const pages = [
    { url: baseUrl, priority: 1.0, changefreq: 'daily' },
    { url: `${baseUrl}/nootropics`, priority: 0.9, changefreq: 'weekly' },
    { url: `${baseUrl}/supplements`, priority: 0.9, changefreq: 'weekly' },
    { url: `${baseUrl}/stacks`, priority: 0.8, changefreq: 'weekly' },
    { url: `${baseUrl}/safety`, priority: 0.7, changefreq: 'monthly' },
    { url: `${baseUrl}/about`, priority: 0.5, changefreq: 'monthly' }
  ];
  
  return pages;
};

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

