import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Plus, ArrowLeft, AlertTriangle, Trophy } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { AffiliateLinks } from './MonetizationManager.jsx';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { supplements } from '../data/supplements.js';

const EFFECT_LABELS = {
  energy: 'Energy',
  mood: 'Mood',
  balance: 'Balance',
  creativity: 'Creativity',
  socialness: 'Socialness',
  learning: 'Learning',
  study: 'Study'
};

function EffectComparison({ effect, label, valueA, valueB, nameA, nameB }) {
  const winner = valueA > valueB ? 'a' : valueB > valueA ? 'b' : 'tie';

  return (
    <div className="py-3 border-b last:border-0">
      <div className="text-sm font-medium mb-2 text-center">{label}</div>
      <div className="grid grid-cols-3 gap-2 items-center">
        <div className="text-right">
          <span className={`text-lg font-semibold ${winner === 'a' ? 'text-accent-700' : 'text-ink-700'}`}>
            {valueA}/10
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Progress value={valueA * 10} className="h-2" />
          <Progress value={valueB * 10} className="h-2" />
        </div>
        <div>
          <span className={`text-lg font-semibold ${winner === 'b' ? 'text-accent-700' : 'text-ink-700'}`}>
            {valueB}/10
          </span>
        </div>
      </div>
    </div>
  );
}

export function SupplementCompare() {
  const { slugs } = useParams();
  const { addSupplement, stack } = useStack();

  // Parse "ashwagandha-vs-rhodiola" format
  const parts = slugs ? slugs.split('-vs-') : [];
  const idA = parts[0];
  const idB = parts[1];

  const supplementA = supplements.find(s => s.id === idA);
  const supplementB = supplements.find(s => s.id === idB);

  if (!supplementA || !supplementB) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Comparison Not Found</h2>
        <p className="text-ink-700 mb-3">
          One or both supplements could not be found. Try comparing from the{' '}
          <Link to="/supplements" className="text-primary-700 hover:underline">supplement library</Link>.
        </p>
        <Link to="/supplements">
          <Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to Library</Button>
        </Link>
      </div>
    );
  }

  const isAInStack = stack.some(item => item.supplementId === supplementA.id);
  const isBInStack = stack.some(item => item.supplementId === supplementB.id);

  // Calculate total scores
  const totalA = Object.values(supplementA.effects).reduce((sum, v) => sum + Math.max(0, v), 0);
  const totalB = Object.values(supplementB.effects).reduce((sum, v) => sum + Math.max(0, v), 0);

  // Determine category winners
  const winsA = Object.keys(EFFECT_LABELS).filter(k => supplementA.effects[k] > supplementB.effects[k]).length;
  const winsB = Object.keys(EFFECT_LABELS).filter(k => supplementB.effects[k] > supplementA.effects[k]).length;

  // Popular comparisons for internal linking
  const popularComparisons = [
    ['ashwagandha', 'rhodiola'],
    ['piracetam', 'noopept'],
    ['alpha-gpc', 'citicoline'],
    ['caffeine', 'l-theanine'],
    ['lions-mane', 'bacopa'],
    ['modafinil', 'phenylpiracetam'],
    ['creatine', 'tyrosine'],
    ['magnesium', 'zinc'],
  ].filter(([a, b]) => !(a === idA && b === idB) && !(a === idB && b === idA));

  return (
    <>
      <SEOOptimizer
        page="supplements"
        customTitle={`${supplementA.name} vs ${supplementB.name} — Which Is Better? | NootropicStacker`}
        customDescription={`Compare ${supplementA.name} and ${supplementB.name} side-by-side. See effects, dosage, safety, and which is better for your goals.`}
      />

      <div className="space-y-3">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-ink-700">
          <Link to="/" className="hover:text-ink-900">Home</Link>
          <span>/</span>
          <Link to="/supplements" className="hover:text-ink-900">Supplements</Link>
          <span>/</span>
          <span className="text-ink-900 font-medium">{supplementA.name} vs {supplementB.name}</span>
        </nav>

        <h1 className="text-3xl font-semibold">
          {supplementA.name} vs {supplementB.name}
        </h1>
        <p className="text-ink-700">
          A detailed side-by-side comparison to help you choose the right supplement for your goals.
        </p>

        {/* Score Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Link to={`/supplements/${supplementA.id}`} className="hover:text-primary-700">
                <h3 className="font-semibold text-lg">{supplementA.name}</h3>
              </Link>
              <Badge className="mt-2">{supplementA.category.replace('-', ' ')}</Badge>
              <div className="mt-3 text-3xl font-semibold text-primary-700">{totalA}</div>
              <div className="text-sm text-ink-500">Total Score</div>
              <div className="text-sm font-medium mt-1">Wins {winsA} categories</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-surface-card flex items-center justify-center">
            <CardContent className="pt-6">
              <div className="text-4xl font-semibold text-ink-400">VS</div>
              {totalA !== totalB && (
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4 text-warn-500" />
                  <span className="text-sm font-medium">
                    {totalA > totalB ? supplementA.name : supplementB.name} leads
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Link to={`/supplements/${supplementB.id}`} className="hover:text-primary-700">
                <h3 className="font-semibold text-lg">{supplementB.name}</h3>
              </Link>
              <Badge className="mt-2">{supplementB.category.replace('-', ' ')}</Badge>
              <div className="mt-3 text-3xl font-semibold text-primary-700">{totalB}</div>
              <div className="text-sm text-ink-500">Total Score</div>
              <div className="text-sm font-medium mt-1">Wins {winsB} categories</div>
            </CardContent>
          </Card>
        </div>

        {/* Effect-by-Effect Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Effects Comparison</CardTitle>
            <div className="grid grid-cols-3 text-sm text-ink-500 mt-2">
              <div className="text-right pr-4">{supplementA.name}</div>
              <div className="text-center">Effect</div>
              <div className="pl-4">{supplementB.name}</div>
            </div>
          </CardHeader>
          <CardContent>
            {Object.entries(EFFECT_LABELS).map(([key, label]) => (
              <EffectComparison
                key={key}
                effect={key}
                label={label}
                valueA={supplementA.effects[key] || 0}
                valueB={supplementB.effects[key] || 0}
                nameA={supplementA.name}
                nameB={supplementB.name}
              />
            ))}
          </CardContent>
        </Card>

        {/* Dosage Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card>
            <CardHeader>
              <CardTitle>{supplementA.name} — Dosage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-primary-050 rounded-md">
                <div className="font-semibold text-primary-800">
                  {supplementA.dosage.min}-{supplementA.dosage.max} {supplementA.dosage.unit}
                </div>
                <div className="text-sm text-primary-700">{supplementA.dosage.timing}</div>
              </div>
              <p className="text-sm text-ink-700">{supplementA.description}</p>
              <Button
                size="sm"
                onClick={() => addSupplement(supplementA)}
                disabled={isAInStack}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                {isAInStack ? 'In Stack' : `Add ${supplementA.name} to Stack`}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{supplementB.name} — Dosage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-primary-050 rounded-md">
                <div className="font-semibold text-primary-800">
                  {supplementB.dosage.min}-{supplementB.dosage.max} {supplementB.dosage.unit}
                </div>
                <div className="text-sm text-primary-700">{supplementB.dosage.timing}</div>
              </div>
              <p className="text-sm text-ink-700">{supplementB.description}</p>
              <Button
                size="sm"
                onClick={() => addSupplement(supplementB)}
                disabled={isBInStack}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                {isBInStack ? 'In Stack' : `Add ${supplementB.name} to Stack`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Where to Buy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AffiliateLinks supplementId={supplementA.id} supplementName={supplementA.name} />
          <AffiliateLinks supplementId={supplementB.id} supplementName={supplementB.name} />
        </div>

        {/* Why Not Both? */}
        <Card className="bg-accent-050 border-accent-300">
          <CardHeader>
            <CardTitle className="text-accent-700">Why Not Stack Both?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-accent-700 mb-4">
              {supplementA.name} and {supplementB.name} can often be combined in a stack for complementary effects.
              Use our <Link to="/build" className="font-semibold underline">Stack Builder</Link> to check for interactions
              and optimize your dosages.
            </p>
            <Link to="/build">
              <Button variant="outline" className="border-accent-500 text-accent-700 hover:bg-accent-100">
                Open Stack Builder
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Popular Comparisons */}
        <Card>
          <CardHeader>
            <CardTitle>More Supplement Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {popularComparisons.slice(0, 8).map(([a, b]) => {
                const sA = supplements.find(s => s.id === a);
                const sB = supplements.find(s => s.id === b);
                if (!sA || !sB) return null;
                return (
                  <Link
                    key={`${a}-${b}`}
                    to={`/compare/${a}-vs-${b}`}
                    className="block p-3 rounded-md border hover:bg-surface-card transition-colors text-center"
                  >
                    <span className="text-sm font-medium">{sA.name}</span>
                    <span className="text-xs text-ink-400 mx-1">vs</span>
                    <span className="text-sm font-medium">{sB.name}</span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="border-ink-200 bg-surface-card">
          <AlertTriangle className="h-4 w-4 text-ink-700" />
          <AlertDescription className="text-ink-700">
            <strong>Disclaimer:</strong> This comparison is for educational purposes. Individual results vary.
            Consult a healthcare professional before starting any supplement.
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}
