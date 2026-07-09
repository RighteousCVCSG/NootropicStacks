import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Calendar, Clock, Search, ArrowRight, BookOpen, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { blogArticlesIndex as blogArticles, getRecentArticlesMeta } from '../data/blogArticlesIndex.js';

const ARTICLES_PER_PAGE = 12;
const VISIBLE_TAG_COUNT = 12;
const EXCERPT_MAX_LENGTH = 140;

// readTime is stored inconsistently in the data — sometimes a bare number (7),
// sometimes an already-suffixed string ("11 min read"). Normalize here so the
// label renders exactly once regardless of which shape came through.
function formatReadTime(readTime) {
  if (readTime === null || readTime === undefined || readTime === '') return null;
  const text = String(readTime);
  return /min read/i.test(text) ? text : `${text} min read`;
}

function getExcerpt(article) {
  const source = article.excerpt || article.bottomLine || '';
  if (!source) return '';
  if (source.length <= EXCERPT_MAX_LENGTH) return source;
  return `${source.slice(0, EXCERPT_MAX_LENGTH).trimEnd()}…`;
}

function ArticleCard({ article }) {
  const readTimeLabel = formatReadTime(article.readTime);
  const excerpt = getExcerpt(article);

  return (
    <Card className="hover:shadow-1 transition-shadow flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-ink-500 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {readTimeLabel && (
            <>
              <span className="mx-1">&middot;</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{readTimeLabel}</span>
            </>
          )}
        </div>
        <Link to={`/blog/${article.slug}`}>
          <CardTitle className="text-lg hover:text-primary-700 transition-colors cursor-pointer line-clamp-2">
            {article.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <p className="text-ink-700 text-sm mb-4 line-clamp-3 flex-1">{excerpt}</p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Link to={`/blog/${article.slug}`}>
            <Button variant="ghost" size="sm" className="text-primary-700">
              Read more <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function BlogSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAllTags, setShowAllTags] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);
  const articles = getRecentArticlesMeta(200);

  const categories = ['All', ...new Set(articles.map(a => a.category).filter(Boolean))];

  const filtered = (selectedCategory !== 'All'
    ? articles.filter(a => a.category === selectedCategory)
    : articles
  ).filter(a => searchQuery
    ? a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    : true
  );

  // Reset pagination whenever the active filter/search changes so users don't
  // land on a truncated result set from a previous query.
  const filterKey = `${selectedCategory}|${searchQuery}`;
  const prevFilterKey = React.useRef(filterKey);
  if (prevFilterKey.current !== filterKey) {
    prevFilterKey.current = filterKey;
    setVisibleCount(ARTICLES_PER_PAGE);
  }

  // Tags ranked by usage frequency, most-used first
  const rankedTags = useMemo(() => {
    const counts = new Map();
    for (const a of articles) {
      for (const tag of a.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
  }, [articles]);

  const visibleTags = showAllTags ? rankedTags : rankedTags.slice(0, VISIBLE_TAG_COUNT);
  const visibleArticles = filtered.slice(0, visibleCount);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            NootropicStacker Blog
          </h2>
          <p className="text-ink-700 mt-1">Research breakdowns, stack guides, and what's actually happening in nootropics.</p>
          <p className="text-sm text-ink-400 mt-1">{articles.length} articles</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-400" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category filters */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-700 text-white'
                  : 'bg-surface-sunk text-ink-700 hover:bg-ink-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Tags */}
      {rankedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-ink-400 mt-0.5" />
          {visibleTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="text-xs px-2.5 py-1 rounded-full bg-surface-sunk text-ink-700 hover:bg-primary-100 hover:text-primary-800 transition-colors"
            >
              {tag}
            </button>
          ))}
          {rankedTags.length > VISIBLE_TAG_COUNT && (
            <button
              onClick={() => setShowAllTags(v => !v)}
              className="text-xs px-2.5 py-1 rounded-full font-medium text-primary-700 hover:text-primary-800 inline-flex items-center gap-1"
            >
              {showAllTags ? (
                <>Show fewer tags <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>Browse all tags ({rankedTags.length}) <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          )}
        </div>
      )}

      {/* Article list */}
      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleArticles.map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
          {visibleCount < filtered.length && (
            <div className="flex flex-col items-center gap-2 pt-2">
              <p className="text-sm text-ink-400">Showing {visibleArticles.length} of {filtered.length} articles</p>
              <Button
                variant="outline"
                onClick={() => setVisibleCount(c => c + ARTICLES_PER_PAGE)}
              >
                Load more articles
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="p-4 text-center">
          <p className="text-ink-500">
            {articles.length === 0
              ? 'Articles coming soon. Check back shortly.'
              : 'No articles match your search.'}
          </p>
        </Card>
      )}
    </div>
  );
}
