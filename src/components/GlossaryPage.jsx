import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Search, BookOpen } from 'lucide-react';
import { glossaryTerms } from '../data/glossaryTerms.js';

export function GlossaryPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return glossaryTerms;
    const q = search.toLowerCase();
    return glossaryTerms.filter(
      t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q))
    );
  }, [search]);

  // Group by first letter
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(term => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filtered]);

  const letters = Object.keys(grouped).sort();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Nootropics Glossary
        </h1>
        <p className="text-gray-600 mt-2">Key terms, compounds, and concepts in nootropic stacking — explained plainly.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search terms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Letter nav */}
      <div className="flex flex-wrap gap-1">
        {letters.map(letter => (
          <a
            key={letter}
            href={`#glossary-${letter}`}
            className="w-8 h-8 flex items-center justify-center rounded text-sm font-medium bg-gray-100 hover:bg-blue-100 hover:text-blue-700 transition-colors"
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Terms */}
      {letters.map(letter => (
        <div key={letter} id={`glossary-${letter}`}>
          <h2 className="text-lg font-bold text-gray-400 mb-2 border-b pb-1">{letter}</h2>
          <div className="space-y-3">
            {grouped[letter].map(item => (
              <Card key={item.term} className="hover:shadow-sm transition-shadow">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.term}</h3>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.definition}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs capitalize">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-8">No terms match your search.</p>
      )}
    </div>
  );
}
