import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Calendar, Clock, ArrowLeft, BookOpen, Share2 } from 'lucide-react';
import { getArticleBySlug, getRecentArticles } from '../data/blogArticles.js';
import { SEOOptimizer } from './SEOOptimizer.jsx';

function ArticleContent({ sections }) {
  return (
    <div className="prose prose-gray max-w-none">
      {sections.map((section, i) => (
        <div key={i} className="mb-8">
          {section.heading && (
            <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
          )}
          {section.paragraphs.map((p, j) => (
            <p key={j} className="text-gray-700 leading-relaxed mb-4">{p}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

export function BlogArticlePage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const recentArticles = getRecentArticles(4).filter(a => a.slug !== slug).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
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
          <ArticleContent sections={article.sections} />

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
