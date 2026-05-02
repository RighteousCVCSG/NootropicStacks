import React, { useState, useEffect, useCallback } from 'react';
import { X, Mail } from 'lucide-react';
import { EmailCaptureForm } from './EmailCaptureForm.jsx';

const COOKIE_NAME = 'ns_exit_intent_dismissed';
const COOKIE_DAYS = 30;

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

export function ExitIntentPopup({ articleSlug }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (getCookie(COOKIE_NAME)) {
      setDismissed(true);
      return;
    }
    setDismissed(false);
  }, []);

  const handleMouseLeave = useCallback((e) => {
    if (dismissed || show) return;
    if (e.clientY <= 0) {
      setShow(true);
    }
  }, [dismissed, show]);

  useEffect(() => {
    if (dismissed) return;
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [dismissed, handleMouseLeave]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    setCookie(COOKIE_NAME, '1', COOKIE_DAYS);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-md shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-md text-ink-400 hover:text-ink-700 hover:bg-surface-sunk transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-primary-700" />
          </div>
          <h2 className="text-xl font-semibold text-ink-900 mb-1">
            Don't Miss the Research
          </h2>
          <p className="text-sm text-ink-500">
            Get the nootropic weekly — stack guides, research summaries, and our free Starter Stack PDF.
          </p>
        </div>

        <EmailCaptureForm source="exit_intent" variant="inline_article" articleSlug={articleSlug} />

        <p className="text-xs text-ink-400 text-center mt-4">
          No spam, ever. Unsubscribe in one click.
        </p>
      </div>
    </div>
  );
}
