import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Calendar, Clock, ArrowLeft, BookOpen, Share2, ShoppingCart, ExternalLink, Beaker } from 'lucide-react';
import { getRecentArticlesMeta } from '../data/blogArticlesIndex.js';
import { SEOOptimizer, generateArticleStructuredData } from './SEOOptimizer.jsx';
import { AFFILIATE_LINKS } from './MonetizationManager.jsx';

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

function ArticleContent({ sections, showNewsletter = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, source: 'blog_inline' })
      });
      setStatus('success');
    } catch { setStatus('error'); }
  };

  return (
    <div className="prose prose-gray max-w-none">
      {sections.map((section, i) => (
        <React.Fragment key={i}>
          <div className="mb-8">
            {section.heading && <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>}
            {section.paragraphs.map((p, j) => (
              <p key={j} className="text-gray-700 leading-relaxed mb-4">{p}</p>
            ))}
          </div>
          {showNewsletter && i === 3 && status !== 'success' && (
            <div className="my-8 p-5 bg-indigo-50 border border-indigo-200 rounded-xl not-prose">
              <p className="font-semibold text-indigo-900 mb-1">📬 Get the NootropicStacker Weekly</p>
              <p className="text-sm text-indigo-700 mb-3">New stack guides, research summaries, and supplement deals — free.</p>
              {status === 'success' ? (
                <p className="text-green-700 font-medium text-sm">✓ You're in!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="submit" disabled={status === 'loading'}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                    {status === 'loading' ? '...' : 'Subscribe'}
                  </button>
                </form>
              )}
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

  const articleSchema = generateArticleStructuredData({
    title: article.title,
    description: article.excerpt || article.description || '',
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    url: `https://nootropicstacker.com/blog/${article.slug}`
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        "name": "Blog",
        "item": "https://nootropicstacker.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://nootropicstacker.com/blog/${article.slug}`
      }
    ]
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SEOOptimizer
        page="home"
        customTitle={`${article.title} | NootropicStacker Blog`}
        customDescription={article.excerpt}
      />

      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article header */}
        <article>
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {article.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime} min read
              </span>
              <button onClick={handleShare} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Article body */}
          <ArticleContent sections={article.sections} showNewsletter={true} />

          {/* Bottom line */}
          {article.bottomLine && (
            <Card className="bg-blue-50 border-blue-200 mt-8">
              <CardContent className="pt-6">
                <h3 className="font-bold text-blue-900 mb-2">The Bottom Line</h3>
                <p className="text-blue-800">{article.bottomLine}</p>
              </CardContent>
            </Card>
          )}
        </article>

        {articleSupplements.length > 0 && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-bold text-green-900 mb-1 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shop Supplements in This Article
            </h3>
            <p className="text-sm text-green-700 mb-4">Quality-verified sources for the supplements discussed above.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {articleSupplements.map(id => {
                const links = AFFILIATE_LINKS[id];
                if (!links) return null;
                const name = id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                return (
                  <div key={id} className="bg-white rounded-lg p-3 border border-green-100">
                    <p className="font-medium text-gray-800 text-sm mb-2">{name}</p>
                    <div className="flex gap-2">
                      {links.amazon && (
                        <a href={links.amazon} target="_blank" rel="noopener noreferrer sponsored"
                           onClick={() => fetch('/api/track/click', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ supplementId: id, vendor: 'amazon', page: 'blog' }) })}
                           className="flex items-center gap-1 text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded font-medium transition-colors">
                          <ExternalLink className="w-3 h-3" /> Amazon
                        </a>
                      )}
                      {links.iherb && (
                        <a href={links.iherb} target="_blank" rel="noopener noreferrer sponsored"
                           onClick={() => fetch('/api/track/click', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ supplementId: id, vendor: 'iherb', page: 'blog' }) })}
                           className="flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded font-medium transition-colors">
                          <ExternalLink className="w-3 h-3" /> iHerb
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-green-600 mt-3">* Affiliate links — we earn a small commission at no extra cost to you.</p>
          </div>
        )}

        <div className="mt-6 p-6 bg-blue-600 rounded-xl text-white text-center">
          <Beaker className="w-8 h-8 mx-auto mb-2 opacity-90" />
          <h3 className="text-xl font-bold mb-2">Build Your Personalized Stack</h3>
          <p className="text-blue-100 text-sm mb-4">Use our free Stack Builder to combine these supplements, check interactions, and get a Stack Score rating.</p>
          <Link to="/" className="inline-block bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
            Open Stack Builder →
          </Link>
        </div>

        <Separator className="my-8" />

        {/* Related articles */}
        {recentArticles.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              More Articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentArticles.map(a => (
                <Link key={a.slug} to={`/blog/${a.slug}`}>
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="pt-4">
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(a.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm font-medium text-gray-900 hover:text-blue-600">{a.title}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
