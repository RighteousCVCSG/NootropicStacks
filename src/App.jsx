// v2
import React, { useEffect, Suspense, lazy } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { Routes, Route, Link, useLocation, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { AuthDialog } from './components/AuthDialog.jsx';
import { StackProvider } from './contexts/StackContext.jsx';
import { trackPageview } from './lib/analytics.js';
import { HomePage } from './components/HomePage.jsx';
import { SupplementLibrary } from './components/SupplementLibrary.jsx';
import { SEOOptimizer } from './components/SEOOptimizer.jsx';
import { StackScoreWidget } from './components/StackScoreWidget.jsx';
import { StackDrawer } from './components/StackDrawer.jsx';
import { CommandPalette } from './components/CommandPalette.jsx';
import { Toaster } from './components/ui/sonner.jsx';
import { NewsletterCapture } from './components/NewsletterCapture.jsx';
import { JsonLd } from './components/JsonLd.jsx';
import { buildOrganizationSchema, buildWebsiteSchema } from './lib/schema/builders.js';

// Lazy-loaded route-level components
const StackBuilderPage = lazy(() => import('./components/StackBuilderPage.jsx').then(m => ({ default: m.StackBuilderPage })));
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
import { Layers, Library, BookOpen, Home, HelpCircle, LogIn, LogOut, User } from 'lucide-react';
import { Logo } from './components/Logo.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import './App.css';

// Medical disclaimer removed from page chrome. YMYL coverage is
// retained via the footer's full medical-disclaimer language.
function ScopedMedicalDisclaimer() {
  return null;
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

// Header nav link. Text-only (no leading icon) to match MeasureBoard /
// Linear / Vercel-style dashboard nav. Active state is a subtle ink-on-
// surface change, not a chunky filled pill.
function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
  const activeClass = isActive
    ? 'text-ink-900'
    : 'text-ink-500 hover:text-ink-900';

  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={`inline-flex items-center h-7 px-2 rounded-md text-xs font-medium transition-colors ${activeClass}`}
    >
      {children}
    </Link>
  );
}

// Header auth section. Backend isn't wired yet, so the Sign-In affordance
// is suppressed — pressing it would only ship a broken modal. The
// AuthContext + AuthDialog remain in the tree so the route can be
// re-enabled instantly once a real backend lands.
function HeaderAuth() {
  return null;
}

function GuideRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
}

// Library page (full-width). Cards link straight to /supplements/<id> —
// no inline modal, so we don't need any local state here.
function LibraryPage() {
  return (
    <>
      <SEOOptimizer page="supplements" />
      <SupplementLibrary />
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
        {/* Skip-to-content for keyboard users — invisible until focused. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[1000] focus:inline-flex focus:items-center focus:h-8 focus:px-3 focus:rounded-md focus:bg-primary-700 focus:text-white focus:text-xs focus:font-semibold"
        >
          Skip to main content
        </a>
        {/* Header — MeasureBoard-style: tight wordmark, no tagline, text-only
            nav with a single primary CTA. Dashboard tone, not marketing splash. */}
        <header className="bg-surface-page border-b border-ink-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary-800 rounded-md flex items-center justify-center shrink-0">
                  <Logo className="w-4 h-4 text-ink-on-dark" />
                </div>
                <span className="text-base font-semibold text-ink-900 tracking-tight">NootropicStacker</span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
                <NavLink to="/build">Build</NavLink>
                <NavLink to="/supplements">Supplements</NavLink>
                <NavLink to="/stacks">Stacks</NavLink>
                <NavLink to="/learn">Learn</NavLink>
                <Link
                  to="/quiz"
                  className="ml-2 inline-flex items-center text-xs font-medium text-primary-800 hover:text-primary-700 transition-colors"
                >
                  Quiz →
                </Link>
              </nav>

              <div className="flex items-center gap-1">
                <ThemeToggle />
                <HeaderAuth />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation — same text-only treatment as desktop.
            The scrollable strip has a right-edge gradient fade so users
            see there's more nav off-screen on narrow viewports. */}
        <nav className="md:hidden bg-surface-page border-b border-ink-200" aria-label="Mobile navigation">
          <div className="flex items-center">
            <div className="relative flex-1 min-w-0">
              <div className="flex items-center gap-0.5 overflow-x-auto px-3 py-1.5">
                <NavLink to="/build">Build</NavLink>
                <NavLink to="/supplements">Supplements</NavLink>
                <NavLink to="/stacks">Stacks</NavLink>
                <NavLink to="/learn">Learn</NavLink>
                <Link
                  to="/quiz"
                  className="shrink-0 ml-2 inline-flex items-center text-xs font-medium text-primary-800 hover:text-primary-700 transition-colors"
                >
                  Quiz →
                </Link>
              </div>
              <span
                aria-hidden
                className="pointer-events-none absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-surface-page to-transparent"
              />
            </div>
            <div className="shrink-0 px-1.5 border-l border-ink-200">
              <ThemeToggle />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Medical Disclaimer (scoped to home, supplement, stack routes) */}
          <ScopedMedicalDisclaimer />

          {/* Routes */}
          <ErrorBoundary>
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="text-ink-500 text-sm">Loading…</div></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/build" element={<StackBuilderPage />} />
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
              <div className="text-center py-20 max-w-md mx-auto">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-500 mb-2">404</p>
                <h2 className="text-2xl font-semibold text-ink-900 mb-2 tracking-tight">Page not found</h2>
                <p className="text-sm text-ink-500 mb-5">Let's get you back on track.</p>
                <div className="flex justify-center gap-2">
                  <Link
                    to="/build"
                    className="inline-flex items-center h-7 px-2.5 rounded-md text-xs font-medium bg-primary-050 hover:bg-primary-100 text-primary-800 border border-primary-300 hover:border-primary-500 transition-colors"
                  >
                    Stack Builder
                  </Link>
                  <Link
                    to="/supplements"
                    className="inline-flex items-center h-7 px-2.5 rounded-md text-xs font-medium bg-surface-card hover:bg-surface-sunk text-ink-700 border border-ink-200 hover:border-primary-500 transition-colors"
                  >
                    Supplement Library
                  </Link>
                </div>
              </div>
            } />
          </Routes>
          </Suspense>
          </ErrorBoundary>
        </main>

        {/* Stack Score Floating Widget */}
        <StackScoreWidget />

        {/* Stack Drawer */}
        <StackDrawer />

        {/* Cmd+K / Ctrl+K command palette */}
        <CommandPalette />

        {/* Toast notifications (used by addSupplement and friends) */}
        <Toaster />

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
              <Link to="/build">Stack Builder</Link>
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
            <span>© {new Date().getFullYear()} NootropicStacker. Educational information only. Consult healthcare professionals for medical advice.</span>
            <Link to="/affiliate-disclosure" className="hover:underline">
              As an Amazon Associate we earn from qualifying purchases. Affiliate disclosure →
            </Link>
          </div>
        </footer>
      </div>
    </StackProvider>
    </AuthProvider>
  );
}

export default App;
