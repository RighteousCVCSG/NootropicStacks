// v2
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { AuthDialog } from './components/AuthDialog.jsx';
import { StackProvider, useStack } from './contexts/StackContext.jsx';
import { track, trackPageview } from './lib/analytics.js';
import { GoalSelector } from './components/GoalSelector.jsx';
import { StackPanel } from './components/StackPanel.jsx';
import { RecommendationPanel } from './components/RecommendationPanel.jsx';
import { SupplementLibrary } from './components/SupplementLibrary.jsx';
import { SupplementModal } from './components/SupplementModal.jsx';
import { SEOOptimizer, SEOContent } from './components/SEOOptimizer.jsx';
import { ContextualAd, SmartAdPlacement, AdRevenueTracker } from './components/AdManager.jsx';
import { StackScoreWidget } from './components/StackScoreWidget.jsx';
import { StackProtocolBuilder } from './components/StackProtocolBuilder.jsx';
import { NewsletterCapture } from './components/NewsletterCapture.jsx';
import { blogArticlesIndex, getRecentArticlesMeta } from './data/blogArticlesIndex.js';

// Lazy-loaded route-level components
const AdminPage = lazy(() => import('./components/AdminPage.jsx').then(m => ({ default: m.AdminPage })));
const SupplementPage = lazy(() => import('./components/SupplementPage.jsx').then(m => ({ default: m.SupplementPage })));
const SupplementCompare = lazy(() => import('./components/SupplementCompare.jsx').then(m => ({ default: m.SupplementCompare })));
const StackQuiz = lazy(() => import('./components/StackQuiz.jsx').then(m => ({ default: m.StackQuiz })));
const PredefinedStacks = lazy(() => import('./components/PredefinedStacks.jsx').then(m => ({ default: m.PredefinedStacks })));
const NewsSection = lazy(() => import('./components/NewsSection.jsx').then(m => ({ default: m.NewsSection })));
const SupplementFamilyGuide = lazy(() => import('./components/SupplementFamilyGuide.jsx').then(m => ({ default: m.SupplementFamilyGuide })));
const BlogSection = lazy(() => import('./components/BlogSection.jsx').then(m => ({ default: m.BlogSection })));
const BlogArticlePage = lazy(() => import('./components/BlogArticlePage.jsx').then(m => ({ default: m.BlogArticlePage })));
const FAQPage = lazy(() => import('./components/FAQPage.jsx').then(m => ({ default: m.FAQPage })));
const GlossaryPage = lazy(() => import('./components/GlossaryPage.jsx').then(m => ({ default: m.GlossaryPage })));
const ContactPage = lazy(() => import('./components/ContactPage.jsx').then(m => ({ default: m.ContactPage })));
const BestNootropicsPage = lazy(() => import('./components/BestNootropicsPage.jsx').then(m => ({ default: m.BestNootropicsPage })));
const BestStacksPage = lazy(() => import('./components/BestStacksPage.jsx').then(m => ({ default: m.BestStacksPage })));
const ReviewsPage = lazy(() => import('./components/ReviewsPage.jsx').then(m => ({ default: m.ReviewsPage })));
const StartHerePage = lazy(() => import('./components/StartHerePage.jsx').then(m => ({ default: m.StartHerePage })));
const ComparisonPage = lazy(() => import('./components/ComparisonPage.jsx').then(m => ({ default: m.ComparisonPage })));
const NootropicsForFocusPage = lazy(() => import('./components/NootropicsForFocusPage.jsx').then(m => ({ default: m.NootropicsForFocusPage })));
const NootropicsForAnxietyPage = lazy(() => import('./components/NootropicsForAnxietyPage.jsx').then(m => ({ default: m.NootropicsForAnxietyPage })));
const LeadMagnetDownloadPage = lazy(() => import('./components/LeadMagnetDownloadPage.jsx').then(m => ({ default: m.LeadMagnetDownloadPage })));
import { supplements } from './data/supplements.js';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { AlertTriangle, Pill, Layers, Library, Newspaper, BookOpen, Home, HelpCircle, LogIn, LogOut, User, PenLine, Award, GitCompare, Star } from 'lucide-react';
import './App.css';

// Scroll to top + fire pageview on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageview(pathname);
  }, [pathname]);
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
        <span className="hidden sm:inline text-sm text-ink-500">
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

function GuideRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
}

// Home page with stack builder
function HomePage() {
  const [selectedSupplement, setSelectedSupplement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userGoals, setUserGoals] = useState(['energy']);
  const [stackSize, setStackSize] = useState(0);
  const { stack, loadStack } = useStack();

  const articleCount = blogArticlesIndex.length;
  const featuredArticles = getRecentArticlesMeta(6).map(({ slug, title, tags, readTime }) => ({ slug, title, tags, readTime }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stackParam = params.get('stack');
    if (stackParam && stack.length === 0) {
      const ids = stackParam.split(',');
      const itemsToLoad = ids
        .map(id => supplements.find(s => s.id === id))
        .filter(Boolean)
        .map(s => ({
          supplementId: s.id,
          dosage: (s.dosage.min + s.dosage.max) / 2,
          timing: s.dosage.timing,
        }));
      if (itemsToLoad.length > 0) {
        loadStack(itemsToLoad);
        track('stack_view_shared', { supplement_ids: stackParam, stack_size: itemsToLoad.length });
      }
    }
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
      <SEOOptimizer page="home" />

      {/* How It Works */}
      <div className="mb-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl border border-primary-100 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-ink-900 text-center mb-2">Build Your Perfect Nootropic Stack</h1>
        <p className="text-ink-500 text-center mb-6 text-sm">The free nootropic stack builder — 195 supplements, real-time synergy analysis, no account required.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary-800 text-white font-bold flex items-center justify-center mx-auto mb-3">1</div>
            <h3 className="font-semibold text-sm mb-1">Set Your Goals</h3>
            <p className="text-xs text-ink-500">Pick what you want to optimize — focus, energy, mood, memory, or creativity.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary-800 text-white font-bold flex items-center justify-center mx-auto mb-3">2</div>
            <h3 className="font-semibold text-sm mb-1">Build Your Stack</h3>
            <p className="text-xs text-ink-500">Add supplements from 195 compounds. Get real-time synergy analysis and recommendations.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary-800 text-white font-bold flex items-center justify-center mx-auto mb-3">3</div>
            <h3 className="font-semibold text-sm mb-1">Optimize with Stack Score</h3>
            <p className="text-xs text-ink-500">Your stack gets a 0-100 score across synergy, coverage, balance, and efficiency.</p>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-6 text-xs text-ink-400">
          <span>195 supplements</span>
          <span>&middot;</span>
          <span>60+ interactions mapped</span>
          <span>&middot;</span>
          <span>9 mechanism groups</span>
        </div>
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-ink-500 mb-8 py-4 border-y border-ink-100">
        {[
          { stat: '195', label: 'Supplements' },
          { stat: '93+', label: 'Research Articles' },
          { stat: '60+', label: 'Interactions Mapped' },
          { stat: '8', label: 'Curated Stacks' },
          { stat: 'Free', label: 'No Account Required' },
        ].map(({ stat, label }) => (
          <div key={label} className="text-center">
            <div className="font-bold text-ink-900 text-lg">{stat}</div>
            <div className="text-xs text-ink-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Goals and Stack */}
        <div className="lg:col-span-1 space-y-6">
          <GoalSelector />
          <StackPanel />
          <StackProtocolBuilder />
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

      {/* Trusted Resources */}
      <div className="mt-8 p-6 bg-white rounded-xl border">
        <h2 className="text-lg font-semibold text-ink-900 mb-1">Research & References</h2>
        <p className="text-sm text-ink-500 mb-4">Supplement data cross-referenced with peer-reviewed sources and trusted industry resources.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Examine.com', desc: 'Supplement research database', url: 'https://examine.com', icon: '🔬' },
            { name: 'PubMed', desc: 'Clinical research studies', url: 'https://pubmed.ncbi.nlm.nih.gov', icon: '📚' },
            { name: 'Nootropics Depot', desc: 'Third-party lab tested', url: 'https://nootropicsdepot.com', icon: '🧪' },
            { name: 'Labdoor', desc: 'Supplement quality rankings', url: 'https://labdoor.com', icon: '⭐' },
          ].map(resource => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col p-3 rounded-lg border hover:border-primary-300 hover:bg-primary-050 transition-all group"
            >
              <span className="text-2xl mb-1">{resource.icon}</span>
              <span className="text-sm font-medium text-ink-700 group-hover:text-primary-700">{resource.name}</span>
              <span className="text-xs text-ink-500">{resource.desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-800" />
            Popular Nootropic Guides
          </h2>
          <Link to="/blog" className="text-sm text-primary-800 hover:underline">View all {articleCount} articles →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredArticles.map(article => (
            <Link key={article.slug} to={`/blog/${article.slug}`}>
              <div className="p-4 rounded-lg border border-ink-200 hover:border-primary-300 hover:shadow-sm transition-all bg-white">
                <div className="flex flex-wrap gap-1 mb-2">
                  {article.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs bg-primary-050 text-primary-800 px-2 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
                <p className="text-sm font-medium text-ink-900 hover:text-primary-700 leading-snug">{article.title}</p>
                <p className="text-xs text-ink-400 mt-1">{article.readTime} min read</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

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
      <div className="min-h-screen bg-surface-page">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-bold text-ink-900">NootropicStacker</span>
                  <p className="hidden sm:block text-sm text-ink-500">Build Your Perfect Nootropic Stack</p>
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
                <NavLink to="/best-nootropics" icon={Award}>Best Nootropics</NavLink>
                <NavLink to="/best-stacks" icon={Layers}>Best Stacks</NavLink>
                <NavLink to="/reviews" icon={Star}>Reviews</NavLink>
                <NavLink to="/compare-supplements" icon={GitCompare}>Compare</NavLink>
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
            <NavLink to="/best-nootropics" icon={Award}>Best</NavLink>
            <NavLink to="/best-stacks" icon={Layers}>Stacks</NavLink>
            <NavLink to="/reviews" icon={Star}>Reviews</NavLink>
            <NavLink to="/compare-supplements" icon={GitCompare}>Compare</NavLink>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Amazon Associates affiliate disclosure — visible above the fold on every page (NOO-40) */}
          <div
            data-testid="affiliate-disclosure"
            className="disclosure disclosure--inline mb-2"
          >
            <p className="disclosure__body">
              <strong>Affiliate Disclosure:</strong> As an Amazon Associate we earn from qualifying purchases.
            </p>
          </div>

          {/* Medical Disclaimer */}
          <Alert className="mb-3 border-warn-100 bg-warn-100 py-2">
            <AlertTriangle className="h-3 w-3 text-warn-500" />
            <AlertDescription className="text-warn-700 text-sm">
              <strong>Important:</strong> Educational purposes only. Consult healthcare professionals before starting supplements.
            </AlertDescription>
          </Alert>

          {/* Routes */}
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-ink-500 text-sm">Loading...</div></div>}>
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
            <Route path="/contact" element={<><SEOOptimizer page="home" customTitle="Contact NootropicStacker" customDescription="Get in touch with the NootropicStacker team." /><ContactPage /></>} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/best-nootropics" element={<BestNootropicsPage />} />
            <Route path="/best-stacks" element={<BestStacksPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/compare-supplements" element={<ComparisonPage />} />
            <Route path="/nootropics-for-focus" element={<NootropicsForFocusPage />} />
            <Route path="/nootropics-for-anxiety" element={<NootropicsForAnxietyPage />} />
            <Route path="/start-here" element={<Suspense fallback={<div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div></div>}><StartHerePage /></Suspense>} />
            <Route path="/downloads/10-stacks" element={<Suspense fallback={<div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div></div>}><LeadMagnetDownloadPage /></Suspense>} />
            <Route path="/guides/:slug" element={<GuideRedirect />} />
            <Route path="*" element={
              <div className="text-center py-20">
                <h2 className="text-4xl font-bold mb-4">404</h2>
                <p className="text-ink-500 mb-6">Page not found. Let's get you back on track.</p>
                <div className="flex justify-center gap-4">
                  <Link to="/"><Button>Stack Builder</Button></Link>
                  <Link to="/supplements"><Button variant="outline">Supplement Library</Button></Link>
                </div>
              </div>
            } />
          </Routes>
          </Suspense>
        </main>

        {/* Stack Score Floating Widget */}
        <StackScoreWidget />

        {/* Footer */}
        <footer className="footer mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 max-w-2xl mx-auto">
              <NewsletterCapture />
            </div>
            <div className="text-center text-sm">
              <p className="mb-2">
                <strong>NootropicStacker</strong> - Built for biohackers who want to optimize their supplement stacks safely
              </p>
              <p className="mb-4">
                This tool provides educational information only. Always consult healthcare professionals for medical advice.
              </p>
              <div className="flex justify-center items-center gap-4 text-xs mb-4">
                <Link to="/supplements" className="hover:text-primary-300">195 Supplements</Link>
                <span className="text-ink-400">•</span>
                <Link to="/blog" className="hover:text-primary-300">Blog</Link>
                <span className="text-ink-400">•</span>
                <Link to="/families" className="hover:text-primary-300">Family Guides</Link>
                <span className="text-ink-400">•</span>
                <Link to="/faq" className="hover:text-primary-300">FAQ</Link>
                <span className="text-ink-400">•</span>
                <Link to="/glossary" className="hover:text-primary-300">Glossary</Link>
                <span className="text-ink-400">•</span>
                <Link to="/news" className="hover:text-primary-300">Latest News</Link>
                <span className="text-ink-400">•</span>
                <Link to="/contact" className="hover:text-primary-300">Contact</Link>
                <span className="text-ink-400">•</span>
                <Link to="/start-here" className="hover:text-primary-300">Start Here</Link>
                <span className="text-ink-400">•</span>
                <Link to="/reviews" className="hover:text-primary-300">Reviews</Link>
              </div>

              <div className="text-xs text-ink-400 mt-2">
                <p>Affiliate Disclosure: NootropicStacker participates in the Amazon Associates program and other affiliate programs. We earn commissions from qualifying purchases at no extra cost to you.</p>
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
