import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Mail, MessageSquare, CheckCircle } from 'lucide-react';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setStatus('loading');
    // Backend isn't wired — open the user's mail client with everything
    // pre-filled so the message actually gets to us. Falls back to the
    // success state once the mailto window opens.
    const subject = encodeURIComponent(`NootropicStacker contact — ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:info@nootropicstacker.com?subject=${subject}&body=${body}`;
    setTimeout(() => setStatus('success'), 250);
  };

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto py-8 text-center">
        <CheckCircle className="w-12 h-12 text-accent-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Mail client opened</h2>
        <p className="text-ink-700">If your email app didn't open, send your message to <a href="mailto:info@nootropicstacker.com" className="text-primary-700 hover:underline">info@nootropicstacker.com</a> directly. We'll reply within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Contact NootropicStacker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-ink-700 p-3 bg-primary-050 rounded-md">
            <Mail className="w-4 h-4 text-primary-700" />
            <span>Or email us directly: <a href="mailto:info@nootropicstacker.com" className="text-primary-700 hover:underline">info@nootropicstacker.com</a></span>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Your question or message..." rows={5} required />
            </div>
            <Button type="submit" className="w-full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
