import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Mail, CheckCircle } from 'lucide-react';

export function NewsletterCapture({ source = 'homepage_banner' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('You\'re in! We\'ll send the best nootropic research your way.');
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
      <div className="flex items-center justify-center gap-2 py-3 text-sm text-green-700 bg-green-50 rounded-lg px-4">
        <CheckCircle className="w-4 h-4" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Mail className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">Get the weekly nootropic research digest</p>
            <p className="text-xs text-blue-700">Stack tips, new research, and what's working. No spam.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-sm h-8 min-w-0 w-full sm:w-48"
            disabled={status === 'loading'}
          />
          <Button
            type="submit"
            size="sm"
            className="h-8 shrink-0"
            disabled={status === 'loading' || !email}
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </Button>
        </form>
        {status === 'error' && (
          <p className="text-xs text-red-600 w-full sm:w-auto">{message}</p>
        )}
      </div>
    </div>
  );
}
