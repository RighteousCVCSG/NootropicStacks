import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { StackProvider } from './contexts/StackContext.jsx';
import { GoalSelector } from './components/GoalSelector.jsx';
import { StackPanel } from './components/StackPanel.jsx';
import { RecommendationPanel } from './components/RecommendationPanel.jsx';
import { SupplementLibrary } from './components/SupplementLibrary.jsx';
import { SupplementModal } from './components/SupplementModal.jsx';
import { SupplementPage } from './components/SupplementPage.jsx';
import { SupplementCompare } from './components/SupplementCompare.jsx';
import { StackQuiz } from './components/StackQuiz.jsx';
import { SEOOptimizer, SEOContent } from './components/SEOOptimizer.jsx';
import { ContextualAd, SmartAdPlacement, AdRevenueTracker } from './components/AdManager.jsx';
import { PredefinedStacks } from './components/PredefinedStacks.jsx';
import { NewsSection } from './components/NewsSection.jsx';
import { SupplementFamilyGuide } from './components/SupplementFamilyGuide.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { AlertTriangle, Pill, Target, Sparkles, Layers, Library, Newspaper, BookOpen, Home, HelpCircle } from 'lucide-react';
import './App.css';

// Scroll to top on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function NavLink({ to, icon: Icon, children }) {
  const location = useLocation();
  const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <Link to={to}>
      <Button
        variant={isActive ? 'default' : 'ghost'}
        size="sm"
        className="flex items-center gap-2"
      >
        <Icon className="w-4 h-4" />
        {children}
      </Button>
    </Link>
  );
}

// Home page with stack builder
function HomePage() {
  const [selectedSupplement, setSelectedSupplement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userGoals, setUserGoals] = useState(['energy']);
  const [stackSize, setStackSize] = useState(0);

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
      <SEOOptimizer page="home" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Goals and Stack */}
        <div className="lg:col-span-1 space-y-6">
          <GoalSelector />
          <StackPanel />
          <ContextualAd category="nootropics" userGoals={userGoals} position="sidebar" />
        </div>

        {/* Right Column - Recommendations and Library */}
        <div className="lg:col-span-2 space-y-6">
          <RecommendationPanel />
          <SmartAdPlacement supplements={[]} userGoals={userGoals} stackSize={stackSize} />

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
      </div>

      <SEOContent />

      <SupplementModal
        supplement={selectedSupplement}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}

// Library page (full-width)
function LibraryPage() {
  const [selectedSupplement, setSelectedSupplement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <SEOOptimizer page="supplements" />
      <SupplementLibrary onViewDetails={handleViewDetails} />
      <SupplementModal
        supplement={selectedSupplement}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}

function App() {
  const adRevenue = AdRevenueTracker();

  // Track affiliate clicks
  useEffect(() => {
    const handleAffiliateClick = (event) => {
      console.log('Affiliate click tracked:', event.detail);
    };
    window.addEventListener('affiliateClick', handleAffiliateClick);
    return () => window.removeEventListener('affiliateClick', handleAffiliateClick);
  }, []);

  return (
    <StackProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">NootropicStacker</h1>
                  <p className="text-sm text-gray-600">Build Your Perfect Nootropic Stack</p>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-2">
                <NavLink to="/" icon={Home}>Stack Builder</NavLink>
                <NavLink to="/quiz" icon={HelpCircle}>Quiz</NavLink>
                <NavLink to="/supplements" icon={Library}>Library</NavLink>
                <NavLink to="/families" icon={BookOpen}>Families</NavLink>
                <NavLink to="/news" icon={Newspaper}>News</NavLink>
              </nav>

              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
                <Target className="w-4 h-4" />
                <span>Smart Recommendations</span>
                <span className="mx-2">•</span>
                <Sparkles className="w-4 h-4" />
                <span>Safety Monitoring</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        <nav className="md:hidden bg-white border-b px-4 py-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <NavLink to="/" icon={Home}>Builder</NavLink>
            <NavLink to="/quiz" icon={HelpCircle}>Quiz</NavLink>
            <NavLink to="/supplements" icon={Library}>Library</NavLink>
            <NavLink to="/families" icon={BookOpen}>Families</NavLink>
            <NavLink to="/news" icon={Newspaper}>News</NavLink>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Medical Disclaimer */}
          <Alert className="mb-3 border-orange-200 bg-orange-50 py-2">
            <AlertTriangle className="h-3 w-3 text-orange-600" />
            <AlertDescription className="text-orange-800 text-sm">
              <strong>Important:</strong> Educational purposes only. Consult healthcare professionals before starting supplements.
            </AlertDescription>
          </Alert>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<StackQuiz />} />
            <Route path="/supplements" element={<LibraryPage />} />
            <Route path="/supplements/:id" element={<SupplementPage />} />
            <Route path="/compare/:slugs" element={<SupplementCompare />} />
            <Route path="/stacks" element={<PredefinedStacks />} />
            <Route path="/families" element={
              <>
                <SEOOptimizer page="home" customTitle="Supplement Family Guides | NootropicStacker" customDescription="Learn about supplement families including racetams, cholinergics, adaptogens, stimulants, and vitamins." />
                <SupplementFamilyGuide />
              </>
            } />
            <Route path="/news" element={
              <>
                <SEOOptimizer page="home" customTitle="Nootropic News & Research | NootropicStacker" customDescription="Latest nootropic supplement news, research updates, and industry trends." />
                <NewsSection />
              </>
            } />
            <Route path="*" element={
              <div className="text-center py-20">
                <h2 className="text-4xl font-bold mb-4">404</h2>
                <p className="text-gray-600 mb-6">Page not found. Let's get you back on track.</p>
                <div className="flex justify-center gap-4">
                  <Link to="/"><Button>Stack Builder</Button></Link>
                  <Link to="/supplements"><Button variant="outline">Supplement Library</Button></Link>
                </div>
              </div>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                <strong>NootropicStacker</strong> - Built for biohackers who want to optimize their supplement stacks safely
              </p>
              <p className="mb-4">
                This tool provides educational information only. Always consult healthcare professionals for medical advice.
              </p>
              <div className="flex justify-center items-center gap-4 text-xs mb-4">
                <Link to="/supplements" className="hover:text-gray-900">70+ Supplements</Link>
                <span>•</span>
                <Link to="/" className="hover:text-gray-900">Smart Recommendations</Link>
                <span>•</span>
                <Link to="/families" className="hover:text-gray-900">Family Guides</Link>
                <span>•</span>
                <Link to="/news" className="hover:text-gray-900">Latest News</Link>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                <p>Affiliate Disclosure: We earn commissions from qualifying purchases through our affiliate links.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </StackProvider>
  );
}

export default App;
