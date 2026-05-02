import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Plus, AlertTriangle, Clock, Pill, ArrowLeft, ExternalLink } from 'lucide-react';
import { useStack } from '../contexts/StackContext.jsx';
import { AffiliateLinks, AFFILIATE_LINKS } from './MonetizationManager.jsx';
import { VendorPricesDetailed } from './VendorPrices.jsx';
import { hasTrackedPrices } from '../data/priceTable.js';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { supplements } from '../data/supplements.js';
import { JsonLd } from './JsonLd.jsx';
import { buildProductSchema } from '../lib/schema/builders.js';

// Category chip uses a single token-driven neutral style. The visual
// signal that varies per supplement is the evidence-tier badge on the
// detail header; the category text is just metadata, not the headline.
const CATEGORY_CHIP_CLASS = 'bg-surface-sunk text-ink-700 border border-ink-200';

const PRESCRIPTION_CATEGORIES = new Set(['prescription']);

const getCategoryColor = (category) =>
  PRESCRIPTION_CATEGORIES.has(category)
    ? 'bg-danger-100 text-danger-700 border border-danger-500'
    : CATEGORY_CHIP_CLASS;

const getEffectColor = (value) => {
  if (value >= 7) return 'text-accent-700';
  if (value >= 4) return 'text-primary-800';
  if (value >= 1) return 'text-ink-700';
  return 'text-ink-400';
};

export function SupplementPage() {
  const { id } = useParams();
  const { addSupplement, stack } = useStack();

  const supplement = supplements.find(s => s.id === id);

  if (!supplement) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Supplement Not Found</h2>
        <p className="text-ink-700 mb-6">The supplement you're looking for doesn't exist in our database.</p>
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

  const affiliates = AFFILIATE_LINKS[supplement.id] || {};
  const productSchemaSource = {
    ...supplement,
    affiliateAmazon: affiliates.amazon,
    affiliateIherb: affiliates.iherb,
    affiliateNootropicsDepot: affiliates.nootropicsdepot,
  };

  return (
    <>
      <SEOOptimizer page="supplements" supplement={supplement} />
      <JsonLd data={buildProductSchema(productSchemaSource)} />

      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-ink-500">
          <Link to="/" className="hover:text-ink-900">Home</Link>
          <span>/</span>
          <Link to="/supplements" className="hover:text-ink-900">Supplements</Link>
          <span>/</span>
          <span className="text-ink-900 font-medium">{supplement.name}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold mb-2">{supplement.name}</h1>
            <div className="flex items-center gap-3">
              <Badge className={`${getCategoryColor(supplement.category)}`}>
                {supplement.category.replace('-', ' ')}
              </Badge>
              <span className="text-sm text-ink-500">
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
                <p className="text-ink-700 leading-relaxed">{supplement.description}</p>
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
                        <span className={`text-sm font-semibold ${getEffectColor(value)}`}>
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
                          <Alert key={index} className="border-warn-500 bg-warn-100">
                            <AlertTriangle className="h-4 w-4 text-warn-700" />
                            <AlertDescription className="text-warn-700">{warning}</AlertDescription>
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
                <div className="p-4 bg-surface-sunk border border-ink-200 rounded-md">
                  <div className="text-2xl font-semibold text-ink-900 font-mono">
                    {supplement.dosage.min}–{supplement.dosage.max} {supplement.dosage.unit}
                  </div>
                  <p className="text-sm text-ink-500 mt-1">Recommended daily dose</p>
                </div>
                <div className="p-4 bg-surface-sunk border border-ink-200 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-accent-700" />
                    <span className="font-semibold text-ink-900">Best Timing</span>
                  </div>
                  <p className="text-ink-700">{supplement.dosage.timing}</p>
                </div>
              </CardContent>
            </Card>

            {/* Vendor price comparison (when we track prices for this item) */}
            {hasTrackedPrices(supplement.id) && (
              <VendorPricesDetailed supplementId={supplement.id} />
            )}

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
                        className="block p-3 rounded-md border hover:bg-surface-card transition-colors"
                      >
                        <div className="font-medium">{related.name}</div>
                        <div className="text-sm text-ink-500 line-clamp-1">{related.description}</div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Medical Disclaimer */}
        <Alert className="border-ink-200 bg-surface-card">
          <AlertTriangle className="h-4 w-4 text-ink-500" />
          <AlertDescription className="text-ink-700">
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and is not intended as medical advice.
            Always consult with a healthcare professional before starting any new supplement regimen.
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
}
