import React, { useState } from 'react';
import { SEOOptimizer } from './SEOOptimizer.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import {
  Download, CheckCircle, Brain, BookOpen, FileText, AlertTriangle,
  ArrowRight, Shield, Star, Layers, ChevronRight, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AffiliateDisclosure from './AffiliateDisclosure.jsx';

const STACK_PREVIEWS = [
  { name: 'Caffeine + L-Theanine', tier: 'Tier 1', target: 'Focused calm' },
  { name: 'Bacopa monnieri', tier: 'Tier 2', target: 'Memory consolidation' },
  { name: 'Lion\'s Mane', tier: 'Tier 3', target: 'Cognitive support (55+)' },
  { name: 'Rhodiola rosea', tier: 'Tier 2', target: 'Stress resilience' },
  { name: 'Creatine monohydrate', tier: 'Tier 1', target: 'Cognitive endurance' },
  { name: 'Omega-3 EPA/DHA', tier: 'Tier 1', target: 'Mood + cognition foundation' },
  { name: 'Ashwagandha', tier: 'Tier 1', target: 'Cortisol reduction' },
  { name: 'L-Tyrosine', tier: 'Tier 2', target: 'Performance under pressure' },
  { name: 'Magnesium L-threonate', tier: 'Tier 2', target: 'Sleep + synaptic plasticity' },
  { name: 'Phosphatidylserine', tier: 'Tier 2', target: 'Age-related cognitive support' },
];

export function StacksGuidePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'lead_magnet' }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('You\'re in! Your download is ready below.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <>
      <SEOOptimizer
        page="home"
        customTitle="10 Evidence-Backed Nootropic Stacks — Free PDF | NootropicStacker"
        customDescription="Download our free guide to 10 nootropic stacks the literature actually supports — each graded by trial design, replication, and population, not by hype."
      />

      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
            <CheckCircle className="w-5 h-5" />
            {message}
          </div>
          <a
            href="/lead-magnet-v2.pdf"
            download
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium transition-colors text-base"
          >
            <Download className="w-5 h-5" />
            Download the PDF
          </a>
          <p className="text-xs text-green-700 mt-2">28 PubMed citations · 13 pages · 10 stacks</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold mb-3">
            <FileText className="w-4 h-4" />
            Free PDF · Edition 01
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            10 Evidence-Backed Nootropic Stacks
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl">
            Ten combinations the literature actually supports — each graded by trial design,
            replication, and population. 28 PubMed citations, 13 pages, no hype.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {STACK_PREVIEWS.map((stack, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{stack.name}</div>
                <div className="text-xs text-gray-500">{stack.target}</div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${
                stack.tier === 'Tier 1' ? 'bg-green-100 text-green-700' :
                stack.tier === 'Tier 2' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {stack.tier}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Get the full guide
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter your email and we'll send you the download link. You'll also get our
            weekly nootropic research digest — new studies, stack tips, and what's working.
            No spam, unsubscribe anytime.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={status === 'loading'}
              required
            />
            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading' || !email}
              className="shrink-0"
            >
              {status === 'loading' ? 'Sending...' : 'Get the Free PDF'}
              {status === 'idle' && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </form>
          {status === 'error' && (
            <p className="text-xs text-red-600 mt-2">{message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: BookOpen, label: '28 citations', desc: 'All linked to PubMed' },
            { icon: Layers, label: '10 stacks', desc: 'Dosed and evidence-graded' },
            { icon: Star, label: 'Tier ratings', desc: 'Tier 1–3 by study quality' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <item.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>

        <AffiliateDisclosure variant="stacks" />
      </div>
    </>
  );
}
