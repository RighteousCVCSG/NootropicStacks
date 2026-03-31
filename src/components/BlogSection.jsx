import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Calendar, Clock, Search, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { getRecentArticles } from '../data/blogArticles.js';

function ArticleCard({ article }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="mx-1">&middot;</span>
          <Clock className="w-3.5 h-3.5" />
          <span>{article.readTime} min read</span>
        </div>
        <Link to={`/blog/${article.slug}`}>
          <CardTitle className="text-lg hover:text-blue-600 transition-colors cursor-pointer">
            {article.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Link to={`/blog/${article.slug}`}>
            <Button variant="ghost" size="sm" className="text-blue-600">
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
  const articles = getRecentArticles(20);

  const filtered = searchQuery
    ? articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : articles;

  // Collect all unique tags
  const allTags = [...new Set(articles.flatMap(a => a.tags))].sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            NootropicStacker Blog
          </h2>
          <p className="text-gray-600 mt-1">Research breakdowns, stack guides, and what's actually happening in nootropics.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Article list */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            {articles.length === 0
              ? 'Articles coming soon. Check back shortly.'
              : 'No articles match your search.'}
          </p>
        </Card>
      )}
    </div>
  );
}
