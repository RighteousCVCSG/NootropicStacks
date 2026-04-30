// v2
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { AuthDialog } from './components/AuthDialog.jsx';
import { StackProvider } from './contexts/StackContext.jsx';
import { trackPageview } from './lib/analytics.js';
import { HomePage } from './components/HomePage.jsx';
import { SupplementLibrary } from './components/SupplementLibrary.jsx';
import { SupplementModal } from './components/SupplementModal.jsx';
import { SEOOptimizer } from './components/SEOOptimizer.jsx';
import { StackScoreWidget } from './components/StackScoreWidget.jsx';
import { NewsletterCapture } from './components/NewsletterCapture.jsx';
import { JsonLd } from './components/JsonLd.jsx';
import { buildOrganizationSchema, buildWebsiteSchema } from './lib/schema/builders.js';

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
const ResearchLibraryPage = lazy(() => import('./components/ResearchLibraryPage.jsx').then(m => ({ default: m.ResearchLibraryPage })));
const ContactPage = lazy(() => import('./components/ContactPage.jsx').then(m => ({ default: m.ContactPage })));
const BestNootropicsPage = lazy(() => import('./components/BestNootropicsPage.jsx').then(m => ({ default: m.BestNootropicsPage })));
const BestStacksPage = lazy(() => import('./components/BestStacksPage.jsx').then(m => ({ default: m.BestStacksPage })));
const ReviewsPage = lazy(() => import('./components/ReviewsPage.jsx').then(m => ({ default: m.ReviewsPage })));
const StartHerePage = lazy(() => import('./components/StartHerePage.jsx').then(m => ({ default: m.StartHerePage })));
const LeadMagnetDownloadPage = lazy(() => import('./components/LeadMagnetDownloadPage.jsx').then(m => ({ default: m.LeadMagnetDownloadPage })));
const ComparisonPage = lazy(() => import('./components/ComparisonPage.jsx').then(m => ({ default: m.ComparisonPage })));
const NootropicsForFocusPage = lazy(() => import('./components/NootropicsForFocusPage.jsx').then(m => ({ default: m.NootropicsForFocusPage })));
const NootropicsForAnxietyPage = lazy(() => import('./components/NootropicsForAnxietyPage.jsx').then(m => ({ default: m.NootropicsForAnxietyPage })));
const BrandKitSmokeTest = lazy(() => import('./components/BrandKitSmokeTest.jsx').then(m => ({ default: m.BrandKitSmokeTest })));
const CelebrityStacksPage = lazy(() => import('./components/CelebrityStacksPage.jsx').then(m => ({ default: m.CelebrityStacksPage })));
const VideosPage = lazy(() => import('./components/VideosPage.jsx').then(m => ({ default: m.VideosPage })));
const AffiliateDisclosurePage = lazy(() => import('./components/AffiliateDisclosurePage.jsx').then(m => ({ default: m.AffiliateDisclosurePage })));
const LearnHub = lazy(() => import('./components/LearnHub.jsx').then(m => ({ default: m.LearnHub })));
import { Button } from '@/components/ui/button.jsx';
import { Pill, Layers, Library, BookOpen, Home, HelpCircle, LogIn, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import './App.css';

// Medical disclaimer scoped to home, supplement, and stack routes
function ScopedMedicalDisclaimer() {
  const { pathname } = useLocation();
  const show =
    pathname === '/' ||
    pathname === '/supplements' ||
    pathname.startsWith('/supplements/') ||
    pathname === '/stacks' ||
    pathname.startsWith('/stacks/');
  if (!show) return null;
  return (
    <div className="callout callout--warn mb-3 py-2">
      <p className="callout__body text-sm">
        <strong>Important:</strong> Educational purposes only. Consult healthcare professionals before starting supplements.
      </p>
    </div>
  );
}

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
    <Link to={to} aria-current={isActive ? 'page' : undefined}>
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
        <span className="hidden sm:inline text-sm text-ink-700">
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
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebsiteSchema()} />
      <div className="min-h-screen bg-surface-page">
        {/* Header */}
        <header className="bg-surface-card shadow-sm border-b border-ink-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Pill className="w-5 h-5 text-ink-on-dark" />
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-bold text-ink-900">NootropicStacker</span>
                  <p className="hidden sm:block text-sm text-ink-700">Build Your Perfect Nootropic Stack</p>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                <NavLink to="/" icon={Home}>Build</NavLink>
                <NavLink to="/supplements" icon={Library}>Supplements</NavLink>
                <NavLink to="/stacks" icon={Layers}>Stacks</NavLink>
                <NavLink to="/learn" icon={BookOpen}>Learn</NavLink>
                <Link to="/quiz">
                  <Button size="sm" className="bg-primary-800 hover:bg-primary-700 text-ink-on-dark ml-2">
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Quiz
                  </Button>
                </Link>
              </nav>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <HeaderAuth />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        <nav className="md:hidden bg-surface-card border-b border-ink-200" aria-label="Mobile navigation">
          <div className="flex items-center">
            <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0 px-4 py-2">
              <NavLink to="/" icon={Home}>Build</NavLink>
              <NavLink to="/supplements" icon={Library}>Supplements</NavLink>
              <NavLink to="/stacks" icon={Layers}>Stacks</NavLink>
              <NavLink to="/learn" icon={BookOpen}>Learn</NavLink>
              <Link to="/quiz" className="shrink-0">
                <Button size="sm" className="bg-primary-800 hover:bg-primary-700 text-ink-on-dark">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Quiz
                </Button>
              </Link>
            </div>
            <div className="shrink-0 px-2 border-l border-ink-200">
              <ThemeToggle />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Medical Disclaimer (scoped to home, supplement, stack routes) */}
          <ScopedMedicalDisclaimer />

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
            <Route path="/research-library" element={
              <>
                <SEOOptimizer page="home" customTitle="Nootropics Research Library — Peer-Reviewed Studies | NootropicStacker" customDescription="Plain-English summaries of peer-reviewed nootropic research. Every study includes PubMed links, evidence quality ratings, and actionable supplementation takeaways." />
                <ResearchLibraryPage />
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
            <Route path="/learn" element={<LearnHub />} />
            <Route path="/start-here" element={<Suspense fallback={<div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div></div>}><StartHerePage /></Suspense>} />
            <Route path="/downloads/10-stacks" element={
              <>
                <SEOOptimizer page="home" customTitle="10 Evidence-Backed Nootropic Stacks — Free PDF | NootropicStacker" customDescription="Download a free PDF guide to 10 nootropic stacks. Every claim cites PubMed. Written by Vera Huang, CMO." />
                <LeadMagnetDownloadPage />
              </>
            } />
            <Route path="/guides/:slug" element={<GuideRedirect />} />
            <Route path="/celebrity-stacks" element={
              <>
                <SEOOptimizer page="home" customTitle="Celebrity Supplement Stacks — What Experts Actually Take | NootropicStacker" customDescription="We traced every supplement Huberman, Bryan Johnson, Peter Attia, Rhonda Patrick, and 4 others actually take back to the exact podcast episode or book page." />
                <CelebrityStacksPage />
              </>
            } />
            <Route path="/brand-kit" element={<BrandKitSmokeTest />} />
            <Route path="/videos" element={
              <>
                <SEOOptimizer page="home" customTitle="Nootropics Video Library — Curated Educational Videos | NootropicStacker" customDescription="Curated educational videos on supplements, stacking strategies, and the neuroscience behind cognitive enhancement — from top researchers and educators." />
                <VideosPage />
              </>
            } />
            <Route path="/affiliate-disclosure" element={
              <>
                <SEOOptimizer page="home" customTitle="Affiliate Disclosure Policy | NootropicStacker" customDescription="Learn about how NootropicStacker earns commissions through affiliate partnerships while maintaining editorial independence." />
                <AffiliateDisclosurePage />
              </>
            } />
            <Route path="*" element={
              <div className="text-center py-20">
                <h2 className="text-4xl font-bold mb-4">404</h2>
                <p className="text-ink-700 mb-6">Page not found. Let's get you back on track.</p>
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
          <div className="footer__inner">
            <div>
              <div className="footer__brand">NootropicStacker</div>
              <p className="text-sm opacity-70 mt-2">Built for biohackers who want to optimize their supplement stacks safely</p>
              <div className="mt-4">
                <NewsletterCapture />
              </div>
            </div>
            <div className="footer__col">
              <h4>Tools</h4>
              <Link to="/">Stack Builder</Link>
              <Link to="/quiz">Stack Quiz</Link>
              <Link to="/supplements">Supplement Library</Link>
              <Link to="/compare-supplements">Compare</Link>
            </div>
            <div className="footer__col">
              <h4>Learn</h4>
              <Link to="/blog">Blog</Link>
              <Link to="/families">Family Guides</Link>
              <Link to="/news">News & Research</Link>
              <Link to="/videos">Video Library</Link>
            </div>
            <div className="footer__col">
              <h4>Resources</h4>
              <Link to="/start-here">Start Here</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/glossary">Glossary</Link>
              <Link to="/reviews">Reviews</Link>
              <Link to="/research-library">Research Library</Link>
              <Link to="/celebrity-stacks">Celebrity Stacks</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div className="footer__legal">
            <span>Educational information only. Consult healthcare professionals for medical advice.</span>
            <span>As an Amazon Associate we earn from qualifying purchases.</span>
          </div>
        </footer>
      </div>
    </StackProvider>
    </AuthProvider>
  );
}

export default App;
