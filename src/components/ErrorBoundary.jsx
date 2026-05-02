import React from 'react';
import { Link } from 'react-router-dom';

// Top-level error boundary. Wraps <Routes /> so a render error in any
// page falls back to a recoverable card instead of blanking the site.
// "Reset" clears Stack/auth localStorage state on the assumption that
// a malformed cached stack is the most common cause of a render throw.
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', 'exception', {
          description: `${error?.message || 'unknown'} | ${info?.componentStack?.slice(0, 200) || ''}`,
          fatal: false,
        });
      } catch { /* ignore */ }
    }
    if (typeof console !== 'undefined') console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('ns_stack');
      localStorage.removeItem('ns_user_goals');
    } catch { /* ignore */ }
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') window.location.assign('/');
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="rounded-md bg-surface-card border border-danger-300 p-4 space-y-3">
          <h1 className="text-base font-semibold text-ink-900">Something rendered wrong on this page.</h1>
          <p className="text-xs text-ink-700">
            This is likely a bad cached stack or a malformed deep link. Reset clears the saved stack and sends you back to the homepage.
          </p>
          {this.state.error?.message && (
            <pre className="text-[10px] text-ink-500 bg-surface-sunk rounded p-2 overflow-x-auto">
              {String(this.state.error.message)}
            </pre>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-semibold bg-primary-700 text-white hover:bg-primary-800 transition-colors"
            >
              Reset and go home
            </button>
            <Link
              to="/build"
              className="inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-semibold border border-ink-200 text-ink-700 hover:border-primary-300 hover:text-ink-900 transition-colors"
            >
              Open Stack Builder
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
