import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Mail, CheckCircle, Download, Lock, ArrowRight } from 'lucide-react';

const VARIANT_STYLES = {
  inline_article: {
    wrapper: 'bg-primary-050 border border-primary-300 rounded-md p-4',
    headline: 'text-sm font-semibold text-primary-900',
    subtext: 'text-xs text-primary-800',
    inputClass: 'text-sm h-8',
    buttonClass: 'h-8 shrink-0',
    successIcon: CheckCircle,
  },
  save_gate: {
    wrapper: 'bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-md p-3',
    headline: 'text-base font-semibold text-primary-900',
    subtext: 'text-xs text-primary-700',
    inputClass: 'text-sm h-9',
    buttonClass: 'h-9 shrink-0',
    successIcon: Lock,
  },
  lead_magnet: {
    wrapper: 'bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md p-3 sm:p-4 shadow-2',
    headline: 'text-lg font-semibold text-white',
    subtext: 'text-xs text-primary-300',
    inputClass: 'text-sm h-9 bg-white/95',
    buttonClass: 'h-9 shrink-0 bg-white text-primary-800 hover:bg-primary-050',
    successIcon: Download,
  },
};

export function trackEvent(action, label, value) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: 'engagement',
        event_label: label,
        value: value,
      });
    }
  } catch {}
}

export function EmailCaptureForm({ source = 'lead_magnet', variant = 'inline_article', leadMagnet, articleSlug }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const honeypotRef = useRef(null);

  const isLeadMagnet = variant === 'lead_magnet';
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.inline_article;
  const SuccessIcon = styles.successIcon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    if (honeypotRef.current?.value) {
      return;
    }

    setStatus('loading');
    trackEvent('email_capture_attempt', source, 0);

    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          leadMagnet,
          articleSlug,
          hp_field: honeypotRef.current?.value || '',
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        const messages = {
          inline_article: "You're in! Check your inbox for the PDF.",
          save_gate: 'Stack saved! Check your email to confirm.',
          lead_magnet: "You're in! Check your inbox for the download link.",
        };
        setMessage(data.message || messages[variant] || 'Subscribed!');
        setDownloadUrl(data.downloadUrl || null);
        trackEvent('email_capture_success', source, 0);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
        trackEvent('email_capture_error', source, 0);
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
      trackEvent('email_capture_error', source, 0);
    }
  };

  if (status === 'success') {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 py-6 text-center ${styles.wrapper}`}>
        <SuccessIcon className={`w-8 h-8 ${variant === 'lead_magnet' ? 'text-white' : 'text-accent-700'}`} />
        <div>
          <p className={`text-sm font-medium ${variant === 'lead_magnet' ? 'text-white' : 'text-accent-700'}`}>
            {message}
          </p>
          <p className={`text-xs mt-1 ${variant === 'lead_magnet' ? 'text-primary-300' : 'text-ink-500'}`}>
            We'll never share your email. Unsubscribe anytime.
          </p>
        </div>
        {downloadUrl && (
          <a
            href={downloadUrl}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary-800 rounded-md text-sm font-medium hover:bg-primary-050 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download Your Guide
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Mail className={`w-4 h-4 shrink-0 ${variant === 'lead_magnet' ? 'text-primary-300' : 'text-primary-700'}`} />
          <div>
            <p className={styles.headline}>
              {isLeadMagnet ? 'Get the Free Guide' : 'Get the weekly nootropic research digest'}
            </p>
            <p className={styles.subtext}>
              {isLeadMagnet
                ? '10 evidence-backed stacks — enter your email for instant PDF access.'
                : 'Stack tips, new research, and what\'s working. No spam.'}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            ref={honeypotRef}
            type="text"
            name="hp_field"
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px]"
            aria-hidden="true"
          />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${styles.inputClass} min-w-0 w-full sm:w-48`}
            disabled={status === 'loading'}
            required
          />
          <Button
            type="submit"
            size="sm"
            className={styles.buttonClass}
            disabled={status === 'loading' || !email}
          >
            {status === 'loading' ? (
              '...'
            ) : (
              <span className="flex items-center gap-1">
                {isLeadMagnet ? 'Get PDF' : 'Subscribe'}
                <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </Button>
        </form>
        {status === 'error' && (
          <p className="text-xs text-danger-500 w-full sm:w-auto">{message}</p>
        )}
      </div>
    </div>
  );
}
