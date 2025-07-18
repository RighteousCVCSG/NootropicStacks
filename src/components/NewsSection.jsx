import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Input } from '@/components/ui/input.jsx';
import { 
  Calendar, 
  ExternalLink, 
  Search, 
  TrendingUp, 
  Clock,
  Archive,
  Newspaper,
  Filter,
  RefreshCw
} from 'lucide-react';

// Mock news data based on recent search results
const recentNews = [
  {
    id: 1,
    title: "Nootropics Depot Unveils Eurycomax, an Optimized Tongkat Ali Stack",
    summary: "Leading supplement company introduces new nootropic stack combining tongkat ali, mucuna pruriens, and horny goat weed for cognitive enhancement.",
    source: "CBS42",
    date: "2025-07-16",
    category: "Product Launch",
    url: "https://www.cbs42.com/business/press-releases/cision/20250716LA31227/nootropics-depot-unveils-eurycomax-an-optimized-tongkat-ali-stack",
    trending: true
  },
  {
    id: 2,
    title: "Brain Gains: Creatine's Surprising Cognitive Benefits",
    summary: "New research reveals focused ultrasound could turn muscle supplement creatine into brain-saving therapy by bypassing the blood-brain barrier.",
    source: "SciTechDaily",
    date: "2025-07-15",
    category: "Research",
    url: "https://scitechdaily.com/brain-gains-creatines-surprising-cognitive-benefits/",
    trending: true
  },
  {
    id: 3,
    title: "Enhancing Energy and Attention with Fully Water-Soluble Nootropic",
    summary: "Latest nootropic innovation shows reduced mental fatigue, improved attention, enhanced cognitive flexibility and increased mental energy.",
    source: "Nutraceutical Business Review",
    date: "2025-07-17",
    category: "Innovation",
    url: "https://nutraceuticalbusinessreview.com/enhancing-energy-and-attention-with-a-fully-water",
    trending: true
  },
  {
    id: 4,
    title: "Influencer-Founded Neutonic Scores $3.7M To Scale Productivity Drink",
    summary: "Nootropic drink startup reaches $20M valuation just 18 months after launching, highlighting growing market demand.",
    source: "AthletechNews",
    date: "2025-07-08",
    category: "Business",
    url: "https://athletechnews.com/neutonic-scores-3-7m-to-scale-productivity-drink/",
    trending: false
  },
  {
    id: 5,
    title: "Vitaquest Names Plant-based Proteins, Nootropics Among Top 2026 Trends",
    summary: "Industry leader identifies nootropics including Rhodiola rosea, Bacopa monnieri, and Lion's Mane as key supplement trends for 2026.",
    source: "Morningstar",
    date: "2025-07-10",
    category: "Industry Trends",
    url: "https://www.morningstar.com/news/globe-newswire/9491789/vitaquest-names-plant-based-proteins-nootropics-among-top-2026-supplement-trends",
    trending: false
  },
  {
    id: 6,
    title: "Enhanced Cognitive Performance in Older Adults Through Combined Training",
    summary: "Study evaluates combined effects of cognitive training and transcranial direct current stimulation on cognitive performance in older adults.",
    source: "Nature",
    date: "2025-07-06",
    category: "Research",
    url: "https://www.nature.com/articles/s41598-025-08322-6",
    trending: false
  },
  {
    id: 7,
    title: "Adults Grow New Brain Cells - Linked to Reduced Cognitive Decline",
    summary: "New research finds that new neurons in the adult brain are linked to reduced cognitive decline, particularly in verbal learning.",
    source: "ASBMB",
    date: "2025-07-15",
    category: "Research",
    url: "https://www.asbmb.org/asbmb-today/science/011125/adults-grow-new-brain-cells",
    trending: false
  },
  {
    id: 8,
    title: "Modafinil Reviews: Insights From Recent Conferences On Cognitive Enhancers",
    summary: "Studies indicate modafinil can enhance attention, executive function, and working memory in both patients and healthy adults.",
    source: "Lanier Dental",
    date: "2025-07-09",
    category: "Research",
    url: "https://www.lanierdental.com/modafinil-reviews-insights-from-recent-conferences-on-cognitive-enhancers/",
    trending: false
  }
];

// Archived news (older than 4 weeks)
const archivedNews = [
  {
    id: 101,
    title: "FDA Announces New Guidelines for Nootropic Supplement Labeling",
    summary: "Regulatory update requires clearer disclosure of cognitive enhancement claims and potential side effects.",
    source: "FDA News",
    date: "2025-06-15",
    category: "Regulation",
    url: "#",
    trending: false
  },
  {
    id: 102,
    title: "Lion's Mane Mushroom Shows Promise in Alzheimer's Prevention Study",
    summary: "12-month clinical trial demonstrates significant cognitive improvements in early-stage dementia patients.",
    source: "Journal of Neurochemistry",
    date: "2025-06-08",
    category: "Research",
    url: "#",
    trending: false
  },
  {
    id: 103,
    title: "Racetam Family Compounds Under Review by European Medicines Agency",
    summary: "EMA initiates comprehensive safety review of piracetam, oxiracetam, and related nootropic compounds.",
    source: "EMA Press Release",
    date: "2025-05-22",
    category: "Regulation",
    url: "#",
    trending: false
  },
  {
    id: 104,
    title: "Silicon Valley Executives Turn to Microdosing and Nootropics for Edge",
    summary: "Tech industry survey reveals 67% of executives use cognitive enhancers for competitive advantage.",
    source: "TechCrunch",
    date: "2025-05-18",
    category: "Industry Trends",
    url: "#",
    trending: false
  },
  {
    id: 105,
    title: "New Study Links Omega-3 Supplements to Improved Working Memory",
    summary: "Meta-analysis of 15 studies shows consistent cognitive benefits across age groups.",
    source: "Nutrients Journal",
    date: "2025-05-10",
    category: "Research",
    url: "#",
    trending: false
  }
];

export function NewsSection() {
  const [activeTab, setActiveTab] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Get unique categories
  const categories = ['all', ...new Set([...recentNews, ...archivedNews].map(item => item.category))];

  // Filter news based on search and category
  const filterNews = (newsArray) => {
    return newsArray.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredRecentNews = filterNews(recentNews);
  const filteredArchivedNews = filterNews(archivedNews);

  const refreshNews = () => {
    setLastUpdated(new Date());
    // In a real app, this would fetch fresh news from APIs
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Research': 'bg-blue-100 text-blue-800',
      'Product Launch': 'bg-green-100 text-green-800',
      'Innovation': 'bg-purple-100 text-purple-800',
      'Business': 'bg-orange-100 text-orange-800',
      'Industry Trends': 'bg-yellow-100 text-yellow-800',
      'Regulation': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const NewsCard = ({ article, showTrending = true }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getCategoryColor(article.category)}>
                {article.category}
              </Badge>
              {showTrending && article.trending && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{article.summary}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(article.date)}
            <span className="mx-2">•</span>
            <span>{article.source}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.open(article.url, '_blank')}>
            <ExternalLink className="w-4 h-4 mr-1" />
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Nootropics & Supplement News</h2>
        <p className="text-gray-600">Stay updated with the latest research, trends, and developments</p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="outline" onClick={refreshNews}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            Recent News ({filteredRecentNews.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="w-4 h-4" />
            Archived ({filteredArchivedNews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-6">
          <div className="text-sm text-gray-600 mb-4">
            <Clock className="w-4 h-4 inline mr-1" />
            Showing news from the last 4 weeks
          </div>
          
          {filteredRecentNews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No recent news found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecentNews.map(article => (
                <NewsCard key={article.id} article={article} showTrending={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-6">
          <div className="text-sm text-gray-600 mb-4">
            <Archive className="w-4 h-4 inline mr-1" />
            Showing archived news older than 4 weeks
          </div>
          
          {filteredArchivedNews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No archived news found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArchivedNews.map(article => (
                <NewsCard key={article.id} article={article} showTrending={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* News Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Our News Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 border rounded-lg">
              <div className="font-medium">Research Journals</div>
              <div className="text-gray-600">Nature, Science, NCBI</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-medium">Industry News</div>
              <div className="text-gray-600">Nutritional Outlook, SupplySide</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-medium">Health Media</div>
              <div className="text-gray-600">Healthline, WebMD, Forbes</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="font-medium">Business News</div>
              <div className="text-gray-600">TechCrunch, Business Insider</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

