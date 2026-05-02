import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from '@/components/ui/command.jsx';
import {
  Library, Layers, BookOpen, HelpCircle, Sparkles, Compass, Star, FileText, Mail,
} from 'lucide-react';
import { supplements } from '../data/supplements.js';
import { predefinedStacks } from '../data/predefinedStacks.js';
import { blogArticlesIndex } from '../data/blogArticlesIndex.js';
import { track } from '../lib/analytics.js';

// Static destinations always available in the palette.
const STATIC_ROUTES = [
  { path: '/',                  label: 'Home — Stack Builder',   icon: Layers },
  { path: '/quiz',              label: 'Take the Quiz',          icon: HelpCircle },
  { path: '/supplements',       label: 'Supplement Library',     icon: Library },
  { path: '/stacks',            label: 'Pre-built Stacks',       icon: Sparkles },
  { path: '/celebrity-stacks',  label: 'Celebrity Stacks',       icon: Star },
  { path: '/best-stacks',       label: 'Best Stacks',            icon: Sparkles },
  { path: '/best-nootropics',   label: 'Best Nootropics',        icon: Compass },
  { path: '/learn',             label: 'Learn — Hub',            icon: BookOpen },
  { path: '/blog',              label: 'Blog',                   icon: FileText },
  { path: '/research-library',  label: 'Research Library',       icon: BookOpen },
  { path: '/glossary',          label: 'Glossary',               icon: BookOpen },
  { path: '/families',          label: 'Supplement Families',    icon: Library },
  { path: '/faq',               label: 'FAQ',                    icon: HelpCircle },
  { path: '/contact',           label: 'Contact',                icon: Mail },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Global Cmd+K / Ctrl+K binding.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Slim, search-friendly views of each catalog. cmdk does the fuzzy
  // matching for us — we just need to feed it strings via `value`.
  const supplementItems = useMemo(
    () =>
      supplements.map((s) => ({
        path: `/supplements/${s.id}`,
        label: s.name,
        sublabel: s.category?.replace('-', ' '),
        keywords: [s.name, s.id, s.category, ...(s.benefits || [])].filter(Boolean).join(' '),
      })),
    []
  );

  const stackItems = useMemo(
    () =>
      predefinedStacks.map((stack) => ({
        path: `/stacks#${stack.id}`,
        label: stack.name,
        sublabel: `${stack.level} · ${stack.supplements?.length || 0} supplements`,
        keywords: [stack.name, stack.id, stack.level, ...(stack.goals || [])].filter(Boolean).join(' '),
      })),
    []
  );

  const blogItems = useMemo(
    () =>
      blogArticlesIndex.slice(0, 50).map((a) => ({
        path: `/blog/${a.slug}`,
        label: a.title,
        sublabel: `${a.readTime || 5} min read`,
        keywords: [a.title, ...(a.tags || [])].filter(Boolean).join(' '),
      })),
    []
  );

  const handleSelect = (path, source) => {
    track('command_palette_select', { path, source });
    setOpen(false);
    // Use hash or path navigation as appropriate.
    if (path.includes('#')) {
      const [base, hash] = path.split('#');
      navigate(base);
      // Defer hash scroll until after navigation
      setTimeout(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      navigate(path);
    }
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search NootropicStacker"
      description="Jump to any supplement, stack, blog post, or page. Press Cmd/Ctrl+K to toggle."
    >
      <CommandInput placeholder="Search supplements, stacks, articles, pages..." />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>

        <CommandGroup heading="Pages">
          {STATIC_ROUTES.map((r) => (
            <CommandItem
              key={r.path}
              value={r.label}
              onSelect={() => handleSelect(r.path, 'page')}
            >
              <r.icon className="w-4 h-4" />
              <span>{r.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading={`Supplements (${supplementItems.length})`}>
          {supplementItems.map((s) => (
            <CommandItem
              key={s.path}
              value={s.keywords}
              onSelect={() => handleSelect(s.path, 'supplement')}
            >
              <Library className="w-4 h-4" />
              <span>{s.label}</span>
              {s.sublabel && (
                <CommandShortcut className="capitalize">{s.sublabel}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading={`Pre-built Stacks (${stackItems.length})`}>
          {stackItems.map((s) => (
            <CommandItem
              key={s.path}
              value={s.keywords}
              onSelect={() => handleSelect(s.path, 'stack')}
            >
              <Sparkles className="w-4 h-4" />
              <span>{s.label}</span>
              {s.sublabel && <CommandShortcut>{s.sublabel}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading={`Recent Articles (${blogItems.length})`}>
          {blogItems.map((b) => (
            <CommandItem
              key={b.path}
              value={b.keywords}
              onSelect={() => handleSelect(b.path, 'blog')}
            >
              <FileText className="w-4 h-4" />
              <span>{b.label}</span>
              {b.sublabel && <CommandShortcut>{b.sublabel}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
