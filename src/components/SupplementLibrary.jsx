import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Search, Filter, Library } from 'lucide-react';
import { SupplementCard } from './SupplementCard.jsx';
import { supplements, categories } from '../data/supplements.js';

export function SupplementLibrary({ onViewDetails }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredAndSortedSupplements = useMemo(() => {
    let filtered = supplements;

    // Filter by search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(supplement =>
        supplement.name.toLowerCase().includes(lowercaseSearch) ||
        supplement.description.toLowerCase().includes(lowercaseSearch) ||
        supplement.benefits.some(benefit => benefit.toLowerCase().includes(lowercaseSearch)) ||
        supplement.category.toLowerCase().includes(lowercaseSearch)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(supplement => supplement.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'energy':
          return (b.effects.energy || 0) - (a.effects.energy || 0);
        case 'mood':
          return (b.effects.mood || 0) - (a.effects.mood || 0);
        case 'learning':
          return (b.effects.learning || 0) - (a.effects.learning || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const getCategoryCount = (category) => {
    if (category === 'all') return supplements.length;
    return supplements.filter(s => s.category === category).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Library className="w-5 h-5" />
          Supplement Library ({filteredAndSortedSupplements.length} supplements)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search supplements, benefits, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All ({getCategoryCount('all')})
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.replace('-', ' ')} ({getCategoryCount(category)})
                </Button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="energy">Energy Effect</option>
              <option value="mood">Mood Effect</option>
              <option value="learning">Learning Effect</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {filteredAndSortedSupplements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No supplements found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedSupplements.map(supplement => (
              <SupplementCard
                key={supplement.id}
                supplement={supplement}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

