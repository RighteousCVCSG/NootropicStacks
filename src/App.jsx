import React, { useState, useEffect } from 'react';
import { StackProvider } from './contexts/StackContext.jsx';
import { GoalSelector } from './components/GoalSelector.jsx';
import { StackPanel } from './components/StackPanel.jsx';
import { RecommendationPanel } from './components/RecommendationPanel.jsx';
import { SupplementLibrary } from './components/SupplementLibrary.jsx';
import { SupplementModal } from './components/SupplementModal.jsx';
import { MonetizationManager } from './components/MonetizationManager.jsx';
import { SEOOptimizer, SEOContent } from './components/SEOOptimizer.jsx';
import { ContextualAd, SmartAdPlacement, AdRevenueTracker } from './components/AdManager.jsx';
import { PredefinedStacks } from './components/PredefinedStacks.jsx';
import { NewsSection } from './components/NewsSection.jsx';
import { SupplementFamilyGuide } from './components/SupplementFamilyGuide.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { AlertTriangle, Pill, Target, Sparkles, DollarSign, Settings, Layers, Library, Newspaper, BookOpen, Home } from 'lucide-react';
import './App.css';

function App() {
  const [selectedSupplement, setSelectedSupplement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userGoals, setUserGoals] = useState(['energy']);
  const [stackSize, setStackSize] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const adRevenue = AdRevenueTracker();

  const handleViewDetails = (supplement) => {
    setSelectedSupplement(supplement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplement(null);
  };

  // Track affiliate clicks
  useEffect(() => {
    const handleAffiliateClick = (event) => {
      console.log('Affiliate click tracked:', event.detail);
      // In a real app, this would send data to analytics
    };

    window.addEventListener('affiliateClick', handleAffiliateClick);
    return () => window.removeEventListener('affiliateClick', handleAffiliateClick);
  }, []);

  return (
    <>
      <SEOOptimizer page="home" />
      <StackProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Supplement Stacker</h1>
                    <p className="text-sm text-gray-600">Biohacker's Stack Builder</p>
                  </div>
                </div>
                
                {/* Navigation Menu */}
                <nav className="hidden md:flex items-center space-x-6">
                  <Button
                    variant={activeSection === 'home' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('home')}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Stack Builder
                  </Button>
                  <Button
                    variant={activeSection === 'library' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('library')}
                    className="flex items-center gap-2"
                  >
                    <Library className="w-4 h-4" />
                    Library
                  </Button>
                  <Button
                    variant={activeSection === 'families' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('families')}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Families
                  </Button>
                  <Button
                    variant={activeSection === 'news' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('news')}
                    className="flex items-center gap-2"
                  >
                    <Newspaper className="w-4 h-4" />
                    News
                  </Button>
                </nav>
                
                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>Smart Recommendations</span>
                    <span className="mx-2">•</span>
                    <Sparkles className="w-4 h-4" />
                    <span>Safety Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Medical Disclaimer */}
            <Alert className="mb-3 border-orange-200 bg-orange-50 py-2">
              <AlertTriangle className="h-3 w-3 text-orange-600" />
              <AlertDescription className="text-orange-800 text-sm">
                <strong>Important:</strong> Educational purposes only. Consult healthcare professionals before starting supplements.
              </AlertDescription>
            </Alert>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {activeSection === 'home' && (
                <>
                  {/* Left Column - Goals and Stack */}
                  <div className="lg:col-span-1 space-y-6">
                    <GoalSelector />
                    <StackPanel />
                    
                    {/* Contextual Ad - Sidebar */}
                    <ContextualAd 
                      category="nootropics" 
                      userGoals={userGoals}
                      position="sidebar"
                    />
                  </div>

                  {/* Right Column - Recommendations and Library */}
                  <div className="lg:col-span-2 space-y-6">
                    <RecommendationPanel />
                    
                    {/* Smart Ad Placement */}
                    <SmartAdPlacement 
                      supplements={[]}
                      userGoals={userGoals}
                      stackSize={stackSize}
                    />
                    
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
                      
                      <TabsContent value="library" className="space-y-6">
                        <SupplementLibrary onViewDetails={handleViewDetails} />
                      </TabsContent>
                      
                      <TabsContent value="stacks" className="space-y-6">
                        <PredefinedStacks />
                      </TabsContent>
                    </Tabs>
                  </div>
                </>
              )}
              
              {activeSection === 'library' && (
                <div className="lg:col-span-3">
                  <SupplementLibrary onViewDetails={handleViewDetails} />
                </div>
              )}
              
              {activeSection === 'families' && (
                <div className="lg:col-span-3">
                  <SupplementFamilyGuide />
                </div>
              )}
              
              {activeSection === 'news' && (
                <div className="lg:col-span-3">
                  <NewsSection />
                </div>
              )}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Supplement Stacker</strong> - Built for biohackers who want to optimize their supplement stacks safely
                </p>
                <p className="mb-4">
                  This tool provides educational information only. Always consult healthcare professionals for medical advice.
                </p>
                <div className="flex justify-center items-center gap-4 text-xs mb-4">
                  <span>• 70+ Supplements</span>
                  <span>• Smart Recommendations</span>
                  <span>• Safety Monitoring</span>
                  <span>• Interaction Warnings</span>
                  <span>• 25+ Nootropics</span>
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  <p>Affiliate Disclosure: We earn commissions from qualifying purchases through our affiliate links.</p>
                </div>
              </div>
            </div>
          </footer>

          {/* Supplement Detail Modal */}
          <SupplementModal
            supplement={selectedSupplement}
            isOpen={isModalOpen}
            onClose={closeModal}
          />

          {/* Hidden SEO Content */}
          <SEOContent />
        </div>
      </StackProvider>
    </>
  );
}

export default App;
