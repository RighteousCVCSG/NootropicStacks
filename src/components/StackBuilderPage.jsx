import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStack } from '../contexts/StackContext.jsx';
import { GoalSelector } from './GoalSelector.jsx';
import { RecommendationPanel } from './RecommendationPanel.jsx';
import { SupplementLibrary } from './SupplementLibrary.jsx';
import { SupplementModal } from './SupplementModal.jsx';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { StackProtocolBuilder } from './StackProtocolBuilder.jsx';
import { PredefinedStacks } from './PredefinedStacks.jsx';
import { supplements } from '../data/supplements.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Layers, Library, Activity } from 'lucide-react';

/**
 * Dedicated stack-builder page at /build. The homepage is now the marketing
 * landing page; the builder lives here as a clean, focused workspace.
 *
 * Layout:
 *   1. Page header — eyebrow + title + tagline + breadcrumb
 *   2. Returning-user inline status (only when localStorage has a stack)
 *   3. Two-column working grid (1/3 goals · 2/3 recommendations + library)
 *   4. Daily protocol view below the grid — only renders once the stack
 *      has items, so an empty workspace doesn't look bloated
 */
export function StackBuilderPage() {
  const [selectedSupplement, setSelectedSupplement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { stack, stackScore, stackName, loadStack, openDrawer, setStackName } = useStack();
  const overall = stackScore?.headlineScores?.overall;
  const overallLabel = stackScore?.headlineScores?.dimensionQuals?.overall?.label;

  // One-shot URL hydration: support deep-linking into a pre-loaded stack.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stackParam = params.get('stack');
    const nameParam = params.get('name');
    if (stackParam && stack.length === 0) {
      const ids = stackParam.split(',');
      const itemsToLoad = ids
        .map((id) => supplements.find((s) => s.id === id))
        .filter(Boolean)
        .map((s) => ({
          supplementId: s.id,
          dosage: (s.dosage.min + s.dosage.max) / 2,
          timing: s.dosage.timing,
        }));
      if (itemsToLoad.length > 0) {
        loadStack(itemsToLoad);
        if (nameParam) setStackName(nameParam);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewDetails = (supplement) => {
    setSelectedSupplement(supplement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplement(null);
  };

  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="Build Your Nootropic Stack — NootropicStacker"
        customDescription="Pick goals, browse 195 supplements, see real-time synergy and Stack Score. Free."
      />

      {/* Page header — single h1 + tagline. The header nav already shows
          the user is on the Build page; breadcrumb + eyebrow chrome was
          dead vertical space. */}
      <section className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-ink-900 tracking-tight">
          Build your stack
        </h1>
        <p className="text-ink-500 text-xs sm:text-sm mt-0.5">
          Set goals, add supplements, watch your Stack Score react.
        </p>
      </section>

      {/* Returning-user status (single line, only when stack exists) */}
      {stack.length > 0 && (
        <div className="mb-6 rounded-md border border-primary-300 bg-primary-050 px-3 py-2 flex items-center gap-3 text-sm">
          <Activity className="w-4 h-4 text-primary-800 shrink-0" />
          <span className="text-ink-900 flex-1 truncate">
            {stackName ? (
              <>
                <span className="font-semibold">{stackName}</span>
                <span className="text-ink-500">
                  {' · '}
                  {stack.length} supplement{stack.length === 1 ? '' : 's'}
                </span>
              </>
            ) : (
              <span className="font-semibold">
                {stack.length} supplement{stack.length === 1 ? '' : 's'} in your stack
              </span>
            )}
            {overall != null && (
              <>
                , Stack Score{' '}
                <span className="font-semibold">{overall.toFixed(1)}</span>
                {overallLabel && (
                  <span className="text-ink-500"> ({overallLabel})</span>
                )}
              </>
            )}
          </span>
          <button
            type="button"
            onClick={openDrawer}
            className="text-xs font-medium text-primary-800 hover:text-primary-700 shrink-0"
          >
            Open drawer →
          </button>
        </div>
      )}

      {/* Working grid — 1/3 goals · 2/3 recommendations + library */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-start">
        <div className="lg:col-span-1">
          <GoalSelector />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <RecommendationPanel />

          <Tabs defaultValue="library" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="library" className="flex items-center gap-2">
                <Library className="w-4 h-4" />
                Supplement Library
              </TabsTrigger>
              <TabsTrigger value="stacks" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Pre-Built Stacks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="space-y-6 mt-4">
              <SupplementLibrary onViewDetails={handleViewDetails} />
            </TabsContent>

            <TabsContent value="stacks" className="space-y-6 mt-4">
              <PredefinedStacks />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Daily protocol — only renders when there's a stack to schedule. */}
      {stack.length > 0 && (
        <section className="mb-10">
          <StackProtocolBuilder />
        </section>
      )}

      <SupplementModal
        supplement={selectedSupplement}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
