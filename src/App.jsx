import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { AuthDialog } from './components/AuthDialog.jsx';
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
import { StackScoreWidget } from './components/StackScoreWidget.jsx';
import { BlogSection } from './components/BlogSection.jsx';
import { BlogArticlePage } from './components/BlogArticlePage.jsx';
import { FAQPage } from './components/FAQPage.jsx';
import { GlossaryPage } from './components/GlossaryPage.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { AlertTriangle, Pill, Layers, Library, Newspaper, BookOpen, Home, HelpCircle, LogIn, LogOut, User, PenLine } from 'lucide-react';
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

// Header auth section
function HeaderAuth() {
  const { user, logout, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-sm text-gray-600">
          <User className="w-3.5 h-3.5 inline mr-1" />
          {user.name || user.email}
        </span>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setShowAuth(true)}>
        <LogIn className="w-4 h-4 mr-1" />
        Sign In
      </Button>
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </>
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

      {/* How It Works */}
      <div className="mb-8 bg-white rounded-lg border p-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Build Your Perfect Nootropic Stack</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">Free to use. No account required.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center mx-auto mb-3">1</div>
            <h3 className="font-semibold text-sm mb-1">Set Your Goals</h3>
            <p className="text-xs text-gray-500">Pick what you want to optimize — focus, energy, mood, memory, or creativity.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center mx-auto mb-3">2</div>
            <h3 className="font-semibold text-sm mb-1">Build Your Stack</h3>
            <p className="text-xs text-gray-500">Add supplements from 195 compounds. Get real-time synergy analysis and recommendations.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center mx-auto mb-3">3</div>
            <h3 className="font-semibold text-sm mb-1">Optimize with Stack Score</h3>
            <p className="text-xs text-gray-500">Your stack gets a 0-100 score across synergy, coverage, balance, and efficiency.</p>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-6 text-xs text-gray-400">
          <span>195 supplements</span>
          <span>&middot;</span>
          <span>60+ interactions mapped</span>
          <span>&middot;</span>
          <span>9 mechanism groups</span>
        </div>
      </div>

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
    <AuthProvider>
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
                <NavLink to="/blog" icon={PenLine}>Blog</NavLink>
              </nav>

              <HeaderAuth />
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
            <NavLink to="/blog" icon={PenLine}>Blog</NavLink>
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
            <Route path="/blog" element={
              <>
                <SEOOptimizer page="home" customTitle="Nootropic Blog — Research, Stacks & Trends | NootropicStacker" customDescription="Deep dives into nootropic research, stack guides, and what's trending in the biohacking world." />
                <BlogSection />
              </>
            } />
            <Route path="/blog/:slug" element={<BlogArticlePage />} />
            <Route path="/news" element={
              <>
                <SEOOptimizer page="home" customTitle="Nootropic News & Research | NootropicStacker" customDescription="Latest nootropic supplement news, research updates, and industry trends." />
                <NewsSection />
              </>
            } />
            <Route path="/faq" element={
              <>
                <SEOOptimizer page="home" customTitle="FAQ — Nootropic Stacking Questions Answered | NootropicStacker" customDescription="Answers to common questions about nootropic stacking, supplement safety, cycling, and how to use NootropicStacker." />
                <FAQPage />
              </>
            } />
            <Route path="/glossary" element={
              <>
                <SEOOptimizer page="home" customTitle="Nootropics Glossary — Key Terms & Concepts | NootropicStacker" customDescription="Plain-English definitions of nootropic terms, compounds, and concepts. From acetylcholine to withanolides." />
                <GlossaryPage />
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

        {/* Stack Score Floating Widget */}
        <StackScoreWidget />

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
                <Link to="/supplements" className="hover:text-gray-900">195 Supplements</Link>
                <span>•</span>
                <Link to="/blog" className="hover:text-gray-900">Blog</Link>
                <span>•</span>
                <Link to="/families" className="hover:text-gray-900">Family Guides</Link>
                <span>•</span>
                <Link to="/faq" className="hover:text-gray-900">FAQ</Link>
                <span>•</span>
                <Link to="/glossary" className="hover:text-gray-900">Glossary</Link>
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
    </AuthProvider>
  );
}

export default App;
