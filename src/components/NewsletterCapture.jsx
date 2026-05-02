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
        body: JSON.stringify({
          email,
          source,
          articleSlug: '',
          hp_field: honeypotRef.current?.value || '',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('You\'re in! We\'ll send the best nootropic research your way.');
        track('email_signup', { source });
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
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
      <p className="text-xs text-ink-500 mb-1.5 inline-flex items-center gap-1">
        <Mail className="w-3 h-3" />
        Weekly research digest. No spam.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-1.5 max-w-sm">
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
          className="flex-1 min-w-0 h-7 px-2 rounded-md text-xs bg-surface-card border border-ink-200 text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-primary-500"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="shrink-0 inline-flex items-center justify-center h-7 px-2.5 rounded-md text-xs font-medium bg-primary-050 hover:bg-primary-100 text-primary-800 border border-primary-300 hover:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
