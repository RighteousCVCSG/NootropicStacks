import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { ArrowRight, PlayCircle, ExternalLink } from 'lucide-react';

const ALL_VIDEOS = [
  {
    id: '1',
    title: "Lion's Mane Mushroom: NGF, Neuroplasticity & Cognitive Benefits",
    category: 'Supplement Deep Dives',
    categoryKey: 'deep-dives',
    channel: 'Huberman Lab',
    description: 'Deep dive into Lion\'s Mane mushroom — how NGF stimulation works, the clinical evidence for neuroplasticity, and optimal dosing protocols.',
    youtubeSearch: "lion's mane mushroom NGF neuroplasticity nootropic",
    theme: { from: '#0d1f2d', via: '#0f3a3a', to: '#1c5b4a', glyph: '🍄', textColor: '#9ee9c5' },
  },
  {
    id: '2',
    title: 'Ashwagandha KSM-66: Stress, Sleep & Cortisol Reduction',
    category: 'Supplement Deep Dives',
    categoryKey: 'deep-dives',
    channel: 'Nootropics Expert',
    description: 'Everything you need to know about Ashwagandha — mechanisms, what the RCTs actually show, and how to use KSM-66 vs Sensoril.',
    youtubeSearch: 'ashwagandha KSM-66 cortisol stress nootropic science',
    theme: { from: '#1a0f2e', via: '#3a1f5b', to: '#5e3a92', glyph: '🌿', textColor: '#d8c4ff' },
  },
  {
    id: '3',
    title: 'Bacopa Monnieri: The Science of Memory Enhancement',
    category: 'Supplement Deep Dives',
    categoryKey: 'deep-dives',
    channel: 'Examine.com',
    description: 'Why Bacopa is the most clinically validated memory supplement — mechanism, timing, and what 4–8 weeks of consistent use actually does.',
    youtubeSearch: 'bacopa monnieri memory enhancement clinical science',
    theme: { from: '#0b1d2b', via: '#15425e', to: '#2a78a8', glyph: '🧠', textColor: '#a5dbff' },
  },
  {
    id: '4',
    title: 'How to Build a Nootropic Stack from Scratch',
    category: 'Stack Building',
    categoryKey: 'stack-building',
    channel: 'Nootropics Expert',
    description: 'A beginner-friendly framework for building your first nootropic stack — starting simple, understanding synergy, and layering up safely.',
    youtubeSearch: 'how to build nootropic stack beginners guide',
    theme: { from: '#102015', via: '#1f4a32', to: '#3d8a5e', glyph: '🧱', textColor: '#b8f0cc' },
  },
  {
    id: '5',
    title: 'Caffeine + L-Theanine: The Perfect Combination Explained',
    category: 'Stack Building',
    categoryKey: 'stack-building',
    channel: 'Thomas DeLauer',
    description: 'Why caffeine + L-theanine is the most-studied nootropic pairing in existence — the science behind synergy and how to dial in your ratio.',
    youtubeSearch: 'caffeine l-theanine stack combination science benefits',
    theme: { from: '#1f150b', via: '#5b3a1c', to: '#a76a35', glyph: '☕', textColor: '#ffd9a6' },
  },
  {
    id: '6',
    title: 'The Ultimate Focus Stack: Alpha GPC + Lion\'s Mane + Bacopa',
    category: 'Stack Building',
    categoryKey: 'stack-building',
    channel: 'Nootropics Expert',
    description: 'Building a layered focus stack that covers acetylcholine, neuroplasticity, and anxiety — all in one evidence-based protocol.',
    youtubeSearch: "alpha GPC lion's mane bacopa focus stack nootropics",
    theme: { from: '#0d1f2d', via: '#1a4a6e', to: '#2e89c7', glyph: '🎯', textColor: '#aae0ff' },
  },
  {
    id: '7',
    title: 'Nootropics Explained: Mechanisms, Receptors & Pathways',
    category: 'Science & Research',
    categoryKey: 'science',
    channel: 'Huberman Lab',
    description: 'A plain-English explainer on the neuroscience behind nootropics — receptors, neurotransmitters, and what cognitive enhancement actually means.',
    youtubeSearch: 'nootropics neuroscience mechanisms receptors explained',
    theme: { from: '#0f0a1f', via: '#2c1f5b', to: '#4a3a92', glyph: '⚛️', textColor: '#c3b3ff' },
  },
  {
    id: '8',
    title: 'How Memory Works: Encoding, Consolidation & Retrieval',
    category: 'Science & Research',
    categoryKey: 'science',
    channel: 'Huberman Lab',
    description: 'Understanding the three stages of memory formation and which supplements meaningfully target each stage of the process.',
    youtubeSearch: 'memory encoding consolidation retrieval neuroscience',
    theme: { from: '#0a1f1f', via: '#1f4a4a', to: '#3a8a8a', glyph: '💡', textColor: '#a8e8e8' },
  },
  {
    id: '9',
    title: 'Neuroplasticity: How Your Brain Rewires Itself',
    category: 'Science & Research',
    categoryKey: 'science',
    channel: 'Andrew Huberman',
    description: 'The science of neuroplasticity and how nootropics like Lion\'s Mane and Bacopa support long-term structural brain changes.',
    youtubeSearch: 'neuroplasticity brain rewiring science nootropics',
    theme: { from: '#1f0a1f', via: '#5b1f5b', to: '#a23a8a', glyph: '🌌', textColor: '#ffb8e8' },
  },
  {
    id: '10',
    title: "Sleep Optimization: The Most Powerful Nootropic You're Ignoring",
    category: 'Lifestyle',
    categoryKey: 'lifestyle',
    channel: 'Huberman Lab',
    description: 'Why sleep is the most powerful nootropic and how to structure your supplement stack around sleep quality for maximum cognitive output.',
    youtubeSearch: 'sleep optimization cognitive performance nootropic recovery',
    theme: { from: '#08111f', via: '#1a2c5b', to: '#3a5a92', glyph: '🌙', textColor: '#b8caff' },
  },
  {
    id: '11',
    title: 'Morning Routine with Nootropics: Timing & Sequencing',
    category: 'Lifestyle',
    categoryKey: 'lifestyle',
    channel: 'Thomas DeLauer',
    description: 'How to sequence your nootropics with breakfast, coffee, and your morning workflow for maximum effect — practical and science-backed.',
    youtubeSearch: 'morning routine nootropics timing sequencing biohacking',
    theme: { from: '#1f1a0a', via: '#5b4a1f', to: '#c79235', glyph: '☀️', textColor: '#ffe5a6' },
  },
  {
    id: '12',
    title: 'Biohacking Basics: High-Leverage Fundamentals Without the Hype',
    category: 'Lifestyle',
    categoryKey: 'lifestyle',
    channel: 'Tim Ferriss',
    description: 'A grounded introduction to biohacking — cutting through the hype to the highest-leverage basics that actually move the needle.',
    youtubeSearch: 'biohacking basics fundamentals supplements cognitive',
    theme: { from: '#0a1a1a', via: '#1f3a4a', to: '#3a7080', glyph: '⚡', textColor: '#a8e0ff' },
  },
];

const CATEGORY_TABS = [
  { key: 'all', label: 'All Videos' },
  { key: 'deep-dives', label: 'Supplement Deep Dives' },
  { key: 'stack-building', label: 'Stack Building' },
  { key: 'science', label: 'Science & Research' },
  { key: 'lifestyle', label: 'Lifestyle' },
];

const CATEGORY_COLORS = {
  'Supplement Deep Dives': 'bg-primary/10 text-primary border-primary/20',
  'Stack Building': 'bg-accent-0500/10 text-green-400 border-green-500/20',
  'Science & Research': 'bg-primary-0500/10 text-blue-400 border-primary-500/20',
  'Lifestyle': 'bg-primary-0500/10 text-purple-400 border-purple-500/20',
};

function VideoCard({ video }) {
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(video.youtubeSearch)}`;
  const { from, via, to, glyph, textColor } = video.theme;

  return (
    <div className="rounded-md border border-border/50 bg-card overflow-hidden flex flex-col group hover:border-border transition-colors">
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '16/9',
          background: `linear-gradient(135deg, ${from} 0%, ${via} 50%, ${to} 100%)`,
        }}
        aria-label={`Watch: ${video.title}`}
      >
        <span
          aria-hidden
          className="absolute select-none pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-30%, -55%) rotate(-12deg)',
            fontSize: '9rem',
            opacity: 0.18,
            filter: 'blur(0.5px)',
            lineHeight: 1,
          }}
        >
          {glyph}
        </span>

        <div
          className="absolute top-3 left-3 right-3 font-semibold leading-tight"
          style={{
            color: textColor,
            fontSize: '0.85rem',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.title}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-black/60 transition-all">
            <PlayCircle className="w-8 h-8 text-white drop-shadow" />
          </div>
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
          <span className="text-[0.65rem] font-semibold text-white/90 bg-black/50 backdrop-blur px-2 py-0.5 rounded">
            {video.channel}
          </span>
          <Badge className="bg-black/70 text-white border-0 text-xs gap-1">
            <ExternalLink className="w-2.5 h-2.5" /> YouTube
          </Badge>
        </div>
      </a>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`text-xs ${CATEGORY_COLORS[video.category]}`}>
            {video.category}
          </Badge>
          <span className="text-xs text-ink-500">{video.channel}</span>
        </div>
        <h3 className="font-semibold text-foreground text-sm leading-snug">
          {video.title}
        </h3>
        <p className="text-xs text-ink-500 leading-relaxed flex-1">
          {video.description}
        </p>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1"
        >
          <Button size="sm" variant="outline" className="w-full text-xs border-border/50 gap-1 h-7">
            Watch on YouTube <ExternalLink className="w-3 h-3" />
          </Button>
        </a>
      </div>
    </div>
  );
}

export default function VideosPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="container max-w-6xl">

        <div className="mb-10 text-center">
          <Badge className="bg-primary/15 text-primary border-primary/30 mb-4">
            <PlayCircle className="w-3 h-3 mr-1" />
            Video Library
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
            Nootropics Video Library
          </h1>
          <p className="text-lg text-ink-500 max-w-2xl mx-auto leading-relaxed">
            Curated educational videos on supplements, stacking strategies, and the neuroscience behind cognitive enhancement — from top researchers and educators.
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-14">
          <TabsList className="mb-8 flex-wrap h-auto gap-1 bg-card border border-border/50 p-1">
            {CATEGORY_TABS.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_VIDEOS.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          </TabsContent>

          {['deep-dives', 'stack-building', 'science', 'lifestyle'].map((key) => (
            <TabsContent key={key} value={key}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ALL_VIDEOS.filter((v) => v.categoryKey === key).map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="p-8 rounded-md border border-primary/20 bg-primary/5 text-center">
          <PlayCircle className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            Ready to apply what you've learned?
          </h2>
          <p className="text-ink-500 text-sm mb-6 max-w-md mx-auto">
            Use the Stack Builder to combine the supplements you've researched into a personalized, interaction-checked protocol.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="gap-2">
                Build Your Stack <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/research-library">
              <Button variant="outline" className="border-border/50 gap-2">
                Research Library <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
