import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Plus, AlertTriangle, Clock, Pill, ArrowLeft, ExternalLink } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { AffiliateLinks } from './MonetizationManager.jsx';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { supplements } from '../data/supplements.js';

const getCategoryColor = (category) => {
  const colors = {
    'energy': 'bg-orange-100 text-orange-800',
    'nootropic': 'bg-blue-100 text-blue-800',
    'adaptogen': 'bg-green-100 text-green-800',
    'longevity': 'bg-purple-100 text-purple-800',
    'vitamin': 'bg-yellow-100 text-yellow-800',
    'mineral': 'bg-gray-100 text-gray-800',
    'amino-acid': 'bg-pink-100 text-pink-800',
    'antioxidant': 'bg-red-100 text-red-800',
    'anti-inflammatory': 'bg-indigo-100 text-indigo-800',
    'sleep': 'bg-violet-100 text-violet-800',
    'performance': 'bg-emerald-100 text-emerald-800',
    'essential': 'bg-teal-100 text-teal-800',
    'gut-health': 'bg-lime-100 text-lime-800',
    'hormone': 'bg-rose-100 text-rose-800',
    'protein': 'bg-amber-100 text-amber-800',
    'immune': 'bg-cyan-100 text-cyan-800',
    'metabolic': 'bg-slate-100 text-slate-800',
    'superfood': 'bg-green-200 text-green-900',
    'fat': 'bg-orange-200 text-orange-900',
    'prescription': 'bg-red-200 text-red-900'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

const getEffectColor = (value) => {
  if (value >= 7) return 'text-green-600';
  if (value >= 4) return 'text-blue-600';
  if (value >= 1) return 'text-gray-600';
  return 'text-gray-400';
};

export function SupplementPage() {
  const { id } = useParams();
  const { addSupplement, stack } = useStack();

  const supplement = supplements.find(s => s.id === id);

  if (!supplement) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Supplement Not Found</h2>
        <p className="text-gray-600 mb-6">The supplement you're looking for doesn't exist in our database.</p>
        <Link to="/supplements">
          <Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to Library</Button>
        </Link>
      </div>
    );
  }

  const isInStack = stack.some(item => item.supplementId === supplement.id);

  const handleAddToStack = () => {
    addSupplement(supplement);
  };

  // Find related supplements (same category, excluding current)
  const relatedSupplements = supplements
    .filter(s => s.category === supplement.category && s.id !== supplement.id)
    .slice(0, 4);

  return (
    <>
      <SEOOptimizer page="supplements" supplement={supplement} />

      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link to="/supplements" className="hover:text-gray-900">Supplements</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{supplement.name}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{supplement.name}</h1>
            <div className="flex items-center gap-3">
              <Badge className={`${getCategoryColor(supplement.category)}`}>
                {supplement.category.replace('-', ' ')}
              </Badge>
              <span className="text-sm text-gray-500">
                {supplement.dosage.min}-{supplement.dosage.max} {supplement.dosage.unit}
              </span>
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleAddToStack}
            disabled={isInStack}
          >
            <Plus className="w-5 h-5 mr-2" />
            {isInStack ? 'Already in Stack' : 'Add to My Stack'}
          </Button>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {supplement.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{supplement.description}</p>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Key Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {supplement.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Effects Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Effects Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(supplement.effects).map(([effect, value]) => (
                    <div key={effect} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{effect}</span>
                        <span className={`text-sm font-bold ${getEffectColor(value)}`}>
                          {value > 0 ? '+' : ''}{value}/10
                        </span>
                      </div>
                      <Progress value={Math.abs(value) * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Warnings & Interactions */}
            {(supplement.warnings.length > 0 || supplement.interactions.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Safety Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supplement.warnings.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Warnings</h4>
                      <div className="space-y-2">
                        {supplement.warnings.map((warning, index) => (
                          <Alert key={index} className="border-orange-200 bg-orange-50">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-800">{warning}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}
                  {supplement.interactions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Potential Interactions</h4>
                      <div className="flex flex-wrap gap-2">
                        {supplement.interactions.map((interaction, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {interaction.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column — dosage, buy, related */}
          <div className="space-y-6">
            {/* Dosage Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Dosage Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-800">
                    {supplement.dosage.min}-{supplement.dosage.max} {supplement.dosage.unit}
                  </div>
                  <p className="text-sm text-blue-600 mt-1">Recommended daily dose</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800">Best Timing</span>
                  </div>
                  <p className="text-green-700">{supplement.dosage.timing}</p>
                </div>
              </CardContent>
            </Card>

            {/* Affiliate Links / Where to Buy */}
            <AffiliateLinks supplementId={supplement.id} supplementName={supplement.name} />

            {/* Related Supplements */}
            {relatedSupplements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Related Supplements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedSupplements.map(related => (
                      <Link
                        key={related.id}
                        to={`/supplements/${related.id}`}
                        className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium">{related.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{related.description}</div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Medical Disclaimer */}
        <Alert className="border-gray-200 bg-gray-50">
          <AlertTriangle className="h-4 w-4 text-gray-600" />
          <AlertDescription className="text-gray-700">
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and is not intended as medical advice.
            Always consult with a healthcare professional before starting any new supplement regimen.
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}
