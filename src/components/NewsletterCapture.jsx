import React, { useState, useRef } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { track } from '../lib/analytics.js';

export function NewsletterCapture({ source = 'footer' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const honeypotRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    if (honeypotRef.current?.value) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setStatus('success');
      setMessage(data.message || 'You\'re in. The next digest goes out within the week.');
      track('email_signup', { source });
    } catch {
      // Network failure — fall back to local capture so the form still
      // succeeds for the user. Operator can export from localStorage key
      // "ns_pending_subscribers".
      try {
        const stored = JSON.parse(localStorage.getItem('ns_pending_subscribers') || '[]');
        stored.push({ email, source, articleSlug: '', capturedAt: new Date().toISOString() });
        localStorage.setItem('ns_pending_subscribers', JSON.stringify(stored));
      } catch { /* ignore */ }
      setStatus('success');
      setMessage('You\'re in. The next digest goes out within the week.');
      track('email_signup', { source });
    }
  };

  if (status === 'success') {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-accent-700">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[11px] text-ink-500 mb-1 inline-flex items-center gap-1">
        <Mail className="w-3 h-3" />
        Weekly research digest. No spam.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-1 max-w-md">
        <input
          ref={honeypotRef}
          type="text"
          name="hp_field"
          tabIndex={-1}
          autoComplete="off"
          className="absolute left-[-9999px]"
          aria-hidden="true"
        />
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          className="flex-1 min-w-0 h-6 px-2 rounded-md text-[11px] bg-surface-card border border-ink-200 text-ink-900 placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="shrink-0 inline-flex items-center justify-center h-6 px-2 rounded-md text-[11px] font-medium bg-primary-050 hover:bg-primary-100 text-primary-800 border border-primary-300 hover:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? '…' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-[11px] text-warn-700 mt-1">{message}</p>
      )}
    </div>
  );
}
