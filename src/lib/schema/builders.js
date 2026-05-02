const SITE_URL = 'https://nootropicstacker.com';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NootropicStacker',
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    description:
      'The PCPartPicker for nootropics. Discover, compare, and build supplement stacks with evidence-based scoring.',
    sameAs: [
      'https://twitter.com/nootropicstacker',
      'https://facebook.com/nootropicstacker',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@nootropicstacker.com',
      contactType: 'customer support',
    },
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NootropicStacker',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/supplements?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildProductSchema(supplement) {
  if (!supplement) return null;

  const offers = [];
  if (supplement.affiliateAmazon) {
    offers.push({
      '@type': 'Offer',
      url: supplement.affiliateAmazon,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Amazon' },
    });
  }
  if (supplement.affiliateIherb) {
    offers.push({
      '@type': 'Offer',
      url: supplement.affiliateIherb,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'iHerb' },
    });
  }
  if (supplement.affiliateNootropicsDepot) {
    offers.push({
      '@type': 'Offer',
      url: supplement.affiliateNootropicsDepot,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Nootropics Depot' },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    additionalType: 'https://schema.org/DietarySupplement',
    name: supplement.name,
    description: supplement.summary || supplement.description,
    url: `${SITE_URL}/supplements/${supplement.slug || supplement.id}`,
    category: supplement.category,
    ...(offers.length > 0 ? { offers } : {}),
  };
}

export function buildItemListSchema({ name, items } = {}) {
  if (!items?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: item.url,
      name: item.name,
    })),
  };
}

export function buildArticleSchema(article) {
  if (!article) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description || article.excerpt,
    image: article.image || `${SITE_URL}/og-image.png`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: article.author
      ? { '@type': 'Person', name: article.author, url: article.authorUrl }
      : { '@type': 'Organization', name: 'NootropicStacker' },
    publisher: {
      '@type': 'Organization',
      name: 'NootropicStacker',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${article.slug}`,
    },
    ...(article.citations?.length ? { citation: article.citations } : {}),
  };
}

export function buildFAQSchema(faqs) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(crumbs) {
  if (!crumbs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: c.url,
    })),
  };
}
