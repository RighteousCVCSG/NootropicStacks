import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Calendar, Clock, ArrowLeft, BookOpen, Share2, ShoppingCart, ExternalLink, Beaker } from 'lucide-react';
import { getRecentArticlesMeta } from '../data/blogArticlesIndex.js';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { JsonLd } from './JsonLd.jsx';
import { buildArticleSchema, buildBreadcrumbSchema } from '../lib/schema/builders.js';
import { withAffiliateUtms } from '@/lib/affiliate.js';
import { EmailCaptureForm } from './EmailCaptureForm.jsx';
import { ExitIntentPopup } from './ExitIntentPopup.jsx';

const TAG_TO_SUPPLEMENT = {
  'lions-mane': 'lions-mane-mushroom',
  'bacopa': 'bacopa-monnieri',
  'ashwagandha': 'ashwagandha',
  'rhodiola': 'rhodiola-rosea',
  'l-theanine': 'l-theanine',
  'theanine': 'l-theanine',
  'alpha-gpc': 'alpha-gpc',
  'phosphatidylserine': 'phosphatidylserine',
  'omega-3': 'omega-3-dha',
  'dha': 'omega-3-dha',
  'magnesium': 'magnesium-glycinate',
  'creatine': 'creatine',
  'caffeine': 'caffeine',
  'melatonin': 'melatonin',
  'vitamin-d': 'vitamin-d3',
  'ginkgo': 'ginkgo-biloba',
  'ginseng': 'panax-ginseng',
  'noopept': 'noopept',
  'piracetam': 'piracetam',
  'nmn': 'nmn',
  'coq10': 'coq10',
  'huperzine': 'huperzine-a',
};

function ArticleContent({ sections, showNewsletter = false, articleSlug }) {
  return (
    <div className="prose prose-gray max-w-none">
      {sections.map((section, i) => (
        <React.Fragment key={i}>
          <div className="mb-4">
            {section.heading && <h2 className="text-xl font-semibold text-ink-900 mb-3">{section.heading}</h2>}
            {section.paragraphs.map((p, j) => (
              <p key={j} className="text-ink-700 leading-relaxed mb-4">{p}</p>
            ))}
          </div>
          {showNewsletter && i === 3 && (
            <div className="not-prose my-8">
              <EmailCaptureForm source="blog_inline" variant="inline_article" articleSlug={articleSlug} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function BlogArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setArticle(null);
    setNotFound(false);
    fetch(`/articles/${slug}.json`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(setArticle)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <Navigate to="/blog" replace />;
  if (!article) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const recentArticles = getRecentArticlesMeta(4).filter(a => a.slug !== slug).slice(0, 3);

  const articleSchema = buildArticleSchema({
    title: article.title,
    description: article.excerpt || article.description || '',
    image: article.heroImage || article.image,
    datePublished: article.publishedDate,
    dateModified: article.dateModified || article.publishedDate,
    author: article.author,
    authorUrl: article.authorUrl,
    slug: article.slug,
    citations: article.pubmedCitations || article.citations,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://nootropicstacker.com' },
    { name: 'Blog', url: 'https://nootropicstacker.com/blog' },
    { name: article.title, url: `https://nootropicstacker.com/blog/${article.slug}` },
  ]);

  const articleSupplements = [...new Set(
    (article.tags || [])
      .map(tag => TAG_TO_SUPPLEMENT[tag.toLowerCase()])
      .filter(Boolean)
      .filter(id => AFFILIATE_LINKS[id])
  )].slice(0, 6);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <SEOOptimizer
        page="home"
        customTitle={`${article.title} | NootropicStacker Blog`}
        customDescription={article.excerpt}
      />

      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-3">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article header */}
        <article>
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-3xl font-semibold text-ink-900 mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-ink-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime} min read
              </span>
              <button onClick={handleShare} className="flex items-center gap-1 hover:text-primary-700 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          <Separator className="mb-4" />

          {/* Article body */}
          <ArticleContent sections={article.sections} showNewsletter={true} articleSlug={slug} />

          {/* Bottom line */}
          {article.bottomLine && (
            <Card className="bg-primary-050 border-primary-300 mt-8">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-primary-900 mb-2">The Bottom Line</h3>
                <p className="text-primary-800">{article.bottomLine}</p>
              </CardContent>
            </Card>
          )}
        </article>

        {articleSupplements.length > 0 && (
          <div className="mt-8 p-3 bg-accent-050 border border-accent-300 rounded-md">
            <h3 className="font-semibold text-accent-700 mb-1 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shop Supplements in This Article
            </h3>
            <p className="text-sm text-accent-700 mb-4">Quality-verified sources for the supplements discussed above.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {articleSupplements.map(id => {
                const links = AFFILIATE_LINKS[id];
                if (!links) return null;
                const name = id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                return (
                  <div key={id} className="bg-white rounded-md p-3 border border-green-100">
                    <p className="font-medium text-ink-900 text-sm mb-2">{name}</p>
                    <div className="flex gap-2">
                      {links.amazon && (
                        <a href={withAffiliateUtms(links.amazon, { campaign: `blog-${slug}` })} target="_blank" rel="noopener noreferrer sponsored"
                           onClick={() => fetch('/api/track/click', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ supplementId: id, vendor: 'amazon', page: 'blog' }) })}
                           className="flex items-center gap-1 text-xs bg-warn-1000 hover:bg-warn-700 text-white px-3 py-1.5 rounded font-medium transition-colors">
                          <ExternalLink className="w-3 h-3" /> Amazon
                        </a>
                      )}
                      {links.iherb && (
                        <a href={links.iherb} target="_blank" rel="noopener noreferrer sponsored"
                           onClick={() => fetch('/api/track/click', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ supplementId: id, vendor: 'iherb', page: 'blog' }) })}
                           className="flex items-center gap-1 text-xs bg-accent-600 hover:bg-accent-700 text-white px-3 py-1.5 rounded font-medium transition-colors">
                          <ExternalLink className="w-3 h-3" /> iHerb
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-accent-700 mt-3">* Affiliate links — we earn a small commission at no extra cost to you.</p>
          </div>
        )}

        <div className="mt-6 p-3 bg-primary-700 rounded-md text-white text-center">
          <Beaker className="w-8 h-8 mx-auto mb-2 opacity-90" />
          <h3 className="text-xl font-semibold mb-2">Build Your Personalized Stack</h3>
          <p className="text-blue-100 text-sm mb-4">Use our free Stack Builder to combine these supplements, check interactions, and get a Stack Score rating.</p>
          <Link to="/" className="inline-block bg-white text-primary-800 font-semibold px-6 py-2.5 rounded-md hover:bg-primary-050 transition-colors">
            Open Stack Builder →
          </Link>
        </div>

        <Separator className="my-8" />

        {/* Related articles */}
        {recentArticles.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-ink-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              More Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentArticles.map(a => (
                <Link key={a.slug} to={`/blog/${a.slug}`}>
                  <Card className="hover:shadow-1 transition-shadow h-full">
                    <CardContent className="pt-4">
                      <p className="text-xs text-ink-500 mb-1">
                        {new Date(a.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm font-medium text-ink-900 hover:text-primary-700">{a.title}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
        <ExitIntentPopup articleSlug={slug} />
      </div>
    </>
  );
}
